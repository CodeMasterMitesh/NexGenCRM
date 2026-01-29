import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";

// Add User page - simple form to add new users
const AddUser = () => {
    const navigate = useNavigate();

    // State for form fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Sales",
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New user data:", formData);
        // Here you would typically send data to a backend/database
        alert("User added successfully!");
        navigate("/users"); // Go back to users list
    };

    return (
        <div className="add-user-page">
            {/* Page header */}
            <div className="form-header">
                <h1>Add New User</h1>
                <p>Create a new user account</p>
            </div>

            {/* Form container */}
            <div className="form-container">
                <form onSubmit={handleSubmit} className="user-form">
                    {/* Name field */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter user full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email field */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Role field */}
                    <div className="form-group">
                        <label htmlFor="role">User Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales">Sales</option>
                            <option value="Support">Support</option>
                        </select>
                    </div>

                    {/* Button group */}
                    <div className="form-buttons">
                        <button type="submit" className="btn btn-submit">
                            Add User
                        </button>
                        <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={() => navigate("/users")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
// Employee Name
// Email
// Employee
// Phone
// Profile Photo
// No file chosen
// Birthdate
// dd-mm-yyyy
// Gender
// -- Select --
// Marital Status
// -- Select --
// Joining Date
// dd-mm-yyyy
// Resign Date
// dd-mm-yyyy
// Address
// Street address
// Area
// City
// Pincode
// State
// Country
// Aadhar Card (Attachment)No file chosen
// PAN Card (Attachment)No file chosen
// Passport (Attachment)