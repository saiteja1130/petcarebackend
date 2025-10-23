import mongoose from "mongoose";

const PetTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "Dog", "Cat"
  },
  { timestamps: true }
);

const PetType = mongoose.models.PetType || mongoose.model("PetType", PetTypeSchema);

export default PetType;
