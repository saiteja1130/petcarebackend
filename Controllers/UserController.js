import bcrypt from "bcryptjs";
import User from "../Models/UserModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import ServiceArea from "../Models/ServiceAreaModel.js";
import Pet from "../Models/PetModel.js";
import PetType from "../Models/PetTypeModel.js";
import PetBreed from "../Models/PetBreedModel.js";
import ServicePackage from "../Models/ServicePackageModel.js";

export const login = async (req, res) => {
  const { email, password, deviceToken } = req.body;
  try {
    const errors = [];
    if (!email) errors.push("Email Is Required");
    if (!password) errors.push("Password Is Required");
    if (!deviceToken) errors.push("Device Token Is Required");

    if (errors.length > 0) {
      return res.send({ message: errors, success: false });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.send({
        message: "No User Found With This Email-ID",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.send({ message: "Incorrect Password", success: false });
    }

    if (deviceToken) {
      existingUser.deviceToken = deviceToken;
      await existingUser.save();
    }

    const token = generateToken(existingUser._id);

    return res.send({ message: "Login Successful", token, success: true });
  } catch (error) {
    console.log("ERROR WHILE LOGIN", error);
    res.send({ message: error.message, success: false });
  }
};

export const signUp = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    profile,
    isProvider,
    providerDetails,
    serviceArea,
    deviceToken, // <-- required now
  } = req.body;

  try {
    const errors = [];

    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (!phone) errors.push("Phone is required");

    if (!address) {
      errors.push("Address is required");
    } else {
      if (!address.street) errors.push("Street is required");
      if (!address.city) errors.push("City is required");
      if (!address.state) errors.push("State is required");
      if (!address.pincode) errors.push("Pincode is required");
      if (!address.longitude) errors.push("Longitude is required");
      if (!address.latitude) errors.push("Latitude is required");
    }

    if (!deviceToken) {
      errors.push("Device token is required"); // <-- throw error if missing
    }

    if (isProvider) {
      if (!providerDetails) {
        errors.push("Provider details are required for providers");
      } else {
        if (
          !providerDetails.servicesOffered ||
          providerDetails.servicesOffered.length === 0
        ) {
          errors.push("At least one service must be offered");
        }
      }

      if (!serviceArea) {
        errors.push("Service area is required for providers");
      } else {
        if (!serviceArea.areaName) errors.push("Service area name is required");
        if (!serviceArea.city) errors.push("Service area city is required");
        if (!serviceArea.state) errors.push("Service area state is required");
        if (!serviceArea.pincode)
          errors.push("Service area pincode is required");
        if (!serviceArea.latitude)
          errors.push("Service area latitude is required");
        if (!serviceArea.longitude)
          errors.push("Service area longitude is required");
      }
    }

    if (errors.length > 0) {
      return res.status(400).send({ message: errors, success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "User with this email already exists",
        success: false,
      });
    }

    const saltKey = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltKey);

    const newUserData = {
      name,
      email,
      password: hashPassword,
      phone,
      address,
      profile: profile || "",
      isProvider: !!isProvider,
      deviceToken, // <-- required, already checked
    };

    if (isProvider && providerDetails) {
      newUserData.providerDetails = {
        servicesOffered: providerDetails.servicesOffered,
        experience: providerDetails.experience,
      };
    }

    const newUser = new User(newUserData);
    await newUser.save();

    if (isProvider && serviceArea) {
      const newServiceArea = new ServiceArea({
        userId: newUser._id,
        areaName: serviceArea.areaName,
        city: serviceArea.city,
        state: serviceArea.state || "",
        pincode: serviceArea.pincode || "",
        latitude: serviceArea.latitude || "",
        longitude: serviceArea.longitude || "",
      });
      await newServiceArea.save();
    }

    const token = generateToken(newUser._id);

    res.send({ message: "User registered successfully", success: true, token });
  } catch (error) {
    console.error("ERROR DURING SIGNUP", error);
    res.status(500).send({ message: error.message, success: false });
  }
};

