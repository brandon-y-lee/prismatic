import ast
import concurrent
import json
import pandas as pd
import tiktoken
import requests

from dotenv import load_dotenv
from csv import writer
from openai import OpenAI
from PyPDF2 import PdfReader
from io import BytesIO
from scipy import spatial
from tenacity import retry, wait_random_exponential, stop_after_attempt
from IPython.display import display, Markdown, Latex
from tqdm import tqdm
from termcolor import colored

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from scipy import spatial
import boto3
import os
import httpx

app = FastAPI()

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
GPT_MODEL = "gpt-4-turbo-preview"
EMBEDDING_MODEL = "text-embedding-3-small"
client = OpenAI(api_key=OPENAI_API_KEY)

MONGO_URL = os.getenv('MONGO_URL')
mongo_client = MongoClient(MONGO_URL)
db = mongo_client['test']

DYNAMODB_TABLE_NAME = os.getenv('DYNAMODB_TABLE_NAME')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
dynamodb = boto3.resource('dynamodb', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=AWS_REGION)
dynamodb_table = dynamodb.Table(DYNAMODB_TABLE_NAME)

class Document(BaseModel):
  title: str
  pdf_url: str
  embeddings: List[float]

class DocumentQuery(BaseModel):
  query: str
  top_k: Optional[int] = 5

@app.post('/get-document/')
async def get_document(query: DocumentQuery):
  """
  Fetches a project from the 'projects' collection based on search parameters.
  
  :param uri: MongoDB connection URI.
  :param db_name: Name of the database.
  :param search_params: Dictionary of search parameters for finding the project.
  :return: Project data as a dictionary.
  """
  documents_collection = db['documents']
  regex_query = {"title": {"$regex": query.query, "$options": "i"}}  # Case-insensitive search
  documents = documents_collection.find(regex_query).limit(query.top_k)

  processed_documents = []
  for document in documents:
    document_dict = {
      "title": document['title'],
      "pdf_url": document['pdf_url']
    }
    processed_documents.append(document_dict)

    # Store references in library file
    response = await embedding_request(text=document['title'])
    file_reference = {
      "title": document['title'],
      "pdf_url": document['pdf_url'],
      "embeddings": response['data'][0]['embedding'],
    }
  
    # Insert file_reference into DynamoDB
    dynamodb_table.put_item(Item=file_reference)

  return processed_documents

async def embedding_request(text: str):
  response = client.embeddings.create(input=text, model=EMBEDDING_MODEL)
  return response

@app.post('/related-documents/')
async def strings_ranked_by_relatedness(query: DocumentQuery, top_n: int = 100 ):
  """Returns a list of strings and relatednesses, sorted from most related to least."""
  response = await embedding_request(query.query)
  query_embedding = response['data'][0]['embedding']

  scanned_documents = dynamodb_table.scan()
  items = scanned_documents['Items']

  strings_and_relatednesses = [
    (item["pdf_url"], 1 - spatial.distance.cosine(query_embedding, item["embedding"]))
    for item in items if "embeddings" in item
  ]

  strings_and_relatednesses.sort(key=lambda x: x[1], reverse=True)
  return strings_and_relatednesses[:top_n]

@app.get('/read-pdf/')
async def read_pdf(pdf_url: str):
  try:
    async with httpx.AsyncClient() as client:
        response = await client.get(pdf_url)
        response.raise_for_status()

    pdf_file = BytesIO(response.content)
    reader = PdfReader(pdf_file)
    pdf_text = ""
    for page in reader.pages:
      pdf_text += page.extract_text() + "\n"
    return pdf_text
  except Exception as e:
    print(f"Error reading PDF from {pdf_url}: {e}")
    return None

