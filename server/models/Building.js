import mongoose from "mongoose";

const BuildingSchema = new mongoose.Schema(
  {
    sf16_bldgid: {
      type: String,
    },
    area_id: {
      type: String,
    },
    mapblklot: {
      type: String,
    },
    area: {
      type: Number,
    },
    perimeter: {
      type: Number,
    },
    shape: {
      type: String,
    },
    data_as_of: {
      type: String,
    },
    data_loaded_at: {
      type: String,
    },
  },
  { timestamps: true }
);

const Building = mongoose.model("Building", BuildingSchema);
export default Building;
