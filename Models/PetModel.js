import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },

    vaccination: {
      isVaccinated: { type: Boolean, required: true, default: false },
      date: { type: Date },
    },

    petPhoto: {
      type: String,
      required: true,
    },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Pet = mongoose.models.Pet || mongoose.model("Pet", PetSchema);

export default Pet;
