import mongoose from "mongoose";

const ServiceAreaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    areaName: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String },
    latitude: { type: String },
    longitude: { type: String }, 
  },
  { timestamps: true }
);

const ServiceArea =
  mongoose.models.ServiceArea || mongoose.model("ServiceArea", ServiceAreaSchema);

export default ServiceArea;
