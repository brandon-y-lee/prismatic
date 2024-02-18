import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant = await openai.beta.assistants.create({
  name: "Construction Expert",
  instructions:
  "You are a helpful assistant. Use the provided functions to answer questions.",
  model: "gpt-4-turbo-preview",
  tools: [{
    "type": "function",
    "function": {
      "name": "findMaterialsAndSuppliers",
      "description": "Find materials and suppliers based on user criteria",
      "parameters": {
        "type": "object",
        "properties": {
          "material": {"type": "string", "description": "The type of material needed e.g. concrete, steel"},
        },
        "required": ["material"]
      }
    }
  }, 
  //  {
  //   "type": "function",
  //   "function": {
  //     "name": "rentEquipment",
  //     "description": "Rent equipment for construction projects",
  //     "parameters": {
  //       "type": "object",
  //       "properties": {
  //         "equipmentType": {"type": "string", "description": "The type of equipment needed e.g. crane, excavator"},
  //         "rentalDuration": {"type": "string", "description": "Rental duration e.g. 2 weeks, 1 month"},
  //       },
  //       "required": ["equipmentType", "rentalDuration"]
  //     }
  //   }
  // }, {
  //   "type": "function",
  //   "function": {
  //     "name": "findLaborAndSubcontracting",
  //     "description": "Find labor and subcontracting options for construction projects",
  //     "parameters": {
  //       "type": "object",
  //       "properties": {
  //         "skillSet": {"type": "string", "description": "Required skills or professions e.g. electrician, architect"},
  //       },
  //       "required": ["skillSet"]
  //     }
  //   }
  // }
  ]}
);

console.log('assistant: ', assistant);

export const interactWithAssistant = async (req, res) => {
  console.log('Request body:', req.body);
  const { userMessage, threadId } = req.body;

  try {
    let thread;
    if (threadId) {
      thread = { id: threadId };
      console.log('Existing thread found: ', thread);
    } else {
      thread = await openai.beta.threads.create();
      console.log('New thread created: ', thread);
    }
    
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
    console.log('run: ', run);

    let runStatus = run.status;
      
    while (runStatus !== 'completed') {
      const updatedRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      runStatus = updatedRun.status;

      console.log('updatedRun: ', updatedRun);
      console.log('runStatus: ', runStatus);

      if (runStatus === 'requires_action') {
        console.log('tool calls: ', updatedRun.required_action.submit_tool_outputs.tool_calls);

        runStatus = 'pending';
      } else if (runStatus === 'completed' || runStatus === 'failed') {
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
      console.log('thread.id: ', thread.id);

      res.status(200).json({ thread: thread.id, messages: formattedMessages });
    } else {
      console.error('Run did not complete successfully.');
      res.status(500).json({ error: 'Run did not complete successfully.' });
    }

  } catch (error) {
    console.error('Interaction with Assistant did not complete successfully.');
    res.status(500).json({ error: 'Interaction with Assistant did not complete successfully.' });

  }
};