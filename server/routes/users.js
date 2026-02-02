import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ========================
// GET - Fetch all users
// ========================
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query("SELECT * FROM users");
    connection.release();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - Fetch single user by ID
// ========================
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const connection = await pool.getConnection();
    const [users] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST - Create new user
// ========================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      role,
      department,
      designation,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      status,
      profilePhoto,
    } = req.body;

    // Validation
    if (!name || !email || !mobile) {
      return res.status(400).json({
        message: "name, email, and mobile are required",
      });
    }

    const connection = await pool.getConnection();
    const insertSQL = `
      INSERT INTO users (
        name, email, mobile, role, department, designation,
        dateOfBirth, gender, address, city, state, country,
        status, profilePhoto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(insertSQL, [
      name,
      email,
      mobile,
      role || "Sales",
      department || "",
      designation || "",
      dateOfBirth || null,
      gender || "",
      address || "",
      city || "",
      state || "",
      country || "",
      status || "Active",
      profilePhoto || "",
    ]);

    connection.release();

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      mobile,
      role: role || "Sales",
      department,
      status: status || "Active",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