# Split a text into smaller chunks of size n, preferably ending at the end of a sentence
def create_chunks(text: str, n: int, tokenizer):
  """Returns successive n-sized chunks from provided text."""
  tokens = tokenizer.encode(text)
  i = 0
  while i < len(tokens):
    # Find the nearest end of sentence within a range of 0.5 * n and 1.5 * n tokens
    j = min(i + int(1.5 * n), len(tokens))
    while j > i + int(0.5 * n):
      # Decode the tokens and check for full stop or newline
      chunk = tokenizer.decode(tokens[i:j])
      if chunk.endswith(".") or chunk.endswith("\n"):
        break
      j -= 1
    # If no end of sentence found, use n tokens as the chunk size
    if j == i + int(0.5 * n):
      j = min(i + n, len(tokens))
    yield tokens[i:j]
    i = j

@app.post('/extract-chunk/')
async def extract_chunk_endpoint(background_tasks: BackgroundTasks, content: str, template_prompt: str):
    background_tasks.add_task(extract_chunk, content, template_prompt)
    return {"message": "Processing chunk extraction in the background."}

async def extract_chunk(content: str, template_prompt: str):
  """This function applies a prompt to some input content. In this case it returns a summarized chunk of text"""
  prompt = template_prompt + content
  response = await client.chat.completions.create(
    model=GPT_MODEL, messages=[{"role": "user", "content": prompt}], temperature=0
  )
  return response.choices[0].message.content

@app.post("/summarize-text/")
async def summarize_text(query: str):
  """This function does the following:
  - Reads in the documents.csv file in including the embeddings
  - Finds the closest file to the user's query
  - Scrapes the text out of the file and chunks it
  - Summarizes each chunk in parallel
  - Does one final summary and returns this to the user"""

  # A prompt to dictate how the recursive summarizations should approach the input paper
  summary_prompt = """Summarize this text from a document related to the construction industry. Extract any key points with reasoning.\n\nContent:"""

  matched_document = await strings_ranked_by_relatedness(DocumentQuery(query=query, top_k=1), top_n=1)

  if not matched_document:
    # If no documents found, fetch from MongoDB and insert into DynamoDB
    await get_document(DocumentQuery(query=query))
    # Re-query DynamoDB after insertion
    matched_document = await strings_ranked_by_relatedness(DocumentQuery(query=query, top_k=1), top_n=1)
    
  if not matched_document:
    return {"message": "No matching document found."}
  
  pdf_url = matched_document[0]
  pdf_text = await read_pdf(pdf_url)

  if not pdf_text:
    return "Failed to read the document content."
  
  # Initialise tokenizer
  tokenizer = tiktoken.get_encoding("cl100k_base")
  results = ""

  # Chunk up the document into 1500 token chunks
  chunks = create_chunks(pdf_text, 1500, tokenizer)
  text_chunks = [tokenizer.decode(chunk) for chunk in chunks]
  print("Summarizing each chunk of text")

  # Parallel process the summaries
  with concurrent.futures.ThreadPoolExecutor(
    max_workers=len(text_chunks)
  ) as executor:
    futures = [
      executor.submit(extract_chunk, chunk, summary_prompt)
      for chunk in text_chunks
    ]
    with tqdm(total=len(text_chunks)) as pbar:
      for _ in concurrent.futures.as_completed(futures):
        pbar.update(1)
    for future in futures:
      data = future.result()
      results += data

  # Final summary
  print("Summarizing into overall summary")
  response = client.chat.completions.create(
    model=GPT_MODEL,
    messages=[
      {
        "role": "user",
        "content": f"""Write a summary collated from this collection of key points extracted from the document.
          The summary should highlight the main topic, relevant information, and answer the user's query.
          User query: {query}
          The summary should be structured in bulleted lists following the headings Main Topic and Relevant Information.
          Key points:\n{results}\nSummary:\n""",
      }
    ],
    temperature=0,
  )
  return response

@app.post('/chat-completion-request/')
def chat_completion_request(messages, functions=None, model=GPT_MODEL):
  try:
    response = client.chat.completions.create(
      model=model,
      messages=messages,
      functions=functions,
    )
    return response
  except Exception as e:
    print("Unable to generate ChatCompletion response")
    print(f"Exception: {e}")
    return e
  
