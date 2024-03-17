import mongoose from 'mongoose';
import axios from 'axios';
import Project from "../models/Project.js";
import Contract from "../models/Contract.js";
import Contractor from "../models/Contractor.js";
import Crew from "../models/Crew.js";
import Message from '../models/Message.js';
import Document from '../models/Document.js';
import Thread from '../models/Thread.js';

import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure the AWS environment
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

/* Projects */
export const getProjects = async (req, res) => {
  console.log("Fetching Projects for User: ", req.query);
  try {
    const { userId } = req.query;

    const projects = await Project.find({ owner: userId })

    if (!projects) {
      return res.status(404).json({ message: 'User has no projects.' });
    }
    
    res.status(200).json({ projects });
  } catch(error){
    return res.json({message: error.message});
  }
};

export const createProject = async (req, res) => {
  try {
    const { owner, title, summary } = req.body;
    console.log("User: ", owner);
    console.log("Title: ", title);
    console.log("Summary: ", summary);

    const newProject = new Project({ 
      owner: owner,
      title: title,
      summary: summary
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const viewProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId, data } = req.body;

    const updateObject = {
      'zoning.propertyIdentification': data.propertyIdentification,
      'zoning.zoningAndLandUse': data.zoningAndLandUse,
      'zoning.regulatoryComplianceAndEligibility': data.regulatoryComplianceAndEligibility,
      'zoning.environmentalAndGeological': data.environmentalAndGeological,
      'zoning.developmentConstraints': data.developmentConstraints,
      'zoning.buildingAndConstruction': data.buildingAndConstruction,
      'zoning.incentivesAndOpportunities': data.incentivesAndOpportunities,
      'zoning.communityAndPlanning': data.communityAndPlanning,
      'zoning.valuationAndTaxation': data.valuationAndTaxation,
      'zoning.additionalInformation': data.additionalInformation,
      'status': 'Draft',
      'location': data.propertyIdentification.siteAddress
    };

    const updatedProject = await Project.findByIdAndUpdate(projectId, { $set: updateObject }, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    await Project.deleteOne({ _id: id });
    res.status(200).json({ message: `Project ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

export const scrapeZimas = async (req, res) => {
  try {
    const { houseNumber, streetName } = req.body;
    console.log('Scraping Zimas for houseNumber: ', houseNumber, ' and streetName: ', streetName);

    const response = await axios.post('https://ancient-bayou-14978-d11f155dd40a.herokuapp.com/scrape', {
      house_number: houseNumber,
      street_name: streetName
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { projectId, title, summary } = req.body;
    console.log("Project ID: ", projectId);
    console.log("Title: ", title);
    console.log("Summary: ", summary);

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    console.log("Document: ", req.file);

    const params = {
      Bucket: 'alethea-contracts',
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error uploading file');
      }

      // Once the file is uploaded successfully, create the Contract object
      const newDocument = new Document({
        project_id: projectId,
        title: title,
        summary: summary,
        pdf_url: data.Location, // Use the S3 object URL
      });

      await newDocument.save();
      res.status(201).json(newDocument);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find({});

    res.status(200).json(contractors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/* Crews */
export const getCrews = async (req, res) => {
  try {
    const { projectId } = req.query;
    console.log('projectId: ', projectId);

    const crews = await Crew.find({ project_id: mongoose.Types.ObjectId(projectId) }).populate('members lead');

    if (!crews.length) {
      return res.status(400).json({ message: 'No crews found for the given project.' });
    }

    res.status(200).json(crews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createCrew = async (req, res) => {
  try {
    const { name, projectId, memberIds, leadId, createdBy } = req.body;

    const memberObjectIds = memberIds.map(id => mongoose.Types.ObjectId(id));
    const leadObjectId = mongoose.Types.ObjectId(leadId);

    const newCrew = new Crew({
      name,
      project_id: mongoose.Types.ObjectId(projectId),
      members: memberObjectIds,
      lead: leadObjectId,
      created_by: createdBy
    });

    await newCrew.save();
    res.status(201).json(newCrew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCrew = async (req, res) => {
  try {
    const { id } = req.params;

    const crew = await Crew.findById(id).populate('members lead');

    if (!crew) {
      return res.status(404).json({ message: 'Crew not found.' });
    }

    res.status(201).json(crew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCrew = async (req, res) => {
  try {
    const { id } = req.params;

    const crew = await Crew.findById(id);

    if (!crew) {
      return res.status(404).json({ message: 'Crew not found.' });
    }

    await Crew.deleteOne({ _id: id });
    res.status(200).json({ message: `Crew ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};


/* Messages */
export const getMessages = async (req, res) => {
  try {
    const { projectId, crewId } = req.query;
    console.log('Fetching messages for projectId: ', projectId, ' and crewId: ', crewId);

    let matchStage = {
      $match: {
        project_id: mongoose.Types.ObjectId(projectId),
      },
    };

    if (crewId) {
      matchStage.$match.crew_id = mongoose.Types.ObjectId(crewId);
    }

    const aggregationPipeline = [
      matchStage,
      {
        $sort: { message_date: -1 }, 
      },
      {
        $group: {
          _id: "$thread_id",
          latestMessage: { $first: "$$ROOT" }
        },
      },
      {
        $replaceRoot: { newRoot: "$latestMessage" },
      },
      {
        $lookup: {
          from: 'crews',
          localField: 'crew_id',
          foreignField: '_id',
          as: 'crew_id',
        },
      },
      {
        $unwind: {
          path: '$crew_id',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $unwind: {
          path: '$sender',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'contractors',
          localField: 'recipients',
          foreignField: '_id',
          as: 'recipients',
        },
      },
    ];

    const messages = await Message.aggregate(aggregationPipeline);

    if (!messages.length) {
      return res.status(400).json({ message: 'No messages found.' });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMessageThread = async (req, res) => {
  try {
    const { threadId } = req.query;

    if (!threadId) {
      return res.status(400).json({ message: 'Thread ID is required.' });
    }

    const messages = await Message.find({ thread_id: threadId })
      .populate('crew_id recipients sender')
      .sort({ createdAt: 1 });

    if (!messages.length) {
      return res.status(404).json({ message: 'No messages found for the given thread.' });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  };
};

export const createMessage = async (req, res) => {
  try {
    const { projectId, crewId, senderId, recipients, subject, content } = req.body;

    const threadId = uuidv4();

    const newMessage = new Message({
      project_id: mongoose.Types.ObjectId(projectId),
      crew_id: mongoose.Types.ObjectId(crewId),
      sender: mongoose.Types.ObjectId(senderId),
      recipients: recipients.map(id => mongoose.Types.ObjectId(id)),
      subject: subject,
      content: content,
      thread_id: threadId
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const replyMessage = async (req, res) => {
  try {
    const { projectId, crewId, senderId, recipients, subject, content, threadId, parentMessageId } = req.body;

    if (!projectId || !crewId || !senderId || !content || !threadId) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const reply = new Message({
      project_id: projectId,
      crew_id: crewId,
      sender: senderId,
      recipients: recipients.map(id => mongoose.Types.ObjectId(id)),
      subject: subject,
      content: content,
      thread_id: threadId,
      parent_message_id: parentMessageId,
    });

    await reply.save();
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    await Message.deleteOne({ _id: id });
    res.status(200).json({ message: `Message ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};