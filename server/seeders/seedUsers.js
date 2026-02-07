import bcrypt from "bcryptjs";
import User from "../config/schema.js";

const seedUsers = async () => {
  try {
    console.log("Seeding users data...");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const users = [
      {
        name: "Mitesh Prajapati",
        email: "mitesh@nexgencrm.com",
        mobile: "+1 555-888-3322",
        password: bcrypt.hashSync("Admin@123", 10),
        role: "Admin",
        department: "Operations",
        designation: "Operations Manager",
        dateOfBirth: new Date("1990-05-15"),
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
        password: hashedPassword,
        role: "Sales",
        department: "Sales",
        designation: "Sales Executive",
        dateOfBirth: new Date("1992-08-22"),
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
        password: hashedPassword,
        role: "Manager",
        department: "Customer Success",
        designation: "CS Manager",
        dateOfBirth: new Date("1988-12-10"),
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
        password: hashedPassword,
        role: "Sales",
        department: "Sales",
        designation: "Sales Lead",
        dateOfBirth: new Date("1995-03-18"),
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
        password: hashedPassword,
        role: "Operations",
        department: "Operations",
        designation: "Operations Specialist",
        dateOfBirth: new Date("1991-07-25"),
        gender: "Male",
        address: "654 Maple Dr",
        city: "Phoenix",
        state: "AZ",
        country: "USA",
        status: "Active",
        profilePhoto: "robert_brown.jpg",
      },
    ];

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Insert new users
    const result = await User.insertMany(users);
    console.log(`✓ Inserted ${result.length} users successfully!`);
  } catch (error) {
    console.error("Error seeding users:", error.message);
    throw error;
  }
};

export default seedUsers;
