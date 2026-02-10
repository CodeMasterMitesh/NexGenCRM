import express from "express";
import bcrypt from "bcryptjs";
import User from "../config/schema.js";

const router = express.Router();

// ========================
// GET - Fetch all Leads
// ========================
router.get("/", async (req, res) => {
  try {
    const leads = await User.find({ type: "Lead" });
    // console.log("Leads fetched:", leads);
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - Fetch single lead by ID
// ========================
router.get("/:id", async (req, res) => {
  try {
    const lead = await User.findById(req.params.id).select("-password");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST - Create new lead
// ========================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      leadSource,
      status,
      expectedValue,
      notes,
    } = req.body;

    // Validation
    if (!name || !email || !mobile) {
      return res.status(400).json({
        message: "name, email, and mobile are required",
      });
    }

    const newUser = new User({
      name,
      email,
      mobile,
      leadSource,
      status,
      expectedValue,
      notes,
      type: "Lead",
    });

    const savedLead = await newUser.save();
    const leadResponse = savedLead.toObject();

    res.status(201).json(leadResponse);
  } catch (error) {
    console.error("Error creating lead:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// PUT - Update lead
// ========================
router.put("/:id", async (req, res) => {
  try {
    const updatedLead = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE - Delete lead
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Lead deleted successfully", lead: deletedUser });
  } catch (error) {
    console.error("Error deleting lead:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
