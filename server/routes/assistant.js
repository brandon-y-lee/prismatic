import express from 'express';
import { interactWithAssistant } from '../controllers/assistant.js';

const router = express.Router();

router.post('/message', interactWithAssistant);

export default router;
