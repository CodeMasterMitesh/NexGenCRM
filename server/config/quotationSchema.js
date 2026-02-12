import mongoose from "mongoose";

const quotationItemSchema = new mongoose.Schema(
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

const quotationSchema = new mongoose.Schema(
  {
    inquiryId: { type: String, default: "" },
    sourceType: { type: String, enum: ["lead", "customer", ""], default: "" },
    sourceId: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    customerMobile: { type: String, default: "" },
    vehicleType: { type: String, enum: ["2W", "4W", "Both", ""], default: "" },
    items: { type: [quotationItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Accepted", "Rejected"],
      default: "Draft",
    },
    validUntil: { type: Date },
    notes: { type: String, default: "" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;
