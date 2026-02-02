# MySQL Database Setup Guide for NexGenCRM

## Overview
This guide explains how to set up MySQL database for the NexGenCRM backend, create database tables, seed sample data, and fetch data from the database.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MySQL Installation](#mysql-installation)
3. [Creating Database](#creating-database)
4. [Project Structure](#project-structure)
5. [Database Configuration](#database-configuration)
6. [Database Schema](#database-schema)
7. [Seeder File](#seeder-file)
8. [Updated User Routes](#updated-user-routes)
9. [Running the Server](#running-the-server)
10. [Verifying Data](#verifying-data)

---

## Prerequisites

Before starting, ensure you have:
- **MySQL Server** installed (v5.7 or higher)
- **MySQL Workbench** (optional, for GUI management)
- **Node.js** with mysql2 package installed
- **Postman** or **Thunder Client** for API testing

---

## MySQL Installation

### Windows
1. Download MySQL Community Server from [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. Run the installer and follow setup wizard
3. Choose "Developer Default" installation type
4. Complete configuration with default settings
5. Set root password (remember this!)
6. Start MySQL service

### Mac
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### Linux (Ubuntu)
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
sudo service mysql start
```

---

## Creating Database

### Step 1: Connect to MySQL

**Windows/Mac/Linux:**
```bash
mysql -u root -p
```

Enter your root password when prompted.

### Step 2: Create Database

```sql
CREATE DATABASE nexgencrm;
```

### Step 3: Verify Database

```sql
SHOW DATABASES;
```

You should see `nexgencrm` in the list.

### Step 4: Exit MySQL

```sql
EXIT;
```

---

## Project Structure

```
server/
├── index.js                 # Main server (updated to use DB)
├── package.json             # Dependencies
├── config/
│   ├── db.js               # Database connection pool
│   └── schema.js           # Create tables
├── routes/
│   └── users.js            # User routes (updated for MySQL)
├── seeders/
│   └── seedUsers.js        # Seed sample data
└── BACKEND_SETUP.md        # Initial backend guide
```

---

## Database Configuration

### File: `server/config/db.js`

This file sets up the MySQL connection pool.

```javascript
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",        // MySQL server address
  user: "root",            // MySQL username
  password: "",            // MySQL password (empty if none set)
  database: "nexgencrm",   // Database name
  waitForConnections: true,
  connectionLimit: 10,     // Max 10 simultaneous connections
  queueLimit: 0,           // Unlimited queue
});

export default pool;
```

### Configuration Explanation

- **host**: Where MySQL server is running (localhost = your computer)
- **user**: MySQL username (default is "root")
- **password**: MySQL password (leave empty if not set)
- **database**: Database name to use
- **connectionLimit**: Maximum concurrent connections
- **waitForConnections**: Wait if no connection available

### To Change Credentials

If your MySQL has a different password:

```javascript
password: "your_mysql_password",  // Your password here
```

---

## Database Schema

### File: `server/config/schema.js`

This file creates the `users` table in the database.

```javascript
import pool from "../config/db.js";

const createTables = async () => {
  const connection = await pool.getConnection();

  try {
    console.log("Creating users table...");

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        role VARCHAR(50) DEFAULT 'Sales',
        department VARCHAR(50),
        designation VARCHAR(50),
        dateOfBirth DATE,
        gender VARCHAR(20),
        address VARCHAR(255),
        city VARCHAR(50),
        state VARCHAR(50),
        country VARCHAR(50),
        status VARCHAR(20) DEFAULT 'Active',
        profilePhoto VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    await connection.query(createTableSQL);
    console.log("✓ Users table created successfully!");
  } catch (error) {
    console.error("Error creating table:", error.message);
  } finally {
    connection.release();
  }
};

export default createTables;
```

### Table Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| id | INT | Auto-incrementing unique user ID |
| name | VARCHAR(100) | User's full name |
| email | VARCHAR(100) | Unique email address |
| mobile | VARCHAR(20) | Phone number |
| role | VARCHAR(50) | User role (Admin, Sales, Manager, Support) |
| department | VARCHAR(50) | Department name |
| designation | VARCHAR(50) | Job title |
| dateOfBirth | DATE | Birth date (YYYY-MM-DD format) |
| gender | VARCHAR(20) | Male/Female/Non-binary |
| address | VARCHAR(255) | Street address |
| city | VARCHAR(50) | City name |
| state | VARCHAR(50) | State/Province |
| country | VARCHAR(50) | Country name |
| status | VARCHAR(20) | Active/Inactive |
| profilePhoto | VARCHAR(255) | Photo file name |
| created_at | TIMESTAMP | When record was created |
| updated_at | TIMESTAMP | When record was last updated |

---

## Seeder File

### File: `server/seeders/seedUsers.js`

This file inserts sample user data into the database.

```javascript
import pool from "../config/db.js";

const seedUsers = async () => {
  const connection = await pool.getConnection();

  try {
    console.log("Seeding users data...");

    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        mobile: "+1 555-888-3322",
        role: "Admin",
        department: "Operations",
        designation: "Operations Manager",
        dateOfBirth: "1990-05-15",
        gender: "Male",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        country: "USA",
        status: "Active",
        profilePhoto: "john_doe.jpg",
      },
      // ... more users
    ];

    const insertSQL = `
      INSERT INTO users (
        name, email, mobile, role, department, designation,
        dateOfBirth, gender, address, city, state, country,
        status, profilePhoto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const user of users) {
      try {
        await connection.query(insertSQL, [
          user.name,
          user.email,
          user.mobile,
          // ... rest of fields
        ]);
        console.log(`✓ Inserted user: ${user.name}`);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(`⚠ User already exists: ${user.email}`);
        } else {
          throw error;
        }
      }
    }

    console.log("✓ Seeding completed!");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    connection.release();
  }
};

export default seedUsers;
```

### How Seeder Works

1. **Defines Sample Data**: Array of user objects with all fields
2. **Prepares SQL Query**: `INSERT INTO users ... VALUES (...)`
3. **Loops Through Users**: Inserts each user one by one
4. **Handles Duplicates**: If email exists, skips with warning
5. **Releases Connection**: Always frees up database connection

### Adding More Sample Data

Edit `seeders/seedUsers.js` and add more users to the array:

```javascript
const users = [
  { name: "John Doe", email: "john@example.com", ... },
  { name: "Jane Smith", email: "jane@example.com", ... },
  { name: "YOUR NAME", email: "your@example.com", ... }, // Add here
];
```

---

## Updated User Routes

### File: `server/routes/users.js`

Routes now fetch from MySQL database instead of memory.

```javascript
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
      // ... other fields
    } = req.body;

    // Validation
    if (!name || !email || !mobile) {
      return res.status(400).json({
        message: "name, email, and mobile are required",
      });
    }

    const connection = await pool.getConnection();
    const insertSQL = `
      INSERT INTO users (name, email, mobile, role, department, ...)
      VALUES (?, ?, ?, ?, ?, ...)
    `;

    const [result] = await connection.query(insertSQL, [
      name,
      email,
      mobile,
      role || "Sales",
      // ... other fields
    ]);

    connection.release();

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      mobile,
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
```

### Key Changes from Memory to Database

| Aspect | Memory | Database |
|--------|--------|----------|
| Storage | JavaScript array | MySQL table |
| Persistence | Lost on restart | Permanent storage |
| Speed | Faster for small data | Slower but scalable |
| Concurrent Users | Limited | Supports many users |
| Query | `.find()` | SQL queries |

---

## Updated Server Entry Point

### File: `server/index.js`

```javascript
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import createTables from "./config/schema.js";
import seedUsers from "./seeders/seedUsers.js";

const app = express();
const PORT = process.env.PORT || 5000;

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
    await createTables();      // Create tables if not exist
    await seedUsers();          // Seed sample data
    console.log("✓ Database initialized!\n");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

// Call initialization before starting server
await initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api/users`);
});
```

### Startup Process

1. **Connect to MySQL**: Uses pool from `db.js`
2. **Create Tables**: Runs `createTables()` - creates table if missing
3. **Seed Data**: Runs `seedUsers()` - inserts sample data
4. **Start Server**: Listens on port 5000
5. **Ready for Requests**: Frontend can now fetch data

---

## Running the Server

### Step 1: Verify MySQL is Running

**Windows:**
```bash
Services app → Search "MySQL" → Check if running
```

**Mac/Linux:**
```bash
sudo service mysql status
```

### Step 2: Navigate to Server

```bash
cd server
```

### Step 3: Install MySQL Package (if not done)

```bash
npm install mysql2
```

### Step 4: Start Server

```bash
node index.js
```

### Expected Output

```
🔄 Initializing database...
Creating users table...
✓ Users table created successfully!
Seeding users data...
✓ Inserted user: John Doe
✓ Inserted user: Jane Smith
✓ Inserted user: Mike Johnson
✓ Inserted user: Sarah Williams
✓ Inserted user: Robert Brown
✓ Seeding completed!
✓ Database initialized!

🚀 Server running on http://localhost:5000
📝 API: http://localhost:5000/api/users
```

---

## Verifying Data

### Option 1: Using MySQL Command Line

```bash
mysql -u root -p
```

```sql
USE nexgencrm;
SELECT * FROM users;
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to localhost
3. Select `nexgencrm` database
4. Open `users` table
5. View all data

### Option 3: Using API (Postman)

**GET all users:**
- Method: GET
- URL: http://localhost:5000/api/users
- Click Send

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+1 555-888-3322",
    "role": "Admin",
    "department": "Operations",
    "status": "Active",
    ...
  },
  ...
]
```

---

## How Frontend Fetches Data

The frontend React code automatically fetches from the database:

```javascript
// Users.jsx
useEffect(() => {
  const fetchUsers = async () => {
    const response = await fetch("http://localhost:5000/api/users");
    const data = await response.json();
    setUsers(data);  // Now data comes from MySQL!
  };
  fetchUsers();
}, []);
```

---

## Common Issues & Solutions

### Issue 1: "Cannot find module 'mysql2'"
**Solution:**
```bash
npm install mysql2
```

### Issue 2: "Access denied for user 'root'@'localhost'"
**Solution**: Check MySQL credentials in `config/db.js`
```javascript
user: "root",
password: "your_password",  // Add correct password here
```

### Issue 3: "Unknown database 'nexgencrm'"
**Solution**: Create database first
```sql
CREATE DATABASE nexgencrm;
```

### Issue 4: "Duplicate entry for key 'email'"
**Solution**: Email already exists. Either:
- Delete user from database: `DELETE FROM users WHERE email='...';`
- Use different email
- Clear and reseed: `TRUNCATE TABLE users;`

### Issue 5: Server starts but frontend shows no data
**Solution**: Check if:
1. Backend running on port 5000
2. Frontend has correct API_BASE_URL
3. CORS is enabled in `index.js`
4. No firewall blocking connections

---

## Database Backup & Restore

### Backup Database
```bash
mysqldump -u root -p nexgencrm > backup.sql
```

### Restore Database
```bash
mysql -u root -p nexgencrm < backup.sql
```

---

## Next Steps

1. **Add Edit/Delete**: Implement PUT and DELETE routes
2. **Add Validation**: Use joi or express-validator
3. **Add Leads Table**: Create similar setup for leads
4. **Add Authentication**: Implement JWT login
5. **Add Error Logging**: Use winston for logs
6. **Deploy**: Move from localhost to production server

---

## Summary

| Component | Purpose | File |
|-----------|---------|------|
| Connection | MySQL pool setup | `config/db.js` |
| Schema | Create users table | `config/schema.js` |
| Seeder | Insert sample data | `seeders/seedUsers.js` |
| Routes | API endpoints | `routes/users.js` |
| Server | Start server & init DB | `index.js` |

---

## Quick Reference Commands

```bash
# Start server
node index.js

# Install mysql2
npm install mysql2

# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use database
USE nexgencrm;

# Show tables
SHOW TABLES;

# View all users
SELECT * FROM users;

# View table structure
DESCRIBE users;

# Backup database
mysqldump -u root -p nexgencrm > backup.sql
```

---

**Created**: February 2, 2026  
**Version**: 1.0  
**For**: NexGenCRM MySQL Database Setup
