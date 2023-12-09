import mongoose from "mongoose";
import { InvoiceStatus } from "../configs/InvoiceStatus.js";

const InvoiceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: String,
      required: true,
    },
    invoiceTotal: {
      type: Number,
      required: true,
    },
    invoiceStatus: {
      type: Number,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.INACTIVE
    },
    availableFunding: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;