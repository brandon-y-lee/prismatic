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
      required: true,
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
      required: true,
    },
    content: {
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