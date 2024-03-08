import mongoose from 'mongoose';
import Project from "../models/Project.js";
import Contract from "../models/Contract.js";
import Contractor from "../models/Contractor.js";
import Crew from "../models/Crew.js";
import Message from '../models/Message.js';

import AWS from 'aws-sdk';

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
    const { page, pageSize, sort, search, userId } = req.query;

    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };
      
      return sortFormatted;
    }

    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const projects = await Project.find({
      owner: userId
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize)

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

export const uploadFile = async (req, res) => {
  try {
    const { title, summary, status } = req.body;
    console.log("Title: ", title);
    console.log("Summary: ", summary);
    console.log("Status: ", status);

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    console.log("Uploaded File: ", req.file);

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
      const newContract = new Contract({
        title,
        summary,
        pdf_url: data.Location, // Use the S3 object URL
        status: status
      });

      await newContract.save();
      res.status(201).json(newContract);
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

    let query = { project_id: mongoose.Types.ObjectId(projectId) };
    if (crewId) {
      query.crew_id = mongoose.Types.ObjectId(crewId);
    }

    const messages = await Message.find(query).populate('crew_id recipients');

    if (!messages.length) {
      return res.status(400).json({ message: 'No messages found.' });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { projectId, crewId, senderId, recipients, subject, content } = req.body;

    const recipientObjectIds = recipients.map(id => mongoose.Types.ObjectId(id));

    const newMessage = new Message({
      project_id: mongoose.Types.ObjectId(projectId),
      crew_id: mongoose.Types.ObjectId(crewId),
      sender: senderId,
      recipients: recipientObjectIds,
      subject: subject,
      content: content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
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