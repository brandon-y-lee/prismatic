import mongoose from "mongoose";

const ContractorSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    email: String,
    company: String,
    role: String,
  },
  { timestamps: true }
);

const Contractor = mongoose.model("Contractor", ContractorSchema);
export default Contractor;
