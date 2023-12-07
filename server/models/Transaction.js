import mongoose from "mongoose";
import { TransactionStatus } from "../configs/TransactionStatus.js";
import { PaymentStatus } from "../configs/PaymentStatus.js";


const TransactionSchema = new mongoose.Schema(
  {
    buyerId: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.DRAFT
    },
    payment: {
      type: Number,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    cost: {
      type: Number,
    },
    initialDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;