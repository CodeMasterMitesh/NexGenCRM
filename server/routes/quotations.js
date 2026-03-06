import express from "express";
import Quotation from "../config/quotationSchema.js";
import { renderSalesPdfBuffer } from "../utils/pdfDocuments.js";

const router = express.Router();

const recalculateTotals = (items = []) => {
  const normalizedItems = items
    .filter((item) => String(item.productName || "").trim())
    .map((item) => ({
      ...item,
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
      taxRate: Number(item.taxRate || 0),
      discount: Number(item.discount || 0),
    }));

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountTotal = normalizedItems.reduce((sum, item) => sum + item.discount, 0);
  const taxTotal = normalizedItems.reduce((sum, item) => {
    const taxable = Math.max(item.quantity * item.unitPrice - item.discount, 0);
    return sum + (taxable * item.taxRate) / 100;
  }, 0);
  const grandTotal = Math.max(subtotal - discountTotal, 0) + taxTotal;

  return { items: normalizedItems, subtotal, discountTotal, taxTotal, grandTotal };
};

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

router.get("/:id/pdf", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const pdfBuffer = await renderSalesPdfBuffer(quotation.toObject(), "Quotation");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=quotation-${quotation._id}.pdf`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating quotation pdf:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST - create quotation
router.post("/", async (req, res) => {
  try {
    const { customerName, status = "Draft" } = req.body;
    if (!customerName) {
      return res.status(400).json({ message: "customerName is required" });
    }
    if (!["Draft", "Sent", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid quotation status" });
    }

    const totals = recalculateTotals(req.body.items || []);
    const quotation = await Quotation.create({ ...req.body, ...totals });
    res.status(201).json(quotation);
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT - update quotation
router.put("/:id", async (req, res) => {
  try {
    if (req.body.status && !["Draft", "Sent", "Accepted", "Rejected"].includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid quotation status" });
    }

    const totals = recalculateTotals(req.body.items || []);
    const updated = await Quotation.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...totals },
      { new: true, runValidators: true }
    );
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
