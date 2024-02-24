import mongoose from "mongoose";
import { ContractStatus } from "../configs/ContractStatus.js";

const ContractSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    pdf_url: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: Object.values(ContractStatus),
      default: ContractStatus.DRAFT
    },
    initialDate: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

const Contract = mongoose.model("Contract", ContractSchema);
export default Contract;