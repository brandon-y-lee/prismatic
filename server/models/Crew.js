import mongoose from "mongoose";

const CrewSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor',
    }],
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contractor',
    },
    created_by: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: Date,
  },
  { timestamps: true }
);

const Crew = mongoose.model("Crew", CrewSchema);
export default Crew;
