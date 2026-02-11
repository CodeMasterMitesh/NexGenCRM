import express from "express";
import User from "../config/schema.js";
import Task from "../config/taskSchema.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ type: "Lead", status: "Converted" });
    const activeLeads = await User.countDocuments({
      type: "Lead",
      status: { $nin: ["Converted", "Lost", "Inactive"] },
    });

    const salesAgg = await User.aggregate([
      { $match: { type: "Lead", status: "Converted" } },
      { $group: { _id: null, total: { $sum: "$expectedValue" } } },
    ]);
    const totalSales = salesAgg?.[0]?.total || 0;

    const pendingTasks = await Task.countDocuments({ status: { $ne: "Completed" } });

    res.json({ totalCustomers, activeLeads, totalSales, pendingTasks });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
