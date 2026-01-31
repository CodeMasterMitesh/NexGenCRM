import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NexGenCRM API" });
});

app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
