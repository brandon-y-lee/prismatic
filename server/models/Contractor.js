import mongoose from "mongoose";

const ContractorSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    company: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  { timestamps: true }
);

const Contractor = mongoose.model("Contractor", ContractorSchema);
export default Contractor;
