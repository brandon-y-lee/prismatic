import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
    },
    creditScore: {
      type: Number,
    },
    creditLimit: {
      type: Number,
    },
    creditAvailable: {
      type: Number,
    },
    creditReceived: {
      type: Number,
    },
    nextRepaymentIds: {
      type: [String],
    },
    nextRepaymentDate: {
      type: Date,
    },
    nextRepaymentAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", AccountSchema);
export default Account;
