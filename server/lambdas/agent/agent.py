# import os
# import pandas as pd
# import requests
# import json
# import ast
# import tiktoken
# import boto3
# from botocore.exceptions import NoCredentialsError
# from boto3 import session
# from requests_aws4auth import AWS4Auth
# from dotenv import load_dotenv
# from pymongo import MongoClient
# from PyPDF2 import PdfReader
# from openai import OpenAI
# from tenacity import retry, wait_random_exponential, stop_after_attempt
# from scipy import spatial
# from io import BytesIO
# from termcolor import colored

# load_dotenv()

# OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
# client = OpenAI(api_key=OPENAI_API_KEY)

# GPT_MODEL = "gpt-4-turbo-preview"
# EMBEDDING_MODEL = "text-embedding-3-small"

# directory = './data/documents'

# # Check if the directory already exists
# if not os.path.exists(directory):
#   # If the directory doesn't exist, create it and any necessary intermediate directories
#   os.makedirs(directory)
#   print(f"Directory '{directory}' created successfully.")
# else:
#   # If the directory already exists, print a message indicating it
#   print(f"Directory '{directory}' already exists.")

# # Set a directory to store downloaded papers
# data_dir = os.path.join(os.curdir, "data", "documents")
# document_dir_filepath = "./data/documents.csv"

# # Generate a blank dataframe where we can store downloaded files
# df = pd.DataFrame(list())
# df.to_csv(document_dir_filepath)

# @retry(wait=wait_random_exponential(min=1, max=40), stop=stop_after_attempt(3))
# def embedding_request(text):
#   response = client.embeddings.create(input=text, model=EMBEDDING_MODEL)
#   return response

# @retry(wait=wait_random_exponential(min=1, max=40), stop=stop_after_attempt(3))
# def get_project(uri, db_name, search_params, library=document_dir_filepath):
#   """
#   Fetches a project from the 'projects' collection based on search parameters.
  
#   :param uri: MongoDB connection URI.
#   :param db_name: Name of the database.
#   :param search_params: Dictionary of search parameters for finding the project.
#   :return: Project data as a dictionary.
#   """
#   client = MongoClient(uri)
#   db = client[db_name]
#   projects = db.projects.find(search_params)

#   project_list=[]
#   for project in projects:
#     project_dict = {}
#     project_dict.update({"title": project.title})
#     project_dict.update({"summary": project.summary})

#     # Retrieve the S3 url
#     project_dict.update({"pdf_url": project.pdf_url})
#     project_list.append(project_dict)

#     # Store references in library file
#     response = embedding_request(text=project.title)
#     file_reference = [
#       project.title,
#       project.download_pdf(data_dir),
#       response.data[0].embedding,
#     ]

#     # Write to file
#     with open(library, "a") as f_object:
#         writer_object = writer(f_object)
#         writer_object.writerow(file_reference)
#         f_object.close()

#   return project_list

# @retry(wait=wait_random_exponential(min=1, max=40), stop=stop_after_attempt(3))
# def get_document(uri, db_name, search_params):
#   """
#   Fetches a document from the MongoDB collection and returns its details,
#   including the S3 URL of the PDF file.
  
#   :param uri: MongoDB connection URI.
#   :param db_name: Name of the database.
#   :param search_params: Dictionary of search parameters for finding the document.
#   :return: Document data including the S3 URL.
#   """
#   client = MongoClient(uri)
#   db = client[db_name]
  
#   document_data = db.documents.find_one(search_params)
  
#   if document_data:
#     return document_data
#   else:
#     return {"message": "Document not found"}

# def strings_ranked_by_relatedness(
#   query: str,
#   df: pd.DataFrame,
#   relatedness_fn=lambda x, y: 1 - spatial.distance.cosine(x, y),
#   top_n: int = 100,
# ) -> list[str]:
#   """Returns a list of strings and relatednesses, sorted from most related to least."""
#   query_embedding_response = embedding_request(query)
#   query_embedding = query_embedding_response.data[0].embedding
#   strings_and_relatednesses = [
#     (row["filepath"], relatedness_fn(query_embedding, row["embedding"]))
#     for i, row in df.iterrows()
#   ]
#   strings_and_relatednesses.sort(key=lambda x: x[1], reverse=True)
#   strings, relatednesses = zip(*strings_and_relatednesses)
#   return strings[:top_n]

