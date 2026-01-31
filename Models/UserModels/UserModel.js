import mongoose from "mongoose";
// MONGO_DB=mongodb+srv://saiintern:Saiteja1920@cluster.0hq2xic.mongodb.net/

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },

    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      latitude: { type: String },
      longitude: { type: String },
    },

    profile: { type: String, default: "" },
    isProvider: { type: Boolean, default: false },

    providerDetails: {
      servicesOffered: {
        type: Array,
        default: [],
      },
      experience: { type: String },
    },

    providerVerification: {
      aadhaarNumber: { type: String, minlength: 12, maxlength: 12, trim: true },
      aadhaarFrontPhoto: { type: String },
      aadhaarBackPhoto: { type: String },
      verified: { type: Boolean, default: false },
    },
    deviceToken: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
