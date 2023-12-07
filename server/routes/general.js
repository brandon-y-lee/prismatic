import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

router.get("/user", getUser);
router.get("/dashboard", getDashboardStats);

export default router;
