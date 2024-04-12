import mongoose from "mongoose";
import Invite from "../models/Invite.js";
import User from "../models/User.js";


export const getInvitesSentForUser = async (req, res) => {
  console.log("Finding Invites Sent For User", req.query);
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const invitesSent = await Invite.find({ sender: mongoose.Types.ObjectId(userId), status: 'pending' }).populate('recipient');
    if (invitesSent.length === 0) {
      return res.status(404).json({ message: "No invites sent" });
    }
    res.status(200).json(invitesSent);
  } catch (error) {
    console.error("Error fetching invites sent:", error);
    res.status(500).json({ message: "Error fetching invites sent", error });
  }
};

export const getInvitesReceivedForUser = async (req, res) => {
  console.log("Finding Invites Received For User", req.query);
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const invitesReceived = await Invite.find({ recipient: mongoose.Types.ObjectId(userId), status: 'pending' }).populate('sender');
    console.log(invitesReceived);
    if (invitesReceived.length === 0) {
      return res.status(404).json({ message: "No invites received" });
    }
    res.status(200).json(invitesReceived);
  } catch (error) {
    console.error("Error fetching invites received:", error);
    res.status(500).json({ message: "Error fetching invites received", error});
  }
};
