import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: "" },
    productName: { type: String, required: true },
    description: { type: String, default: "" },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
  },
  { _id: false }
);

const proformaInvoiceSchema = new mongoose.Schema(
  {
    quotationId: { type: String, default: "" },
    inquiryId: { type: String, default: "" },
    sourceType: { type: String, enum: ["lead", "customer", ""], default: "" },
    sourceId: { type: String, default: "" },
    invoiceNumber: { type: String, default: "" },
    issueDate: { type: Date },
    dueDate: { type: Date },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    customerMobile: { type: String, default: "" },
    vehicleType: { type: String, enum: ["2W", "4W", "Both", ""], default: "" },
    items: { type: [invoiceItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Issued", "Paid", "Cancelled"],
      default: "Draft",
    },
    notes: { type: String, default: "" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const ProformaInvoice = mongoose.model("ProformaInvoice", proformaInvoiceSchema);

export default ProformaInvoice;
