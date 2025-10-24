import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: { type: String, required: true }, 
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "ServicePackage", required: true },
    packageName: { type: String, required: true },
    duration: { type: String }, 
    price: { type: Number, required: true },
    addons: [
      {
        name: String,
        price: Number,
      },
    ],
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
    scheduledDate: { type: Date, required: true }, 
    endDate: { type: Date }, 
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;
