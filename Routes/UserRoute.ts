import express from "express";
import {
  getBreedsByType,
  getPetTypes,
  getServicePackages,
  getUser,
  login,
  signUp,
  updateProfile,
} from "../Controllers/UserController.ts";
import checkAuth from "../Middlewares/checkAuth.js";
import {
  createPet,
  deletePet,
  updatePet,
} from "../Controllers/PetController.ts";

const userRouter = express.Router();

userRouter.post("/user/login", login);
userRouter.post("/user/createUser", signUp);
userRouter.get("/user/getUser", checkAuth, getUser);
userRouter.put("/user/updateUser", checkAuth, updateProfile);
userRouter.post("/user/createPet", checkAuth, createPet);
userRouter.put("/user/updatePet", checkAuth, updatePet);
userRouter.delete("/user/deletePet", checkAuth, deletePet);
userRouter.get("/user/getPetTypes", checkAuth, getPetTypes);
userRouter.get("/user/getBreedsByType/:petTypeId", checkAuth, getBreedsByType);
userRouter.get(
  "/user/getServicePackages/:typeId",
  checkAuth,
  getServicePackages
);

export default userRouter;
