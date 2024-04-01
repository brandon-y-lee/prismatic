import express from "express";
import { getParcel, parseLandUse, parseParcels } from "../controllers/parcels.js";

const router = express.Router();

router.get('/get-parcel', getParcel);
router.post('/parse-parcels', parseParcels);
router.post('/parse-land-use', parseLandUse)
export default router;
