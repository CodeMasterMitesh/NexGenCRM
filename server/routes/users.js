import express from "express";
import bcrypt from "bcryptjs";
import User from "../config/schema.js";

const router = express.Router();

// ========================
// GET - Fetch all users
// ========================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - Fetch single user by ID
// ========================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST - Create new user
// ========================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      role,
      department,
      designation,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      status,
      profilePhoto,
    } = req.body;

    // Validation
    if (!name || !email || !mobile) {
      return res.status(400).json({
        message: "name, email, and mobile are required",
      });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: role || "Sales",
      department,
      designation,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      status: status || "Active",
      profilePhoto,
    });

    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// PUT - Update user
// ========================
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE - Delete user
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
