import { Router } from "express";

const router = Router();

let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    mobile: "+1 555-888-3322",
    role: "Admin",
    department: "Operations",
    status: "Active"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    mobile: "+1 555-123-7788",
    role: "Sales",
    department: "Sales",
    status: "Active"
  }
];

router.get("/", (req, res) => {
  res.json(users);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json(user);
});

router.post("/", (req, res) => {
  const { name, email, mobile, role, department, status } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({ message: "name, email, and mobile are required" });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    mobile,
    role: role || "Sales",
    department: department || "",
    status: status || "Active"
  };

  users.push(newUser);
  return res.status(201).json(newUser);
});

export default router;
