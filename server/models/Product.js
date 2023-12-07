import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
