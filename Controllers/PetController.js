import Pet from "../Models/PetModel.js";

export const createPet = async (req, res) => {
  const ownerId = req.userId;
  const { name, type, breed, age, gender, vaccination, petPhoto, notes } =
    req.body;

  try {
    const errors = [];

    if (!name) errors.push("Pet name is required");
    if (!type) errors.push("Pet type is required");
    if (!breed) errors.push("Pet breed is required");
    if (age === undefined || age === null) errors.push("Pet age is required");
    if (!gender) errors.push("Pet gender is required");
    if (!["Male", "Female"].includes(gender))
      errors.push("Pet gender must be Male or Female");
    if (!petPhoto) errors.push("Pet photo is required");

    if (!vaccination) {
      errors.push("Vaccination info is required");
    } else {
      if (typeof vaccination.isVaccinated !== "boolean") {
        errors.push("isVaccinated must be true or false");
      }
      if (vaccination.isVaccinated && !vaccination.date) {
        errors.push("Vaccination date is required if isVaccinated is true");
      }
    }

    if (errors.length > 0) {
      return res.status(400).send({ message: errors, success: false });
    }

    const newPet = new Pet({
      ownerId,
      name,
      type,
      breed,
      age,
      gender,
      vaccination: {
        isVaccinated: vaccination.isVaccinated,
        date: vaccination.date || null,
      },
      petPhoto,
      notes: notes || "",
    });

    await newPet.save();

    res.status(201).send({
      message: "Pet added successfully",
      success: true,
      pet: {
        ...newPet.toObject(),
        petId: newPet._id,
      },
    });
  } catch (error) {
    console.error("ERROR ADDING PET:", error);
    res.status(500).send({ message: error.message, success: false });
  }
};

export const updatePet = async (req, res) => {
  const ownerId = req.userId;
  const {
    petId,
    name,
    type,
    breed,
    age,
    gender,
    vaccination,
    petPhoto,
    notes,
  } = req.body;

  try {
    const errors = [];

    if (!petId) errors.push("Pet ID is required");
    if (!name) errors.push("Pet name is required");
    if (!type) errors.push("Pet type is required");
    if (!breed) errors.push("Pet breed is required");
    if (age === undefined || age === null) errors.push("Pet age is required");
    if (!gender) errors.push("Pet gender is required");
    if (!["Male", "Female"].includes(gender))
      errors.push("Pet gender must be Male or Female");
    if (!petPhoto) errors.push("Pet photo is required");

    if (!vaccination) {
      errors.push("Vaccination info is required");
    } else {
      if (typeof vaccination.isVaccinated !== "boolean") {
        errors.push("isVaccinated must be true or false");
      }
      if (vaccination.isVaccinated && !vaccination.date) {
        errors.push("Vaccination date is required if isVaccinated is true");
      }
    }

    if (errors.length > 0) {
      return res.status(400).send({ message: errors, success: false });
    }

    const pet = await Pet.findOne({ _id: petId, ownerId });
    if (!pet) {
      return res.status(404).send({ message: "Pet not found", success: false });
    }

    pet.name = name;
    pet.type = type;
    pet.breed = breed;
    pet.age = age;
    pet.gender = gender;
    pet.petPhoto = petPhoto;
    pet.notes = notes || "";

    pet.vaccination.isVaccinated = vaccination.isVaccinated;
    pet.vaccination.date = vaccination.isVaccinated ? vaccination.date : null;

    await pet.save();

    res.status(200).send({
      message: "Pet updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("ERROR UPDATING PET:", error);
    res.status(500).send({ message: error.message, success: false });
  }
};

export const deletePet = async (req, res) => {
  const userId = req.userId;
  const { petId } = req.body;

  if (!petId) {
    return res
      .status(400)
      .send({ message: "Pet ID is required", success: false });
  }

  try {
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).send({ message: "Pet not found", success: false });
    }

    if (pet.ownerId.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Not authorized to delete this pet", success: false });
    }

    await Pet.findByIdAndDelete(petId);

    res.send({ message: "Pet deleted successfully", success: true });
  } catch (error) {
    console.error("ERROR DELETING PET:", error);
    res.status(500).send({ message: error.message, success: false });
  }
};
