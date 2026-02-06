# NexGenCRM Backend Setup Guide (MongoDB Edition)

## Overview
This guide explains how to set up the Express.js backend server for the NexGenCRM application using **MongoDB** as the database. The backend provides REST APIs for managing users, leads, and other CRM data with a NoSQL database approach.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Dependencies](#dependencies)
7. [Database Configuration](#database-configuration)
8. [Schema Definition](#schema-definition)
9. [API Routes](#api-routes)
10. [Running the Server](#running-the-server)
11. [Testing APIs](#testing-apis)
12. [Database Seeding](#database-seeding)

---

## Prerequisites

Before starting, ensure you have:
- **Node.js** installed (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (Node Package Manager) - comes with Node.js
- **MongoDB Community Edition** installed - [Download](https://www.mongodb.com/try/download/community)
  - OR use **MongoDB Atlas** (Cloud) - [Free Tier](https://www.mongodb.com/cloud/atlas)
- **Postman** or **Thunder Client** (optional, for API testing)
- **MongoDB Compass** (optional, GUI for MongoDB)
- **VS Code** or any code editor

---

## Database Setup

### Option 1: Local MongoDB Installation

#### On Windows:
1. Download MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer (`.msi` file)
3. Choose "Install MongoDB as a Windows Service"
4. MongoDB will start automatically and run as a service
5. Default connection: `mongodb://localhost:27017`

#### On Mac:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### On Linux:
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Verify Installation:**
```bash
# Open MongoDB Shell
mongosh

# You should see: test>
# Type: exit
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Learning)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier)
4. Create a database user (username/password)
5. Whitelist your IP address (or Allow Access from Anywhere: 0.0.0.0/0)
6. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/nexgencrm`
7. Replace `username`, `password`, and cluster name in your `.env`

---

## Project Structure

```
server/
├── index.js                 # Main server entry point
├── package.json             # Project metadata & dependencies
├── .env.example             # Example environment variables
├── config/
│   ├── db.js                # MongoDB connection setup
│   └── schema.js            # Mongoose schema definitions
├── routes/
│   └── users.js             # User API routes (MongoDB queries)
├── seeders/
│   └── seedUsers.js         # Sample data for database
└── BACKEND_SETUP.md         # This file
```

---

## Installation & Setup

### Step 1: Create Server Folder (if not done)

```bash
mkdir server
cd server
```

### Step 2: Initialize npm Project

```bash
npm init -y
```

### Step 3: Install Dependencies

```bash
npm install express cors mongoose
```

This installs:
- **express** (v4.19.2): Web framework for building REST APIs
- **cors** (v2.8.5): Handle cross-origin requests (frontend ↔ backend)
- **mongoose** (v8.x): MongoDB object modeling and validation

Your `package.json` dependencies should look like:
```json
{
  "name": "nexgencrm-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "dev": "node index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "mongoose": "^8.x.x"
  }
}
```

---

## Environment Variables

### Create `.env.example` File

```
PORT=5500
MONGODB_URI=mongodb://localhost:27017/nexgencrm
NODE_ENV=development
```

### Create `.env` File (for development)

```
PORT=5500
MONGODB_URI=mongodb://localhost:27017/nexgencrm
NODE_ENV=development
```

> **For MongoDB Atlas**, use:
> ```
> MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexgencrm
> ```

---

## Dependencies Explained

### 1. **Express.js**
- Lightweight Node.js web framework
- Handles HTTP requests and routes
- Middleware for JSON parsing and error handling

### 2. **CORS (Cross-Origin Resource Sharing)**
- Allows frontend (localhost:3000) to communicate with backend (localhost:5500)
- Without CORS, browsers block cross-domain requests

### 3. **Mongoose**
- MongoDB object modeling library
- Provides schema validation and type casting
- Simplifies database operations with methods like `find()`, `create()`, `updateMany()`
- Auto-generates `_id` field (MongoDB ObjectId - 24-char hex string)

**Why Mongoose vs Raw MongoDB?**
| Feature | Raw MongoDB | Mongoose |
|---------|------------|----------|
| Schema | Flexible | Strict with validation |
| Data Types | Any | Enforced types |
| Queries | Native | Simplified methods |
| Middleware | None | Pre/post hooks |
| Timestamps | Manual | Auto-generated |

---

## Database Configuration

### File: `config/db.js`

```javascript
import mongoose from "mongoose";

// ========================
// MONGODB CONNECTION
// ========================

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/nexgencrm";
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      // Connection options for better stability
    });

    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Stop server if database connection fails
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB error:", error);
});

export default connectDB;
```

**How It Works:**
- `mongoose.connect()`: Establishes connection to MongoDB
- If connection fails, server exits with `process.exit(1)`
- Connection events trigger console messages for debugging

---

## Schema Definition

### File: `config/schema.js`

```javascript
import mongoose from "mongoose";

// ========================
// USER SCHEMA
// ========================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Sales", "Marketing", "Operations", "Manager", "Admin"],
      default: "Sales",
    },
    department: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Auto-adds createdAt and updatedAt fields
  }
);

// Create model from schema
const User = mongoose.model("User", userSchema);

export default User;
```

**Schema Field Options:**
- `type`: Data type (String, Number, Date, Boolean, etc.)
- `required`: Field must have a value
- `unique`: No duplicate values allowed (MongoDB creates an index)
- `default`: Default value if not provided
- `enum`: Allowed values (dropdown options)
- `trim`: Remove whitespace from strings
- `lowercase`: Convert strings to lowercase
- `match`: Regex validation (email pattern)

**Timestamps:**
- `createdAt`: Auto-set when document is created
- `updatedAt`: Auto-updated whenever document changes

---

## API Routes

### File: `routes/users.js`

```javascript
import express from "express";
import User from "../config/schema.js";

const router = express.Router();

// ========================
// GET - Fetch all users
// ========================
/**
 * Route: GET /api/users
 * Description: Retrieve all users from MongoDB
 * Query Params: None
 * Response: Array of user objects
 * Status Code: 200 (Success), 500 (Server Error)
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// GET - Fetch single user by ID
// ========================
/**
 * Route: GET /api/users/:id
 * Description: Retrieve a specific user by MongoDB ObjectId
 * Parameters:
 *   - id: MongoDB ObjectId (24-char hex string)
 * Response: User object or error message
 * Status Code: 200 (Success), 400 (Invalid ID), 404 (Not Found), 500 (Server Error)
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    // CastError: Invalid MongoDB ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// POST - Create new user
// ========================
/**
 * Route: POST /api/users
 * Description: Create a new user in MongoDB
 * Request Body:
 *   {
 *     "name": "string (required)",
 *     "email": "string (required, unique)",
 *     "mobile": "string (required)",
 *     "role": "string (optional, default: 'Sales')",
 *     "department": "string (optional)",
 *     "designation": "string (optional)",
 *     "dateOfBirth": "ISO Date string (optional)",
 *     "gender": "string (optional)",
 *     "address": "string (optional)",
 *     "city": "string (optional)",
 *     "state": "string (optional)",
 *     "country": "string (optional)",
 *     "status": "string (optional, default: 'Active')",
 *     "profilePhoto": "string (optional)"
 *   }
 * Response: Created user object with MongoDB _id
 * Status Code: 201 (Created), 400 (Validation Error), 500 (Server Error)
 */
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

    // Validation: Check required fields
    if (!name || !email || !mobile) {
      return res.status(400).json({
        message: "name, email, and mobile are required",
      });
    }

    // Create new user document
    const newUser = new User({
      name,
      email,
      mobile,
      role: role || "Sales",
      department,
      designation,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      status: status || "Active",
      profilePhoto,
    });

    // Save to MongoDB and get response with auto-generated _id
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    // E11000: Duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// PUT - Update user
// ========================
/**
 * Route: PUT /api/users/:id
 * Description: Update an existing user
 * Parameters:
 *   - id: MongoDB ObjectId
 * Request Body: Fields to update (partial update allowed)
 * Response: Updated user object
 * Status Code: 200 (Success), 400 (Invalid ID), 404 (Not Found), 500 (Server Error)
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: return updated doc, runValidators: apply schema validation
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================
// DELETE - Delete user
// ========================
/**
 * Route: DELETE /api/users/:id
 * Description: Delete a user from MongoDB
 * Parameters:
 *   - id: MongoDB ObjectId
 * Response: Success message and deleted user data
 * Status Code: 200 (Success), 400 (Invalid ID), 404 (Not Found), 500 (Server Error)
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
```

**Mongoose Methods Used:**
| Method | Purpose | Returns |
|--------|---------|---------|
| `User.find()` | Get all documents | Promise<Array> |
| `User.findById(id)` | Get document by _id | Promise<Object\|null> |
| `User.create(data)` | Create and save document | Promise<Object> |
| `newUser.save()` | Save new document instance | Promise<Object> |
| `User.findByIdAndUpdate()` | Update and return document | Promise<Object\|null> |
| `User.findByIdAndDelete()` | Delete and return document | Promise<Object\|null> |

**Error Codes:**
- `CastError`: Invalid ObjectId format (not 24-char hex string)
- `E11000`: Duplicate key error (unique field already exists)
- `ValidationError`: Schema validation failed

---

## Server Configuration

### File: `server/index.js`

```javascript
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import seedUsers from "./seeders/seedUsers.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 5500;

// ========================
// MIDDLEWARE
// ========================
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// ========================
// BASIC ROUTE
// ========================
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NexGenCRM API" });
});

// ========================
// API ROUTES
// ========================
app.use("/api/users", usersRouter);

// ========================
// DATABASE & SERVER STARTUP
// ========================
const startServer = async () => {
  try {
    console.log("\n🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✓ MongoDB connected!\n");

    console.log("🌱 Seeding database with sample data...");
    await seedUsers();
    console.log("✓ Database seeded!\n");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 API: http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
```

---

## Database Seeding

### File: `seeders/seedUsers.js`

```javascript
import User from "../config/schema.js";

const seedUsers = async () => {
  try {
    // Clear existing users (optional - remove for production)
    await User.deleteMany({});

    // Sample users data
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        mobile: "+1 555-888-3322",
        role: "Admin",
        department: "Operations",
        designation: "Operations Manager",
        gender: "Male",
        city: "New York",
        state: "NY",
        country: "USA",
        status: "Active",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        mobile: "+1 555-123-7788",
        role: "Sales",
        department: "Sales",
        designation: "Sales Executive",
        gender: "Female",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        status: "Active",
      },
      {
        name: "Robert Johnson",
        email: "robert@example.com",
        mobile: "+1 555-456-1234",
        role: "Marketing",
        department: "Marketing",
        designation: "Marketing Manager",
        gender: "Male",
        city: "Chicago",
        state: "IL",
        country: "USA",
        status: "Active",
      },
      {
        name: "Emily Brown",
        email: "emily@example.com",
        mobile: "+1 555-789-5678",
        role: "Sales",
        department: "Sales",
        designation: "Sales Representative",
        gender: "Female",
        city: "Houston",
        state: "TX",
        country: "USA",
        status: "Active",
      },
      {
        name: "Michael Davis",
        email: "michael@example.com",
        mobile: "+1 555-321-9876",
        role: "Operations",
        department: "Operations",
        designation: "Operations Specialist",
        gender: "Male",
        city: "Phoenix",
        state: "AZ",
        country: "USA",
        status: "Inactive",
      },
    ];

    // Insert all users
    const createdUsers = await User.insertMany(users);
    console.log(`✓ Inserted ${createdUsers.length} sample users`);

    return createdUsers;
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export default seedUsers;
```

### Explanation of Each Part:

1. **Imports**
   - `express`: Web framework
   - `cors`: Handle cross-origin requests
   - `usersRouter`: User API routes

2. **Middleware**
   - `app.use(cors())`: Enable CORS for all routes
   - `app.use(express.json())`: Parse JSON bodies

3. **Routes**
   - `GET /`: Health check endpoint
   - `GET/POST /api/users`: User management routes

4. **Server Start**
   - `app.listen(PORT)`: Start server on specified port

---

## API Routes

### File: `server/routes/users.js`

```javascript
import { Router } from "express";

const router = Router();

// In-memory database (for demonstration)
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

// ========================
// 1. GET - Fetch all users
// ========================
/**
 * Route: GET /api/users
 * Description: Retrieve all users from the database
 * Response: Array of user objects
 * Status Code: 200 (Success)
 */
router.get("/", (req, res) => {
  res.json(users);
});

// ========================
// 2. GET - Fetch single user by ID
// ========================
/**
 * Route: GET /api/users/:id
 * Description: Retrieve a specific user by ID
 * Parameters:
 *   - id (path parameter): User ID
 * Response: User object or error message
 * Status Code: 200 (Success), 404 (Not Found)
 */
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  return res.json(user);
});

// ========================
// 3. POST - Create new user
// ========================
/**
 * Route: POST /api/users
 * Description: Create a new user
 * Request Body:
 *   {
 *     "name": "string (required)",
 *     "email": "string (required)",
 *     "mobile": "string (required)",
 *     "role": "string (optional, default: 'Sales')",
 *     "department": "string (optional)",
 *     "status": "string (optional, default: 'Active')"
 *   }
 * Response: Created user object with ID
 * Status Code: 201 (Created), 400 (Bad Request)
 */
router.post("/", (req, res) => {
  const { name, email, mobile, role, department, status } = req.body;

  // Validation: Check required fields
  if (!name || !email || !mobile) {
    return res.status(400).json({ 
      message: "name, email, and mobile are required" 
    });
  }

  // Create new user object
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    mobile,
    role: role || "Sales",
    department: department || "",
    status: status || "Active"
  };

  // Add to database
  users.push(newUser);
  
  // Return created user with 201 status
  return res.status(201).json(newUser);
});

export default router;
```

### API Endpoints Summary

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/api/users` | Get all users | 200 |
| GET | `/api/users/:id` | Get user by ID | 200, 404 |
| POST | `/api/users` | Create new user | 201, 400 |

---

## Running the Server

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Start the Server
```bash
node index.js
```

Or using npm script:
```bash
npm start
```

### Expected Output
```
Server running on port 5000
```

The server is now running and listening on `http://localhost:5000`

---

## Testing APIs

### Option 1: Using Postman

#### 1. **Test GET All Users**
- Method: `GET`
- URL: `http://localhost:5000/api/users`
- Click "Send"
- Response: Array of users

#### 2. **Test GET Single User**
- Method: `GET`
- URL: `http://localhost:5000/api/users/1`
- Click "Send"
- Response: User object with ID 1

#### 3. **Test POST Create User**
- Method: `POST`
- URL: `http://localhost:5000/api/users`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "mobile": "+1 555-777-2222",
  "role": "Manager",
  "department": "Sales"
}
```
- Click "Send"
- Response: Created user object with new ID

### Option 2: Using cURL (Command Line)

```bash
# Get all users
curl http://localhost:5000/api/users

# Get user by ID
curl http://localhost:5000/api/users/1

# Create new user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Smith","email":"bob@example.com","mobile":"+1 555-666-3333"}'
```

### Option 3: Using Browser

Simply visit these URLs in your browser:
- http://localhost:5000/api/users (View all users)
- http://localhost:5000/api/users/1 (View user 1)

---

## How Frontend Connects to Backend

In the React frontend (`AddUser.jsx`):

```javascript
const API_BASE_URL = "http://localhost:5000";

// Fetch users
const response = await fetch(`${API_BASE_URL}/api/users`);
const users = await response.json();

// Create new user
const response = await fetch(`${API_BASE_URL}/api/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData)
});
```

---

## Common Issues & Solutions

### Issue 1: Port Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Kill process on port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Issue 2: CORS Error in Frontend
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Ensure `app.use(cors())` is in `index.js` before routes.

### Issue 3: Module Not Found
**Error**: `Cannot find package 'express'`

**Solution**:
```bash
npm install express cors
```

### Issue 4: Invalid JSON in POST Request
**Error**: `400 Bad Request`

**Solution**: Ensure request body is valid JSON and `Content-Type: application/json` header is set.

---

## Next Steps

1. **Add Database**: Replace in-memory array with MongoDB, MySQL, or PostgreSQL
2. **Add Authentication**: Implement JWT tokens for secure API access
3. **Add Validation**: Use libraries like `joi` or `express-validator`
4. **Add Error Handling**: Implement comprehensive error handling middleware
5. **Add Logging**: Use `morgan` or `winston` for request logging
6. **Add Leads API**: Create `/api/leads` routes similar to users
7. **Add Customers API**: Create `/api/customers` routes
8. **Deploy**: Deploy backend to Heroku, Railway, or AWS

---

## Quick Reference

### File Structure
```
server/
├── index.js          (Main server file)
├── package.json      (Dependencies)
├── .env              (Environment variables)
├── .env.example      (Example .env)
└── routes/
    └── users.js      (User API routes)
```

### Key Concepts
- **REST API**: Representational State Transfer - standard for web APIs
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Server Error)
- **Middleware**: Functions that process requests before reaching route handlers
- **CORS**: Allows frontend and backend on different domains to communicate

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Created**: February 2, 2026  
**Version**: 1.0  
**For**: NexGenCRM Backend Setup
