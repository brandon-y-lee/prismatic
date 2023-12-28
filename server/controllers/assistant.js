import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant = await openai.beta.assistants.create({
  name: "Finance Expert",
  instructions:
    "You are an expert in supply chain finance and working capital optimization for small and medium enterprises (SMEs). Provide detailed, practical advice on financial strategies, risk management, and capital optimization. Analyze financial scenarios based on the provided data and suggest the best courses of action to improve cash flow, reduce costs, and enhance supply chain efficiency. Ensure all advice is compliant with financial regulations and best practices.",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4",
});

console.log('assistant: ', assistant);

export const interactWithAssistant = async (req, res) => {
  console.log('Request body:', req.body);
  const { userMessage } = req.body;

  try {
    const thread = await openai.beta.threads.create();
    console.log('thread: ', thread);
    
    const message = await openai.beta.threads.messages.create(
      thread.id,
      { role: "user", content: userMessage }
    );
    console.log('message: ', message);

    // Create and run assistant
    const run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: assistant.id }
    );
    let runStatus = run.status;
      
    while (runStatus !== 'completed') {
      const updatedRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      runStatus = updatedRun.status;

      if (runStatus === 'completed' || runStatus === 'failed') {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (runStatus === 'completed') {
      const threadMessages = await openai.beta.threads.messages.list(thread.id);

      const formattedMessages = threadMessages.data.map(message => {
        const textContent = message.content?.[0]?.text || '';
        return {
          role: message.role,
          content: textContent,
        };
      })
      res.status(200).json({ messages: formattedMessages });
    } else {
      console.error('Run did not complete successfully.');
      res.status(500).json({ error: 'Run did not complete successfully.' });
    }

  } catch (error) {
    console.error('Interaction with Assistant did not complete successfully.');
    res.status(500).json({ error: 'Interaction with Assistant did not complete successfully.' });

  }
};