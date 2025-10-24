import mongoose from "mongoose";

const PetBreedSchema = new mongoose.Schema(
  {
    petTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PetType",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

PetBreedSchema.index({ typeId: 1, name: 1 }, { unique: true });

const PetBreed =
  mongoose.models.PetBreed || mongoose.model("PetBreed", PetBreedSchema);

export default PetBreed;
