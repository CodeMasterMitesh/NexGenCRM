import express from "express";
import Inquiry from "../config/inquirySchema.js";

const router = express.Router();

// GET - list inquiries
router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET - inquiry by id
router.get("/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    res.json(inquiry);
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST - create inquiry
router.post("/", async (req, res) => {
  try {
    const { sourceType, sourceId } = req.body;
    if (!sourceType || !sourceId) {
      return res.status(400).json({ message: "sourceType and sourceId are required" });
    }
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json(inquiry);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT - update inquiry
router.put("/:id", async (req, res) => {
  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE - remove inquiry
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    res.json({ message: "Inquiry deleted" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST - add followup to inquiry
router.post("/:id/followups", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    const { followupDate, followupTime, status, priority, remarks } = req.body;
    if (!followupDate) {
      return res.status(400).json({ message: "followupDate is required" });
    }
    const followup = {
      followupDate: new Date(followupDate),
      followupTime: followupTime || "",
      status: status || "Pending",
      priority: priority || "Medium",
      remarks: remarks || "",
      createdBy: req.body.createdBy || "",
    };
    inquiry.followups.push(followup);
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (error) {
    console.error("Error adding followup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT - update followup
router.put("/:id/followups/:followupId", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    const followup = inquiry.followups.find((f) => f._id.toString() === req.params.followupId);
    if (!followup) {
      return res.status(404).json({ message: "Followup not found" });
    }
    if (req.body.followupDate) followup.followupDate = new Date(req.body.followupDate);
    if (req.body.followupTime !== undefined) followup.followupTime = req.body.followupTime;
    if (req.body.status) followup.status = req.body.status;
    if (req.body.priority) followup.priority = req.body.priority;
    if (req.body.remarks !== undefined) followup.remarks = req.body.remarks;
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    console.error("Error updating followup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE - remove followup
router.delete("/:id/followups/:followupId", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    inquiry.followups = inquiry.followups.filter((f) => f._id.toString() !== req.params.followupId);
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    console.error("Error deleting followup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
