import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    id: Number,
    Company: String,
    Address: String,
    City: String,
    State: String,
    Zip: String,
    Employees: String,
    Sales: String,
    Type: String,
    YearFounded: String,
    Description: String,
    Materials:[String]
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", SupplierSchema);
export default Supplier;
