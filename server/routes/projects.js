import express from "express";
import {
  uploadFile,
} from "../controllers/client.js";
import multer from 'multer';
import { createProject, viewProject } from "../controllers/projects.js";

// Set up the multer s3 storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.post("/create", createProject);
router.get("/view/:id", viewProject);

router.post("/upload", upload.single('file'), uploadFile);

export default router;
