import express from "express";
import ProformaInvoice from "../config/proformaInvoiceSchema.js";

const router = express.Router();

// GET - list proforma invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await ProformaInvoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error("Error fetching proforma invoices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET - invoice by id
router.get("/:id", async (req, res) => {
  try {
    const invoice = await ProformaInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Proforma invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    console.error("Error fetching proforma invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST - create proforma invoice
router.post("/", async (req, res) => {
  try {
    const { customerName } = req.body;
    if (!customerName) {
      return res.status(400).json({ message: "customerName is required" });
    }
    const invoice = await ProformaInvoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating proforma invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT - update proforma invoice
router.put("/:id", async (req, res) => {
  try {
    const updated = await ProformaInvoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Proforma invoice not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating proforma invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE - remove proforma invoice
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ProformaInvoice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Proforma invoice not found" });
    }
    res.json({ message: "Proforma invoice deleted" });
  } catch (error) {
    console.error("Error deleting proforma invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
