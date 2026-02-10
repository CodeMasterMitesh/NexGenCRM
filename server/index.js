import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import leadsRouter from "./routes/leads.js";
import authRouter from "./routes/auth.js";
import connectDB from "./config/db.js";
import seedUsers from "./seeders/seedUsers.js";
import auth from "./middleware/auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NexGenCRM API" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", auth, usersRouter);
app.use("/api/leads", auth, leadsRouter);

// Initialize database and start server
const startServer = async () => {
  try {
    console.log("\n🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✓ MongoDB connected!\n");

    // console.log("🌱 Seeding database with sample data...");
    // await seedUsers();
    // console.log("✓ Database seeded!\n");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 API: http://localhost:${PORT}/api/users`);
      console.log(`📝 API: http://localhost:${PORT}/api/leads`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
