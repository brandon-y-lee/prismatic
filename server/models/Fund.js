import mongoose from "mongoose";
import { RepaymentPlan } from "../configs/RepaymentPlan.js";


const FundSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    merchant: {
      type: String,
    },
    invoiceAmount: {
      type: Number,
      required: true,
    },
    totalRepayment: {
      type: Number,
      required: true,
    },
    totalFee: {
      type: Number,
      required: true,
    },
    feePaid: {
      type: Number,
    },
    feeRemaining: {
      type: Number,
    },
    principalPaid: {
      type: Number,
    },
    principalRemaining: {
      type: Number,
    },
    debitRemaining: {
      type: Number,
    },
    repaymentPlan: {
      type: Number,
      enum: Object.values(RepaymentPlan),
    },
    fundingDate: {
      type: Date,
      default: () => new Date().setHours(12, 0, 0, 0),
    },
    expiryDate: {
      type: Date,
    },
    weeklyInstallment: {
      type: Number,
    },
    weeklyPrincipal: {
      type: Number,
    },
    weeklyFee: {
      type: Number,
    },
    paymentsMade: {
      type: Number,
    },
    paymentsRemaining: {
      type: Number,
    },
    nextPaymentAmount: {
      type: Number,
    },
    nextPaymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Fund = mongoose.model("Fund", FundSchema);
export default Fund;