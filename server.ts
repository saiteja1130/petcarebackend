import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.ts";
import userRouter from "./Routes/UserRoute.ts";
import petRouter from "./Routes/PetRoute.ts";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", userRouter);
app.use("/api", petRouter);

connectDB();
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
