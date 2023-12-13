import mongoose from "mongoose";
import { RepaymentPlan } from "../configs/RepaymentPlan.js";


const FundSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    invoiceAmount: {
      type: Number,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    merchant: {
      type: String,
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
    totalFees: {
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
    paymentsLeft: {
      type: Number,
    },
    paymentsMade: {
      type: Number,
    },
    weeklyInstallment: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Fund = mongoose.model("Fund", FundSchema);
export default Fund;