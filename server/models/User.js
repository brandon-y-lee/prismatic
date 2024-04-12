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
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Owner', 'Developer', 'Architect', 'Attorney', 'City Planner', 'Contractor'],
      required: true,
    },
    accounts: { 
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Account',
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
