import mongoose from "mongoose";

const ParcelSchema = new mongoose.Schema(
  {
    mapblklot: {
      type: String,
    },
    blklot: {
      type: String,
    },
    block_num: {
      type: String,
    },
    lot_num: {
      type: String,
    },
    from_address_num: {
      type: Number,
    },
    to_address_num: {
      type: Number,
    },
    street_name: {
      type: String,
    },
    street_type: {
      type: String,
    },
    in_asr_secured_roll: {
      type: Boolean,
    },
    pw_recorded_map: {
      type: Boolean,
    },
    zoning_code: {
      type: String,
    },
    zoning_district: {
      type: String,
    },
    date_rec_add: {
      type: String,
    },
    date_rec_drop: {
      type: String,
    },
    date_map_add: {
      type: String,
    },
    date_map_drop: {
      type: String,
    },
    active: {
      type: Boolean
    },
    shape: {
      type: String,
    },
    centroid_latitude: {
      type: Number,
    },
    centroid_longitude: {
      type: Number,
    },
    supervisor_district: {
      type: Number,
    },
    supervisor_name: {
      type: String,
    },
    analysis_neighborhood: {
      type: String,
    },
    bldgsqft: {
      type: Number,
    },
    cie: {
      type: Number,
    },
    landuse: {
      type: String,
    },
    landval: {
      type: Number,
    },
    med: {
      type: Number,
    },
    mips: {
      type: Number,
    },
    mixed_use: {
      type: String,
    },
    pdr: {
      type: Number,
    },
    restype: {
      type: String,
    },
    resunits: {
      type: Number,
    },
    retail: {
      type: Number,
    },
    st_area_sh: {
      type: Number,
    },
    st_length: {
      type: Number,
    },
    strucval: {
      type: Number,
    },
    usetype: {
      type: String,
    },
    visitor: {
      type: Number,
    },
    yrbuilt: {
      type: Number,
    }
  },
  { timestamps: true }
);

const Parcel = mongoose.model("Parcel", ParcelSchema);
export default Parcel;
