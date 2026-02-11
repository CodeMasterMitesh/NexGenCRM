import express from "express";
import User from "../config/schema.js";

const router = express.Router();

// ========================
// GET - Fetch all customers
// ========================
router.get("/", async (req, res) => {
  try {
    const customers = await User.find({ type: "Customer" }).select("-password");
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - Fetch customer by ID
// ========================
router.get("/:id", async (req, res) => {
  try {
    const customer = await User.findOne({ _id: req.params.id, type: "Customer" }).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST - Create customer
// ========================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      leadSource,
      status,
      notes,
      customerCategory,
      address,
      city,
      state,
      country,
    } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({ message: "name, email, and mobile are required" });
    }

    const customer = await User.create({
      name,
      email,
      mobile,
      leadSource,
      status: status || "Active",
      notes,
      customerCategory,
      address,
      city,
      state,
      country,
      type: "Customer",
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// PUT - Update customer
// ========================
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, type: "Customer" },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE - Remove customer
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, type: "Customer" });
    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
