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
