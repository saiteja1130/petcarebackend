import express from "express";
import { getUser, login, signUp, updateProfile } from "../Controllers/UserController.ts";
import checkAuth from "../Middlewares/checkAuth.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/createUser", signUp);
userRouter.get("/getUser", checkAuth, getUser);
userRouter.put("/updateUser", checkAuth, updateProfile);


export default userRouter;
