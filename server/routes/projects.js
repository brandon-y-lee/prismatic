import express from "express";
import multer from 'multer';
import { createCrew, createMessage, createProject, deleteCrew, deleteMessage, deleteProject, getContractors, getCrew, getCrews, getMessage, getMessageThread, getMessages, getProjects, replyMessage, scrapeZimas, updateProject, uploadDocument, viewProject } from "../controllers/projects.js";

// Set up the multer s3 storage
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/get', getProjects);
router.post('/create', createProject);
router.get('/view/:id', viewProject);
router.post('/update', updateProject);
router.delete('/delete/:id', deleteProject);

router.post('/scrape-zimas', scrapeZimas);
router.post('/upload-document', upload.single('file'), uploadDocument);

router.get('/get-contractors', getContractors);
router.get('/get-crews', getCrews);
router.post('/create-crew', createCrew);
router.get('/get-crew/:id', getCrew);
router.delete('/delete-crew/:id', deleteCrew);

router.get('/get-messages', getMessages);
router.get('/get-message-thread', getMessageThread);
router.post('/create-message', createMessage);
router.post('/reply-message', replyMessage);
router.get('/get-message/:id', getMessage);
router.delete('/delete-message/:id', deleteMessage);

export default router;
