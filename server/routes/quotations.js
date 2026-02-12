import express from "express";
import Quotation from "../config/quotationSchema.js";

const router = express.Router();

// GET - list quotations
router.get("/", async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET - quotation by id
router.get("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json(quotation);
  } catch (error) {
    console.error("Error fetching quotation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST - create quotation
router.post("/", async (req, res) => {
  try {
    const { customerName } = req.body;
    if (!customerName) {
      return res.status(400).json({ message: "customerName is required" });
    }
    const quotation = await Quotation.create(req.body);
    res.status(201).json(quotation);
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT - update quotation
router.put("/:id", async (req, res) => {
  try {
    const updated = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating quotation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE - remove quotation
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Quotation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json({ message: "Quotation deleted" });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
