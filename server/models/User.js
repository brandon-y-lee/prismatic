import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    availableCredit: {
      type: Number,
    },
    receivedCredit: {
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

const User = mongoose.model("User", UserSchema);
export default User;
