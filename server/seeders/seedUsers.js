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
      {
        name: "Jane Smith",
        email: "jane@example.com",
        mobile: "+1 555-123-7788",
        role: "Sales",
        department: "Sales",
        designation: "Sales Executive",
        dateOfBirth: "1992-08-22",
        gender: "Female",
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        status: "Active",
        profilePhoto: "jane_smith.jpg",
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        mobile: "+1 555-441-9090",
        role: "Manager",
        department: "Customer Success",
        designation: "CS Manager",
        dateOfBirth: "1988-12-10",
        gender: "Male",
        address: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        country: "USA",
        status: "Active",
        profilePhoto: "mike_johnson.jpg",
      },
      {
        name: "Sarah Williams",
        email: "sarah@example.com",
        mobile: "+1 555-009-1222",
        role: "Sales",
        department: "Sales",
        designation: "Sales Lead",
        dateOfBirth: "1995-03-18",
        gender: "Female",
        address: "321 Elm St",
        city: "Houston",
        state: "TX",
        country: "USA",
        status: "Active",
        profilePhoto: "sarah_williams.jpg",
      },
      {
        name: "Robert Brown",
        email: "robert@example.com",
        mobile: "+1 555-555-5555",
        role: "Support",
        department: "Support",
        designation: "Support Specialist",
        dateOfBirth: "1991-07-25",
        gender: "Male",
        address: "654 Maple Dr",
        city: "Phoenix",
        state: "AZ",
        country: "USA",
        status: "Active",
        profilePhoto: "robert_brown.jpg",
      },
    ];

    const insertSQL = `
      INSERT INTO users (
        name, email, mobile, role, department, designation, 
        dateOfBirth, gender, address, city, state, country, 
        status, profilePhoto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Insert each user
    for (const user of users) {
      try {
        await connection.query(insertSQL, [
          user.name,
          user.email,
          user.mobile,
          user.role,
          user.department,
          user.designation,
          user.dateOfBirth,
          user.gender,
          user.address,
          user.city,
          user.state,
          user.country,
          user.status,
          user.profilePhoto,
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

    console.log("✓ Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  } finally {
    connection.release();
  }
};

export default seedUsers;
