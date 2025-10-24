import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../Models/AdminModel.js";
import PetType from "../Models/PetTypeModel.js";
import PetBreed from "../Models/PetBreedModel.js";
import ServicePackage from "../Models/ServicePackageModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_admin_secret_key";

export const loginAdmin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
        success: false,
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).send({
        message: "Admin not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({
      message: "Login successful",
      success: true,
      token,
      admin: {
        adminId: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error: any) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).send({ message: error.message, success: false });
  }
};

export const addPetType = async (req: any, res: any) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.send({
        message: "Pet Type Is Required",
        status: false,
      });
    }

    const existingPet = await PetType.findOne({ name });
    if (existingPet) {
      return res.send({
        message: "Pet type already exists",
        status: false,
      });
    }

    const pet = await PetType.create({ name });

    res.send({
      message: "Pet Type Added Successfully",
      status: true,
    });
  } catch (error: any) {
    console.log("PET ADD ERROR", error);
    res.send({ message: error.message, status: false });
  }
};

export const getPetTypes = async (req: any, res: any) => {
  try {
    const petTypes = await PetType.find().sort({ createdAt: -1 });
    const petData = petTypes.map((pet) => ({
      petType: pet.name,
      petTypeId: pet._id,
    }));
    res.send({
      status: true,
      petTypes: petData,
      message: "Pet Types",
    });
  } catch (error: any) {
    console.log("GET PET TYPES ERROR", error);
    res.send({ message: error.message, status: false });
  }
};

export const deletePetType = async (req: any, res: any) => {
  const { petTypeId } = req.body;
  try {
    const petDeleted = await PetType.findByIdAndDelete({ _id: petTypeId });
    if (!petDeleted) {
      return res.send({
        message: "Pet type not found",
        status: false,
      });
    }
    res.send({
      status: true,
      message: "Pet type deleted successfully",
    });
  } catch (error: any) {
    console.log("DELETE PET TYPES ERROR", error);
    res.send({ message: error.message, status: false });
  }
};

export const addPetBreed = async (req: any, res: any) => {
  const { petTypeId, name } = req.body;

  try {
    if (!petTypeId || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Type ID and name are required" });
    }

    const existing = await PetBreed.findOne({ petTypeId, name });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Breed already exists" });

    const breed = new PetBreed({ petTypeId, name });
    await breed.save();

    res.status(201).json({ success: true, breed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBreedsByType = async (req: any, res: any) => {
  const { petTypeId } = req.params;
  try {
    const breeds = await PetBreed.find({ petTypeId })
      .select("-_id -createdAt -updatedAt -__v -petTypeId")
      .lean();
    const petBreeds = breeds.map((pet) => pet.name);
    res.status(200).json({ success: true, breeds: petBreeds });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addServicePackage = async (req: any, res: any) => {
  try {
    const { serviceType, packageType, duration, price, addons, trimming } =
      req.body;

    if (!serviceType || !packageType || !duration || !price) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existing = await ServicePackage.findOne({ serviceType, packageType });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Package already exists" });
    }

    const newPackage = await ServicePackage.create({
      serviceType,
      packageType,
      duration,
      price,
      addons: addons || [],
      trimming: trimming || [],
      isActive: true,
    });

    res.status(201).json({ success: true ,message:"Service Package Added Successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateServicePackage = async (req: any, res: any) => {
  try {
    const { packageId, ...updateData } = req.body;

    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    const updatedPackage = await ServicePackage.findByIdAndUpdate(
      packageId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleServicePackage = async (req: any, res: any) => {
  try {
    const { packageId } = req.params;
    const { isActive } = req.body;

    const pkg = await ServicePackage.findByIdAndUpdate(
      packageId,
      { isActive },
      { new: true }
    );

    if (!pkg)
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });

    res
      .status(200)
      .json({ success: true, message: "Package Status updated Successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServicePackages = async (req: any, res: any) => {
  try {
    const { typeId } = req.params;
    const serviceMap: Record<string, string> = {
      "1": "Walking",
      "2": "Grooming",
    };
    const serviceName = serviceMap[typeId];

    const filter = serviceName ? { serviceType: serviceName } : {};

    const packages = await ServicePackage.find(filter)
      .select("-__v")
      .lean()
      .sort({ createdAt: -1 });

    const structuredPackages = packages.map((pack) => {
      const { _id, addons = [], trimming = [], ...rest } = pack;

      const cleanedAddons = addons.map(({ _id, ...addonRest }) => ({
        ...addonRest,
      }));

      const cleanedTrimming = trimming.map(({ _id, ...trimRest }) => ({
        ...trimRest,
      }));

      return {
        ...rest,
        packageId: _id, 
        addons: cleanedAddons,
        trimming: cleanedTrimming,
      };
    });

    res.status(200).json({ success: true, packages: structuredPackages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
