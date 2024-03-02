import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipients: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    crew: {
      type: String,
      required: true,
    },
    initialDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;