import mongoose from "mongoose";
import { TransactionStatus } from "../configs/TransactionStatus.js";

const TransactionSchema = new mongoose.Schema(
  {
    buyerId: String,
    sellerId: String,
    cost: String,
    status: {
      type: Number,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.NEW_ORDER
    },
    products: {
      type: [mongoose.Types.ObjectId],
      of: Number,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;