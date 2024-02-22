import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import Supplier from "../models/Supplier.js";
import Contractor from '../models/Contractor.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant = await openai.beta.assistants.create({
  name: "Construction Copilot",
  instructions:
  "You are a helpful assistant that underpins an AI-powered search tool for construction stakeholders. Extract any key points with reasoning.",
  model: "gpt-4-turbo-preview",
  tools: [{
    "type": "function",
    "function": {
      "name": "findMaterialsAndSuppliers",
      "description": "Find materials and suppliers based on user criteria.",
      "parameters": {
        "type": "object",
        "properties": {
          "material": {"type": "string", "description": "The type of material e.g. concrete, lumber, steel"},
          "quality": {"type": "string", "description": "The quality of material"},
          "city": {"type": "string", "description": "The city to find suppliers"},
          "state": {"type": "string", "description": "The state to find suppliers, converted into its two-letter abbreviation"},
        },
        "required": ["material"]
      }
    }
  }, {
    "type": "function",
    "function": {
      "name": "findLaborAndSubcontracting",
      "description": "Find labor and subcontracting options based on user criteria",
      "parameters": {
        "type": "object",
        "properties": {
          "type": {"type": "string", "description": "Required skills or professions e.g. electrician, architect, plumbing"},
          "city": {"type": "string", "description": "The city to find labor and subcontracting e.g. San Francisco, Los Angeles"},
          "state": {"type": "string", "description": "The state to find labor and subcontracting, converted into its two-letter abbreviation e.g. CA, NY"},
        },
        "required": ["type"]
      }
    }
  }]
});

console.log('assistant: ', assistant);

async function findMaterialsAndSuppliers(material, quality, city, state) {
  try {
    const query = {
      Materials: { $regex: new RegExp(material, 'i') }
    };

    if (quality) {
      query.Description = { $regex: new RegExp(quality, 'i') };
    }

    if (city) {
      query.City = { $regex: new RegExp(city, 'i') };
    }

    if (state) {
      query.State = { $regex: new RegExp(state, 'i') };
    }

    const suppliers = await Supplier.find(query).lean();
    console.log(`${suppliers.length} suppliers found:`, suppliers);

    return suppliers;
  } catch (error) {
    console.error('Error querying suppliers:', error);
    throw error;
  }
}

async function findLaborAndSubcontracting(type, city, state) {
  try {
    const query = {
      Type: { $regex: new RegExp(type, 'i') }
    };

    if (city) {
      query.City = { $regex: new RegExp(city, 'i') };
    }

    if (state) {
      query.State = { $regex: new RegExp(state, 'i') };
    }

    const contractors = await Contractor.find(query).lean();
    console.log(`${contractors.length} contractors found:`, contractors);

    return contractors;
  } catch (error) {
    console.error('Error querying contractors:', error);
    throw error;
  }
}

export const interactWithAssistant = async (req, res) => {
  console.log('Request body:', req.body);
  const { userMessage, existingThread } = req.body;

  try {
    let thread = existingThread
      ? { id: existingThread }
      : await openai.beta.threads.create();

    console.log('Thread:', thread);

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage
    });

    // Create and run assistant
    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id
    });

    console.log('run: ', run);

    while (run.status !== 'completed' && run.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);

      if (run.status === 'requires_action') {
        const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
        const toolOutputs = [];

        for (const toolCall of toolCalls) {
          if (toolCall.function.name === 'findMaterialsAndSuppliers') {
            try {
              // Parse the JSON string to get the arguments object
              const args = JSON.parse(toolCall.function.arguments);
              const material = args.material; // Extracting the material from the arguments.
              const quality = args.quality || '';
              const city = args.city || '';
              const state = args.state || '';
              console.log(`Searching for material: ${material}, quality: ${quality}, city: ${city}, state: ${state}`);

              // Call the function to get the suppliers.
              const suppliers = await findMaterialsAndSuppliers(material, quality, city, state);
              if (!suppliers.length) {
                console.log('No suppliers found for material:', material);
              }
              console.log('Suppliers: ', suppliers);

              // Prepare the output for submission back to the OpenAI API.
              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify({ suppliers })
              });

            } catch (parseError) {
              console.error('Error parsing tool arguments:', parseError);
              break;
            }
          }

          if (toolCall.function.name === 'findLaborAndSubcontracting') {
            try {
              // Parse the JSON string to get the arguments object
              const args = JSON.parse(toolCall.function.arguments);
              const type = args.type; // Extracting the material from the arguments.
              const city = args.city || '';
              const state = args.state || '';
              console.log(`Searching for contractor: ${type}, city: ${city}, state: ${state}`);

              // Call the function to get the suppliers.
              const contractors = await findLaborAndSubcontracting(type, city, state);
              if (!contractors.length) {
                console.log('No contractors found for material:', type);
              }
              console.log('Contractors: ', contractors);

              // Prepare the output for submission back to the OpenAI API.
              toolOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify({ contractors })
              });

            } catch (parseError) {
              console.error('Error parsing tool arguments:', parseError);
              break;
            }
          }
        };

        // Submit all tool outputs in a single request
        if (toolOutputs.length > 0) {
          run = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
            tool_outputs: toolOutputs
          });
        }
      }
    }

    if (run.status === 'completed') {
      const threadMessages = await openai.beta.threads.messages.list(thread.id);
      const formattedMessages = threadMessages.data.map(msg => ({
        role: msg.role,
        content: msg.content?.[0]?.text || ''
      }));

      res.status(200).json({ thread: thread.id, messages: formattedMessages });
    } else {
      throw new Error('Run did not complete successfully.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Interaction with Assistant did not complete successfully.' });
  }
};
      