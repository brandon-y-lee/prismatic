import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    crew_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crew',
      required: false,
    },
    sender: {
      type: String,
      required: true,
    },
    recipients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor',
      required: true,
    }],
    subject: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    thread_id: {
      type: String,
      required: false,
    },
    parent_message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: false,
    },
    message_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;