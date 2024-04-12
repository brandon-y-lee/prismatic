import express from "express";
import { getInvitesReceivedForUser, getInvitesSentForUser } from "../controllers/network.js";

const router = express.Router();

router.get('/get-invites-sent', getInvitesSentForUser);
router.get('/get-invites-received', getInvitesReceivedForUser);

export default router;
