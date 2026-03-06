import express from "express";
import ProformaInvoice from "../config/proformaInvoiceSchema.js";
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

router.get("/:id/pdf", async (req, res) => {
  try {
    const invoice = await ProformaInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Proforma invoice not found" });
    }

    const pdfBuffer = await renderSalesPdfBuffer(invoice.toObject(), "Proforma Invoice");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=proforma-${invoice._id}.pdf`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating proforma invoice pdf:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST - create proforma invoice
router.post("/", async (req, res) => {
  try {
    const { customerName, status = "Draft" } = req.body;
    if (!customerName) {
      return res.status(400).json({ message: "customerName is required" });
    }
    if (!["Draft", "Issued", "Paid", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid proforma invoice status" });
    }

    const totals = recalculateTotals(req.body.items || []);
    const invoice = await ProformaInvoice.create({ ...req.body, ...totals });
    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating proforma invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT - update proforma invoice
router.put("/:id", async (req, res) => {
  try {
    if (req.body.status && !["Draft", "Issued", "Paid", "Cancelled"].includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid proforma invoice status" });
    }

    const totals = recalculateTotals(req.body.items || []);
    const updated = await ProformaInvoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...totals },
      { new: true, runValidators: true }
    );
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
