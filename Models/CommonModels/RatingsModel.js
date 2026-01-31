import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    serviceType: {
      type: String, 
    },
  },
  { timestamps: true }
);

const Rating = mongoose.models.Ratings || mongoose.model("Ratings", RatingSchema);

export default Rating;
