import mongoose from "mongoose";

const ServicePackageSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
  },
  packageType: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  addons: [
    {
      name: { type: String, required: true },
      price: { type: Number, default: 0 },
    },
  ],
  trimming: [
    {
      name: { type: String, required: true },
      price: { type: Number, default: 0 },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const ServicePackage =
  mongoose.models.ServicePackage ||
  mongoose.model("ServicePackage", ServicePackageSchema);

export default ServicePackage;
