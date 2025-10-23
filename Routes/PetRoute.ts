import express from "express";
import checkAuth from "../Middlewares/checkAuth.js";
import { createPet, deletePet, updatePet } from "../Controllers/PetController.ts";

const petRouter = express.Router();

petRouter.post("/createPet", checkAuth, createPet);
petRouter.put("/updatePet", checkAuth, updatePet);
petRouter.delete("/deletePet", checkAuth, deletePet);



export default petRouter;
