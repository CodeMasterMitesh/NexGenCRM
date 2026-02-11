import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    mobile: {
      type: String,
      required: true,
    },
    mobile2: {
      type: String,
      default: "",
    },
    contactPerson: {
      type: String,
      default: "",
      trim: true,
    },
    email2: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      required: false,
    },
    expectedValue: {
      type: Number,
      default: 0,
    },
    leadSource: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "Sales",
      enum: ["Sales", "Marketing", "Operations", "Manager", "Admin"],
    },
    department: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive", "New", "Contacted", "Qualified", "Unqualified", "Converted", "Lost"],
    },
    customerCategory: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: String,
      default: "",
    },
    enteredBy: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Hot", "Warm", "Cold", ""],
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    followUps: [
      {
        date: { type: Date, required: true },
        note: { type: String, required: true },
        followupType: { type: String, default: "Call" },
        followupAfterDays: { type: Number, default: 0 },
        priority: { type: String, enum: ["Hot", "Warm", "Cold", ""], default: "" },
        status: {
          type: String,
          enum: ["Scheduled", "In Progress", "Completed", "Overdue"],
          default: "Scheduled",
        },
        assignTo: { type: String, default: "" },
        enterBy: { type: String, default: "" },
        remarks: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
