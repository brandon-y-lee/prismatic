import express from "express";
import { getParcel, getZoningSims, parseParcels } from "../controllers/parcels.js";

const router = express.Router();

router.get('/get-parcel', getParcel);
router.get('/get-zoning-sims', getZoningSims);
router.post('/parse-parcels', parseParcels);
export default router;
