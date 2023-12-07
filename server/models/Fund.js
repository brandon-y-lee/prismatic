import mongoose from "mongoose";
import { RepaymentPlan } from "../configs/RepaymentPlan.js";


const FundSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    fundingDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
    },
    nextPaymentDate: {
      type: Date,
    },
    totalFunding: {
      type: Number,
      required: true,
    },
    amountLeft: {
      type: Number,
    },
    amountRepaid: {
      type: Number
    },
    repaymentPlan: {
      type: Number,
      enum: Object.values(RepaymentPlan),
    },
    weeklyInstallment: {
      type: Number,
      default: totalFunding / repaymentPlan,
    },
  },
  { timestamps: true }
);

const Fund = mongoose.model("Fund", FundSchema);
export default Fund;