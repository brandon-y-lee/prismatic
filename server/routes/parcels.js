import express from "express";
import { getParcel, parseParcels } from "../controllers/parcels.js";

const router = express.Router();

router.get('/get-parcel/:mapblklot', getParcel);
router.post('/parse-parcels', parseParcels);

export default router;
