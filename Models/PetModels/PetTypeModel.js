import mongoose from "mongoose";

const PetTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, 
  },
  { timestamps: true }
);

const PetType = mongoose.models.PetType || mongoose.model("PetType", PetTypeSchema);

export default PetType;
