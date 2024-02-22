import mongoose from "mongoose";

const ContractorSchema = new mongoose.Schema(
  {
    id: Number,
    Company: String,
    City: String,
    State: String,
    Type: String,
    Description: String,
  },
  { timestamps: true }
);

const Contractor = mongoose.model("Contractor", ContractorSchema);
export default Contractor;
