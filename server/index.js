import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import createTables from "./config/schema.js";
import seedUsers from "./seeders/seedUsers.js";

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NexGenCRM API" });
});

app.use("/api/users", usersRouter);

// Initialize database on startup
const initializeDatabase = async () => {
  try {
    console.log("\n🔄 Initializing database...");
    await createTables();
    await seedUsers();
    console.log("✓ Database initialized!\n");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

// Call initialization before starting server
// await initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api/users`);
});
