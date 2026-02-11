import express from "express";
import LeadSource from "../config/leadSourceSchema.js";

const router = express.Router();

// ========================
// GET - Fetch lead sources
// ========================
router.get("/", async (req, res) => {
  try {
    const sources = await LeadSource.find().sort({ createdAt: -1 });
    res.json(sources);
  } catch (error) {
    console.error("Error fetching lead sources:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - Fetch lead source by ID
// ========================
router.get("/:id", async (req, res) => {
  try {
    const source = await LeadSource.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ message: "Lead source not found" });
    }
    res.json(source);
  } catch (error) {
    console.error("Error fetching lead source:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST - Create lead source
// ========================
router.post("/", async (req, res) => {
  try {
    const { name, description, status } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    const source = await LeadSource.create({
      name,
      description,
      status: status || "Active",
    });
    res.status(201).json(source);
  } catch (error) {
    console.error("Error creating lead source:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Lead source already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// PUT - Update lead source
// ========================
router.put("/:id", async (req, res) => {
  try {
    const updated = await LeadSource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Lead source not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating lead source:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE - Remove lead source
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await LeadSource.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Lead source not found" });
    }
    res.json({ message: "Lead source deleted" });
  } catch (error) {
    console.error("Error deleting lead source:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
