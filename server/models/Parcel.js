import mongoose from "mongoose";

const ParcelSchema = new mongoose.Schema(
  {
    mapblklot: {
      type: String,
      required: true,
    },
    blklot: {
      type: String,
      required: true,
    },
    location: {
      type: { 
        type: String,
        enum: ['MultiPolygon'],
        required: true
      },
      coordinates: { 
        type: [[[[Number]]]],
        required: true
      }
    }
  },
  { timestamps: true }
);

ParcelSchema.index({ location: '2dsphere' });
const Parcel = mongoose.model("Parcel", ParcelSchema);
export default Parcel;
