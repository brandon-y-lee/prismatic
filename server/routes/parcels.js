import express from "express";
import { parseParcels } from "../controllers/parcels.js";

const router = express.Router();

router.post('/parse-parcels', parseParcels);

export default router;
