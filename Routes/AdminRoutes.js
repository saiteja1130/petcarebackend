import express from "express";
import { checkAdminAuth } from "../Middlewares/checkAdminAuth.js";
import {
  addPetBreed,
  addPetType,
  addServicePackage,
  deletePetType,
  deleteServicePackage,
  getBreedsByType,
  getPetTypes,
  getServicePackages,
  loginAdmin,
  toggleServicePackage,
  updateServicePackage,
} from "../Controllers/AdminAuthController.js";

const adminRouter = express.Router();

adminRouter.post("/admin/login", loginAdmin);
adminRouter.post("/admin/addPetType", checkAdminAuth, addPetType);
adminRouter.get("/admin/getPetTypes", checkAdminAuth, getPetTypes);
adminRouter.post("/admin/deletePetType", checkAdminAuth, deletePetType);
adminRouter.post("/admin/addPetBreed", checkAdminAuth, addPetBreed);
adminRouter.get(
  "/admin/getBreedsByType/:petTypeId",
  checkAdminAuth,
  getBreedsByType
);

adminRouter.post("/admin/addServicePackage", checkAdminAuth, addServicePackage);
adminRouter.post(
  "/admin/updateServicePackage",
  checkAdminAuth,
  updateServicePackage
);
adminRouter.post(
  "/admin/toggleServicePackage/:packageId",
  checkAdminAuth,
  toggleServicePackage
);
adminRouter.get(
  "/admin/getServicePackages/:typeId",
  checkAdminAuth,
  getServicePackages
);
adminRouter.post(
  "/admin/deleteServicePackage/:packageId",
  checkAdminAuth,
  deleteServicePackage
);


export default adminRouter;
