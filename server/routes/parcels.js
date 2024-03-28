import express from "express";
import { getParcel, getZoningSims, parseLandUse, parseParcels } from "../controllers/parcels.js";

const router = express.Router();

router.get('/get-parcel', getParcel);
router.get('/get-zoning-sims', getZoningSims);
router.post('/parse-parcels', parseParcels);
router.post('/parse-land-use', parseLandUse)
export default router;