# def read_pdf(filepath):
#   """Takes a filepath to a PDF and returns a string of the PDF's contents"""
#   # creating a pdf reader object
#   reader = PdfReader(filepath)
#   pdf_text = ""
#   page_number = 0
#   for page in reader.pages:
#     page_number += 1
#     pdf_text += page.extract_text() + f"\nPage Number: {page_number}"
#   return pdf_text

# # Split a text into smaller chunks of size n, preferably ending at the end of a sentence
# def create_chunks(text, n, tokenizer):
#   """Returns successive n-sized chunks from provided text."""
#   tokens = tokenizer.encode(text)
#   i = 0
#   while i < len(tokens):
#     # Find the nearest end of sentence within a range of 0.5 * n and 1.5 * n tokens
#     j = min(i + int(1.5 * n), len(tokens))
#     while j > i + int(0.5 * n):
#       # Decode the tokens and check for full stop or newline
#       chunk = tokenizer.decode(tokens[i:j])
#       if chunk.endswith(".") or chunk.endswith("\n"):
#         break
#       j -= 1
#     # If no end of sentence found, use n tokens as the chunk size
#     if j == i + int(0.5 * n):
#       j = min(i + n, len(tokens))
#     yield tokens[i:j]
#     i = j

# def extract_chunk(content, template_prompt):
#   """This function applies a prompt to some input content. In this case it returns a summarized chunk of text"""
#   prompt = template_prompt + content
#   response = client.chat.completions.create(
#     model=GPT_MODEL, messages=[{"role": "user", "content": prompt}], temperature=0
#   )
#   return response.choices[0].message.content

# def summarize_text(query):
#   """This function does the following:
#   - Reads in the documents.csv file in including the embeddings
#   - Finds the closest file to the user's query
#   - Scrapes the text out of the file and chunks it
#   - Summarizes each chunk in parallel
#   - Does one final summary and returns this to the user"""

#   # A prompt to dictate how the recursive summarizations should approach the input paper
#   summary_prompt = """Summarize this text from a document for pre-construction. Extract any key points with reasoning.\n\nContent:"""

#   # If the library is empty (no searches have been performed yet), we perform one and download the results
#   library_df = pd.read_csv(document_dir_filepath).reset_index()
#   if len(library_df) == 0:
#       print("No papers searched yet, downloading first.")
#       get_document(query)
#       print("Document downloaded, continuing")
#       library_df = pd.read_csv(document_dir_filepath).reset_index()
#   library_df.columns = ["title", "filepath", "embedding"]
#   library_df["embedding"] = library_df["embedding"].apply(ast.literal_eval)
#   strings = strings_ranked_by_relatedness(query, library_df, top_n=1)
#   print("Chunking text from document")
#   pdf_text = read_pdf(strings[0])

#   # Initialise tokenizer
#   tokenizer = tiktoken.get_encoding("cl100k_base")
#   results = ""

#   # Chunk up the document into 1500 token chunks
#   chunks = create_chunks(pdf_text, 1500, tokenizer)
#   text_chunks = [tokenizer.decode(chunk) for chunk in chunks]
#   print("Summarizing each chunk of text")

#   # Parallel process the summaries
#   with concurrent.futures.ThreadPoolExecutor(
#       max_workers=len(text_chunks)
#   ) as executor:
#       futures = [
#           executor.submit(extract_chunk, chunk, summary_prompt)
#           for chunk in text_chunks
#       ]
#       with tqdm(total=len(text_chunks)) as pbar:
#           for _ in concurrent.futures.as_completed(futures):
#               pbar.update(1)
#       for future in futures:
#           data = future.result()
#           results += data

#   # Final summary
#   print("Summarizing into overall summary")
#   response = client.chat.completions.create(
#       model=GPT_MODEL,
#       messages=[
#           {
#               "role": "user",
#               "content": f"""Write a summary collated from this collection of key points extracted from an academic paper.
#                       The summary should highlight the core argument, conclusions and evidence, and answer the user's query.
#                       User query: {query}
#                       The summary should be structured in bulleted lists following the headings Core Argument, Evidence, and Conclusions.
#                       Key points:\n{results}\nSummary:\n""",
#           }
#       ],
#       temperature=0,
#   )
#   return response

