import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: ["Vehicle", "Service", "Accessory", "Spare", "Other"],
      default: "Vehicle",
    },
    vehicleType: {
      type: String,
      enum: ["2W", "4W", "Both", ""],
      default: "",
    },
    brand: { type: String, default: "", trim: true },
    model: { type: String, default: "", trim: true },
    variant: { type: String, default: "", trim: true },
    unitPrice: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    stockQty: { type: Number, default: 0 },
    unit: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
