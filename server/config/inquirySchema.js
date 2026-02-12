import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      enum: ["lead", "customer"],
      required: true,
    },
    sourceId: { type: String, required: true },
    sourceName: { type: String, default: "" },
    contactPerson: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    mobile: { type: String, default: "" },
    vehicleType: { type: String, enum: ["2W", "4W", "Both", ""], default: "" },
    requirementType: {
      type: String,
      enum: ["Vehicle", "Service", "Accessories", ""],
      default: "",
    },
    showroomRequired: { type: Boolean, default: false },
    serviceCenterRequired: { type: Boolean, default: false },
    modelInterested: { type: String, default: "", trim: true },
    variant: { type: String, default: "", trim: true },
    quantity: { type: Number, default: 1 },
    expectedDeliveryDate: { type: Date },
    status: {
      type: String,
      enum: ["New", "In Progress", "Qualified", "Lost", "Converted"],
      default: "New",
    },
    assignedTo: { type: String, default: "" },
    createdBy: { type: String, default: "" },
    notes: { type: String, default: "" },
    followups: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        followupDate: { type: Date, required: true },
        followupTime: { type: String, default: "" },
        status: {
          type: String,
          enum: ["Scheduled", "Completed", "Cancelled", "Pending"],
          default: "Pending",
        },
        priority: {
          type: String,
          enum: ["Low", "Medium", "High"],
          default: "Medium",
        },
        remarks: { type: String, default: "" },
        createdBy: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
