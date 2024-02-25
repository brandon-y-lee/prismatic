import Project from "../models/Project.js";
import Contract from "../models/Contract.js";

import AWS from 'aws-sdk';

// Configure the AWS environment
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

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
        status: status,
      });

      await newContract.save();
      res.status(201).json(newContract);
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};