# class Conversation:
#   def __init__(self):
#     self.conversation_history = []

#   def add_message(self, role, content):
#     message = {"role": role, "content": content}
#     self.conversation_history.append(message)

#   def display_conversation(self, detailed=False):
#     role_to_color = {
#       "system": "red",
#       "user": "green",
#       "assistant": "blue",
#       "function": "magenta",
#     }
#     for message in self.conversation_history:
#       print(
#         colored(
#           f"{message['role']}: {message['content']}\n\n",
#           role_to_color[message["role"]],
#         )
#       )

# @retry(wait=wait_random_exponential(min=1, max=40), stop=stop_after_attempt(3))
# def chat_completion_request(messages, functions=None, model=GPT_MODEL):
#   try:
#     response = client.chat.completions.create(
#       model=model,
#       messages=messages,
#       functions=functions,
#     )
#     return response
#   except Exception as e:
#     print("Unable to generate ChatCompletion response")
#     print(f"Exception: {e}")
#     return e

# agent_functions = [
#   {
#     "name": "get_project",
#     "description": """Use this function to get projects from MongoDB to answer user questions.""",
#     "parameters": {
#       "type": "object",
#       "properties": {
#         "query": {
#           "type": "string",
#           "descriptions": f"""
#             User query in JSON. Responses should be summarized and should include the project title
#             """,
#         }
#       },
#       "required": ["query"],
#     },
#   },
#   {
#     "name": "get_document",
#     "description": """Use this function to get documents from Amazon S3 bucket using ElasticSearch to answer user questions.""",
#     "parameters": {
#       "type": "object",
#       "properties": {
#         "type": "object",
#         "properties": {
#           "query": {
#             "type": "string",
#             "description": f"""
#               User query in JSON. Responses should be summarized sand should include the article URL reference
#               """,
#           }
#         }
#       },
#       "required": ["query"],
#     },
#   }
# ]

# def chat_completion_with_function_execution(messages, functions=[None]):
#   """This function makes a ChatCompletion API call with the option of adding functions"""
#   response = chat_completion_request(messages, functions)
#   full_message = response.choices[0]
#   if full_message.finish_reason == "function_call":
#     print(f"Function generation requested, calling function")
#     return call_agent_function(messages, full_message)
#   else:
#     print(f"Function not required, responding to user")
#     return response
  
# def call_agent_function(messages, full_message):
#   """Function calling function which executes function calls when the model believes it is necessary.
#   Currently extended by adding clauses to this if statement."""

#   if full_message.message.function_call.name == "get_project":
#     try:
#       parsed_output = json.loads(
#         full_message.message.function_call.arguments
#       )
#       print("Getting search results")
#       results = get_project(parsed_output["query"])
#     except Exception as e:
#       print(parsed_output)
#       print(f"Function execution failed")
#       print(f"Error message: {e}")
#     messages.append(
#       {
#         "role": "function",
#         "name": full_message.message.function_call.name,
#         "content": str(results),
#       }
#     )
#     try:
#       print("Got search results, summarizing content")
#       response = chat_completion_request(messages)
#       return response
#     except Exception as e:
#       print(type(e))
#       raise Exception("Function chat request failed")

#   elif (
#     full_message.message.function_call.name == "get_document"
#   ):
#     try:
#       parsed_output = json.loads(
#         full_message.message.function_call.arguments
#       )
#       print("Getting document")
#       results = get_document(parsed_output["query"])
#     except Exception as e:
#       print(parsed_output)
#       print(f"Function execution failed")
#       print(f"Error message: {e}")
#     messages.append(
#       {
#         "role": "function",
#         "name": full_message.message.function_call.name,
#         "content": str(results),
#       }
#     )
#     try:
#       print("Got search results, summarizing content")
#       response = chat_completion_request(messages)
#       return response
#     except Exception as e:
#       print(type(e))
#       raise Exception("Function chat request failed")

#   else:
#     raise Exception("Function does not exist and cannot be called")

