import express from "express";
import User from "../config/schema.js";
import Task from "../config/taskSchema.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const isAdmin = req.user?.role === "Admin";
    const userId = req.user?.sub;
    const userName = req.user?.name;
    const leadScope = isAdmin
      ? { type: { $in: ["lead", "Lead"] } }
      : {
          type: { $in: ["lead", "Lead"] },
          $or: [{ assignedTo: userId }, { assignedTo: userName }],
        };

    const totalCustomers = await User.countDocuments({
      ...leadScope,
      status: "Converted",
    });
    const activeLeads = await User.countDocuments({
      ...leadScope,
      status: { $nin: ["Converted", "Lost", "Inactive"] },
    });

    const salesAgg = await User.aggregate([
      { $match: { ...leadScope, status: "Converted" } },
      { $group: { _id: null, total: { $sum: "$expectedValue" } } },
    ]);
    const totalSales = salesAgg?.[0]?.total || 0;

    const taskScope = isAdmin
      ? {}
      : { $or: [{ assignedTo: userId }, { assignedTo: userName }] };
    const pendingTasks = await Task.countDocuments({
      ...taskScope,
      status: { $ne: "Completed" },
    });

    res.json({ totalCustomers, activeLeads, totalSales, pendingTasks });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