export const getUser = async (req, res) => {
  const userId = req.userId;

  try {
    const findUser = await User.findById(userId)
      .select("-password -createdAt -updatedAt")
      .lean();

    if (!findUser) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    let serviceArea = null;
    if (findUser.isProvider) {
      const sa = await ServiceArea.findOne({ userId: findUser._id }).lean();
      if (sa) {
        const { _id, ...rest } = sa;
        serviceArea = { ...rest, serviceAreaId: _id };
      }
    }

    const petsRaw = await Pet.find({ ownerId: userId })
      .select("-createdAt -updatedAt")
      .lean();

    const pets = petsRaw.map(({ _id, ...rest }) => ({ ...rest, petId: _id }));

    const userObj = { ...findUser, userId: findUser._id, serviceArea, pets };
    delete userObj._id;

    res.json({ success: true, user: userObj });
  } catch (error) {
    console.error("ERROR FETCHING USER:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.userId;
  const {
    name,
    address,
    profile,
    providerDetails,
    serviceArea,
    providerVerification,
  } = req.body;

  try {
    const errors = [];

    if (!name) errors.push("Name is required");

    if (!address) {
      errors.push("Address is required");
    } else {
      if (!address.street) errors.push("Street is required");
      if (!address.city) errors.push("City is required");
      if (!address.state) errors.push("State is required");
      if (!address.pincode) errors.push("Pincode is required");
      if (!address.longitude) errors.push("Longitude is required");
      if (!address.latitude) errors.push("Latitude is required");
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    if (existingUser.isProvider) {
      if (!providerDetails) {
        errors.push("Provider details are required for providers");
      } else {
        if (
          !providerDetails.servicesOffered ||
          providerDetails.servicesOffered.length === 0
        ) {
          errors.push("At least one service must be offered");
        }
        if (!providerDetails.experience)
          errors.push("Experience is required for providers");
      }

      if (providerVerification) {
        if (
          !providerVerification.aadhaarNumber ||
          providerVerification.aadhaarNumber.length !== 12
        ) {
          errors.push("Aadhaar number must be 12 digits");
        }
        if (!providerVerification.aadhaarFrontPhoto)
          errors.push("Aadhaar front photo is required");
        if (!providerVerification.aadhaarBackPhoto)
          errors.push("Aadhaar back photo is required");
        if (typeof providerVerification.verified !== "boolean") {
          errors.push("Verified status must be boolean");
        }
      }

      if (!serviceArea) {
        errors.push("Service area is required for providers");
      } else {
        if (!serviceArea.areaName) errors.push("Service area name is required");
        if (!serviceArea.city) errors.push("Service area city is required");
        if (!serviceArea.state) errors.push("Service area state is required");
        if (!serviceArea.pincode)
          errors.push("Service area pincode is required");
        if (!serviceArea.latitude)
          errors.push("Service area latitude is required");
        if (!serviceArea.longitude)
          errors.push("Service area longitude is required");
      }
    }

    if (errors.length > 0) {
      return res.status(400).send({ message: errors, success: false });
    }

    existingUser.name = name;
    existingUser.address = address;
    existingUser.profile = profile || existingUser.profile;

    if (existingUser.isProvider && providerDetails) {
      existingUser.providerDetails.servicesOffered =
        providerDetails.servicesOffered;
      existingUser.providerDetails.experience = providerDetails.experience;
    }

    if (existingUser.isProvider && providerVerification) {
      existingUser.providerVerification.aadhaarNumber =
        providerVerification.aadhaarNumber;
      existingUser.providerVerification.aadhaarFrontPhoto =
        providerVerification.aadhaarFrontPhoto;
      existingUser.providerVerification.aadhaarBackPhoto =
        providerVerification.aadhaarBackPhoto;
      existingUser.providerVerification.verified =
        providerVerification.verified;
    }

    await existingUser.save();

    if (existingUser.isProvider && serviceArea) {
      const existingServiceArea = await ServiceArea.findOne({ userId });
      if (existingServiceArea) {
        existingServiceArea.areaName = serviceArea.areaName;
        existingServiceArea.city = serviceArea.city;
        existingServiceArea.state = serviceArea.state;
        existingServiceArea.pincode = serviceArea.pincode;
        existingServiceArea.latitude = serviceArea.latitude;
        existingServiceArea.longitude = serviceArea.longitude;
        await existingServiceArea.save();
      } else {
        await ServiceArea.create({
          userId,
          areaName: serviceArea.areaName,
          city: serviceArea.city,
          state: serviceArea.state,
          pincode: serviceArea.pincode,
          latitude: serviceArea.latitude,
          longitude: serviceArea.longitude,
        });
      }
    }

    res.send({ message: "Profile updated successfully", success: true });
  } catch (error) {
    console.error("ERROR DURING PROFILE UPDATE", error);
    res.status(500).send({ message: error.message, success: false });
  }
};

export const getPetTypes = async (req, res) => {
  try {
    const petTypes = await PetType.find().sort({ createdAt: -1 });
    const petData = petTypes.map((pet) => ({
      petType: pet.name,
      petTypeId: pet._id,
    }));
    res.send({ status: true, petTypes: petData, message: "Pet Types" });
  } catch (error) {
    console.log("GET PET TYPES ERROR", error);
    res.send({ message: error.message, status: false });
  }
};

export const getBreedsByType = async (req, res) => {
  const { petTypeId } = req.params;
  try {
    const breeds = await PetBreed.find({ petTypeId })
      .select("-_id -createdAt -updatedAt -__v -petTypeId")
      .lean();
    const petBreeds = breeds.map((pet) => pet.name);
    res.status(200).json({ success: true, breeds: petBreeds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServicePackages = async (req, res) => {
  try {
    const { typeId } = req.params;
    const serviceMap = { 1: "Walking", 2: "Grooming" };
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
