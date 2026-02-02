import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5555;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Demo Server for NexGenCRM" });
});

// Mock endpoint to get users
app.get("/getusers", (req, res) => {
  res.json({ status: "ok", data: [
    {id: 1,name: "John Doe",email: "john.doe@example.com"} ,
    {id: 2,name: "Jane Smith",email: "jane.smith@example.com"}, 
    {id:3,name: "Alice Johnson",email: "alice.johnson@example.com"}
  ] });
});

app.listen(PORT, () => {
  console.log(`🚀 Demo server running on http://localhost:${PORT}`);
});