class Conversation:
  def __init__(self):
    self.conversation_history = []

  def add_message(self, role, content):
    message = {"role": role, "content": content}
    self.conversation_history.append(message)

  def display_conversation(self, detailed=False):
    role_to_color = {
      "system": "red",
      "user": "green",
      "assistant": "blue",
      "function": "magenta",
    }
    for message in self.conversation_history:
      print(
        colored(
          f"{message['role']}: {message['content']}\n\n",
          role_to_color[message["role"]],
        )
      )

# Initiate our get_articles and read_article_and_summarize functions
agent_functions = [
  {
    "name": "get_document",
    "description": """Use this function to get documents from MongoDB to answer user questions.
    Ensure that the query is reduced to the most important keywords to leverage a regex search of document titles.""",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": f"""
            User query in JSON. Responses should be summarized and should include the document URL reference
            """,
        }
      },
      "required": ["query"],
    },
  },
  {
    "name": "read_document_and_summarize",
    "description": """Use this function to read whole documents and provide a summary for users.
    You should NEVER call this function before get_document has been called in the conversation.""",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": f"""
            Description of the document in plain text based on the user's query
            """,
        }
      },
      "required": ["query"],
    },
  }
]

def chat_completion_with_function_execution(messages, functions=[None]):
  """This function makes a ChatCompletion API call with the option of adding functions"""
  response = chat_completion_request(messages, functions)
  print(response)
  full_message = response.choices[0]
  if full_message.finish_reason == "function_call":
    print(f"Function generation requested, calling function")
    return call_agent_function(messages, full_message)
  else:
    print(f"Function not required, responding to user")
    return response

def call_agent_function(messages, full_message):
  """Function calling function which executes function calls when the model believes it is necessary.
  Currently extended by adding clauses to this if statement."""

  if full_message.message.function_call.name == "get_document":
    try:
      parsed_output = json.loads(
        full_message.message.function_call.arguments
      )
      print("Getting search results")
      results = get_document(parsed_output["query"])
      print("Search results: ", results)
    except Exception as e:
      print(parsed_output)
      print(f"Function execution failed")
      print(f"Error message: {e}")
    messages.append(
      {
        "role": "function",
        "name": full_message.message.function_call.name,
        "content": str(results),
      }
    )
    try:
      print("Got search results, summarizing content")
      response = chat_completion_request(messages)
      return response
    except Exception as e:
      print(type(e))
      raise Exception("Function chat request failed")

  elif (
    full_message.message.function_call.name == "read_document_and_summarize"
  ):
    parsed_output = json.loads(
      full_message.message.function_call.arguments
    )
    print("Finding and reading document")
    print(parsed_output['query'])
    summary = summarize_text(parsed_output["query"])
    return summary

  else:
    raise Exception("Function does not exist and cannot be called")
  
# Start with a system message
paper_system_message = """You are constructionGPT, a helpful assistant that pulls documents to answer user questions.
You understand the documents clearly so the user can have their questions answered.
You always provide the pdf_url and title so the user can understand the name of the document and click through to access it.
Begin!"""
paper_conversation = Conversation()
paper_conversation.add_message("system", paper_system_message)

# Add a user message
paper_conversation.add_message("user", "Get the contractor license.")
chat_response = chat_completion_with_function_execution(
  paper_conversation.conversation_history, functions=agent_functions
)
assistant_message = chat_response.choices[0].message.content
paper_conversation.add_message("assistant", assistant_message)

# Add another user message to induce our system to use the second tool
paper_conversation.add_message(
    "user",
    "Can you read the contractor license paper for me and give me a summary",
)
updated_response = chat_completion_with_function_execution(
    paper_conversation.conversation_history, functions=agent_functions
)
display(Markdown(updated_response.choices[0].message.content))