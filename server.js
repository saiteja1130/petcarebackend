import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import userRouter from "./Routes/UserRoute.js";
import adminRouter from "./Routes/AdminRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api", userRouter);
app.use("/api", adminRouter);

connectDB();

// const admins = [
//   {
//     name: "Saiteja Admin",
//     email: "saitejanetha1920@gmail.com",
//     password: "admin123",
//   },
// ];

// const seedAdmins = async () => {
//   try {
//     for (const adminData of admins) {
//       const existingAdmin = await Admin.findOne({ email: adminData.email });
//       if (existingAdmin) {
//         console.log(`Admin with email ${adminData.email} already exists`);
//         continue;
//       }
//       const hashedPassword = await bcrypt.hash(adminData.password, 10);
//       const newAdmin = new Admin({
//         name: adminData.name,
//         email: adminData.email,
//         password: hashedPassword,
//       });
//       await newAdmin.save();
//       console.log(`Created admin: ${adminData.email}`);
//     }
//     console.log("Admin seeding complete");
//   } catch (error) {
//     console.error("Error seeding admins:", error);
//   }
// };

// const seedPetBreeds = async () => {
//   try {
//     console.log("✅ Connected to MongoDB");

//     // Pet breeds mapped by pet type name
//     const breedsByType: Record<string, string[]> = {
//       Dog: [
//         "Labrador Retriever",
//         "German Shepherd",
//         "Golden Retriever",
//         "Bulldog",
//         "Poodle",
//       ],
//       Cat: ["Persian", "Siamese", "Maine Coon", "Bengal", "Sphynx"],
//     };

//     for (const [typeName, breeds] of Object.entries(breedsByType)) {
//       const petType = await PetType.findOne({ name: typeName });

//       if (!petType) {
//         console.warn(`⚠️ Pet type "${typeName}" not found. Skipping...`);
//         continue;
//       }

//       for (const breedName of breeds) {
//         const existingBreed = await PetBreed.findOne({
//           petTypeId: petType._id,
//           name: breedName,
//         });

//         if (!existingBreed) {
//           await PetBreed.create({
//             petTypeId: petType._id,
//             name: breedName,
//           });
//           console.log(`➕ Added ${breedName} under ${typeName}`);
//         } else {
//           console.log(`⚠️ ${breedName} already exists for ${typeName}`);
//         }
//       }
//     }

//     console.log("🎉 Pet breeds seeding completed!");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Error seeding pet breeds:", error);
//     process.exit(1);
//   }
// };

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// seedPetBreeds();
// seedAdmins();
