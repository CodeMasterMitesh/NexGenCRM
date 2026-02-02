# NexGenCRM Backend Setup Guide

## Overview
This guide explains how to set up the Express.js backend server for the NexGenCRM application. The backend provides REST APIs for managing users, leads, and other CRM data.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Installation & Setup](#installation--setup)
4. [Environment Variables](#environment-variables)
5. [Dependencies](#dependencies)
6. [Server Configuration](#server-configuration)
7. [API Routes](#api-routes)
8. [Running the Server](#running-the-server)
9. [Testing APIs](#testing-apis)

---

## Prerequisites

Before starting, ensure you have:
- **Node.js** installed (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (Node Package Manager) - comes with Node.js
- **Postman** or **Thunder Client** (optional, for API testing)
- **VS Code** or any code editor

---

## Project Structure

```
server/
├── index.js              # Main server entry point
├── package.json          # Project metadata & dependencies
├── .env.example          # Example environment variables
├── routes/
│   └── users.js          # User routes (GET, POST, etc.)
```

---

## Installation & Setup

### Step 1: Create Server Folder

```bash
mkdir server
cd server
```

### Step 2: Initialize npm Project

```bash
npm init -y
```

This creates a `package.json` file with default settings. The `-y` flag skips interactive setup.

### Step 3: Install Dependencies

```bash
npm install express cors
```

This installs:
- **express**: Web framework for building REST APIs
- **cors**: Middleware to handle Cross-Origin Resource Sharing (allows frontend to talk to backend)

Your `package.json` will now look like:
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
    "express": "^4.19.2"
  }
}
```

---

## Environment Variables

Environment variables store configuration settings like port numbers, database URLs, etc.

### Step 1: Create `.env.example` File

```bash
touch .env.example
```

**File: `.env.example`**
```
PORT=5000
```

This shows what environment variables are needed.

### Step 2: Create `.env` File (Optional for Development)

```bash
touch .env
```

**File: `.env`**
```
PORT=5000
```

> **Note**: In production, never commit `.env` to git. Add it to `.gitignore`.

---

## Dependencies Explained

### 1. **Express.js**
- Lightweight Node.js web framework
- Used to create HTTP servers and handle routes
- Makes building REST APIs simple and fast

```javascript
import express from "express";
const app = express();
```

### 2. **CORS (Cross-Origin Resource Sharing)**
- Allows requests from different domains
- Frontend (localhost:3000) can communicate with Backend (localhost:5000)
- Without CORS, browsers block cross-domain requests

```javascript
import cors from "cors";
app.use(cors());
```

### 3. **JSON Middleware**
- Parses incoming request bodies as JSON
- Allows the server to read POST request data

```javascript
app.use(express.json());
```

---

## Server Configuration

### File: `server/index.js`

```javascript
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// MIDDLEWARE
// ========================

// Enable CORS - allows frontend to make requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// ========================
// BASIC ROUTE
// ========================

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NexGenCRM API" });
});

// ========================
// API ROUTES
// ========================

// Mount user routes at /api/users
app.use("/api/users", usersRouter);

// ========================
// START SERVER
// ========================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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
