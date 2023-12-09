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
      default: 0,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate weeklyInstallment
FundSchema.pre('save', function(next) {
  if (this.isModified('totalFunding') || this.isModified('repaymentPlan')) {
    if (this.repaymentPlan && this.repaymentPlan > 0) {
      this.weeklyInstallment = this.totalFunding / this.repaymentPlan;
    } else {
      this.weeklyInstallment = 0; // Or some default value
    }
  }
  next();
});

const Fund = mongoose.model("Fund", FundSchema);
export default Fund;