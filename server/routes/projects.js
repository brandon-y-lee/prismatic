import express from "express";
import {
  uploadFile,
} from "../controllers/client.js";
import multer from 'multer';
import { createCrew, createProject, deleteCrew, deleteProject, getContractors, getCrews, getProjects, viewProject } from "../controllers/projects.js";

// Set up the multer s3 storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.get("/get", getProjects);
router.post("/create", createProject);
router.get("/view/:id", viewProject);
router.post("/upload", upload.single('file'), uploadFile);
router.delete("/delete/:id", deleteProject);

router.get('/get-contractors', getContractors);
router.post("/create-crew", createCrew);
router.get("/get-crews", getCrews);
router.delete("/delete-crew/:id", deleteCrew);

export default router;
