import express from "express";
import bcrypt from "bcryptjs";
import User from "../config/schema.js";

const router = express.Router();

// ========================
// GET - Fetch all Leads
// ========================
router.get("/", async (req, res) => {
  try {
    const isAdmin = req.user?.role === "Admin";
    const userId = req.user?.sub;
    const userName = req.user?.name;
    const filter = isAdmin
      ? { type: { $in: ["lead", "Lead"] } }
      : {
          type: { $in: ["lead", "Lead"] },
          $or: [{ assignedTo: userId }, { assignedTo: userName }],
        };

    const leads = await User.find(filter);
    // console.log("Leads fetched:", leads);
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - Dashboard follow-up summary
// ========================
router.get("/dashboard/followups/summary", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isAdmin = req.user?.role === "Admin";
    const userId = req.user?.sub;
    const userName = req.user?.name;
    const filter = isAdmin
      ? { type: { $in: ["lead", "Lead"] } }
      : {
          type: { $in: ["lead", "Lead"] },
          $or: [{ assignedTo: userId }, { assignedTo: userName }],
        };

    const leads = await User.find(filter);
    const todayFollowups = [];
    const overdueFollowups = [];
    const upcomingFollowups = [];

    leads.forEach(lead => {
      if (Array.isArray(lead.followUps)) {
        lead.followUps.forEach(fu => {
          const fuDate = new Date(fu.date);
          if (fu.status !== "Completed") {
            if (fuDate >= today && fuDate < tomorrow) {
              todayFollowups.push({ lead, followUp: fu });
            } else if (fuDate < today) {
              overdueFollowups.push({ lead, followUp: fu });
            } else if (fuDate > today) {
              upcomingFollowups.push({ lead, followUp: fu });
            }
          }
        });
      }
    });

    res.json({ todayFollowups, overdueFollowups, upcomingFollowups });
  } catch (error) {
    console.error("Error fetching dashboard follow-up summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - Fetch single lead by ID
// ========================
router.get("/:id", async (req, res) => {
  try {
    const lead = await User.findById(req.params.id).select("-password");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST - Create new lead
// ========================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      mobile2,
      contactPerson,
      email2,
      leadSource,
      status,
      expectedValue,
      notes,
      customerCategory,
      assignedTo,
      enteredBy,
      priority,
      address,
      city,
      state,
      country,
    } = req.body;

    // Validation
    if (!name || !email || !mobile) {
      return res.status(400).json({
        message: "name, email, and mobile are required",
      });
    }

    const newUser = new User({
      name,
      email,
      mobile,
      mobile2,
      contactPerson,
      email2,
      leadSource,
      status,
      expectedValue,
      notes,
      customerCategory,
      assignedTo,
      enteredBy,
      priority,
      address,
      city,
      state,
      country,
      type: "lead",
    });

    const savedLead = await newUser.save();
    const leadResponse = savedLead.toObject();

    res.status(201).json(leadResponse);
  } catch (error) {
    console.error("Error creating lead:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// PUT - Update lead
// ========================
router.put("/:id", async (req, res) => {
  try {
    const updatedLead = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE - Delete lead
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Lead deleted successfully", lead: deletedUser });
  } catch (error) {
    console.error("Error deleting lead:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});


// ========================
// POST - Add follow-up to a lead
// ========================
router.post("/:id/followups", async (req, res) => {
  try {
    const {
      date,
      note,
      status,
      followupType,
      followupAfterDays,
      priority,
      assignTo,
      enterBy,
      remarks,
    } = req.body;
    if (!note) {
      return res.status(400).json({ message: "note is required" });
    }
    const lead = await User.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    let followupDate = date ? new Date(date) : null;
    if (!followupDate && typeof followupAfterDays === "number") {
      const base = new Date();
      base.setDate(base.getDate() + followupAfterDays);
      followupDate = base;
    }
    if (!followupDate || Number.isNaN(followupDate.getTime())) {
      return res.status(400).json({ message: "valid date or followupAfterDays required" });
    }
    const followUp = {
      date: followupDate,
      note,
      status: status || "Scheduled",
      followupType: followupType || "Call",
      followupAfterDays: followupAfterDays || 0,
      priority: priority || "",
      assignTo: assignTo || "",
      enterBy: enterBy || "",
      remarks: remarks || "",
      createdAt: new Date(),
    };
    lead.followUps.push(followUp);
    await lead.save();
    res.status(201).json({ message: "Follow-up added", followUps: lead.followUps });
  } catch (error) {
    console.error("Error adding follow-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - List all follow-ups for a lead
// ========================
router.get("/:id/followups", async (req, res) => {
  try {
    const lead = await User.findById(req.params.id).select("followUps");
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead.followUps);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// PUT - Update a follow-up
// ========================
router.put("/:id/followups/:followupId", async (req, res) => {
  try {
    const lead = await User.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    const followUp = lead.followUps.id(req.params.followupId);
    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    const fields = [
      "date",
      "note",
      "followupType",
      "followupAfterDays",
      "priority",
      "status",
      "assignTo",
      "enterBy",
      "remarks",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        followUp[field] = req.body[field];
      }
    });

    await lead.save();
    res.json({ message: "Follow-up updated", followUp });
  } catch (error) {
    console.error("Error updating follow-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE - Remove a follow-up
// ========================
router.delete("/:id/followups/:followupId", async (req, res) => {
  try {
    const lead = await User.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    const followUp = lead.followUps.id(req.params.followupId);
    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }
    followUp.deleteOne();
    await lead.save();
    res.json({ message: "Follow-up deleted" });
  } catch (error) {
    console.error("Error deleting follow-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
