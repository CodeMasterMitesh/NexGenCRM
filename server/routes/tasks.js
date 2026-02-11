import express from "express";
import Task from "../config/taskSchema.js";

const router = express.Router();

// ========================
// GET - Fetch all tasks
// ========================
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST - Create task
// ========================
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, createdBy } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "Pending",
      priority: priority || "",
      dueDate,
      assignedTo,
      createdBy,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// PUT - Update task
// ========================
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE - Remove task
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
