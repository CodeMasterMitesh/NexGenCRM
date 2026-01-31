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
        mobile: "",
        role: "Sales",
        department: "",
        designation: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        country: "",
        status: "Active",
        profilePhoto: null,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5000";

    // Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError("");

            const payload = {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                role: formData.role,
                department: formData.department,
                status: formData.status,
            };

            const response = await fetch(`${API_BASE_URL}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to add user");
            }

            alert("User added successfully!");
            navigate("/users");
        } catch (err) {
            setError(err.message || "Unable to add user");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-user-page container-fluid py-4">
            <div className="form-header">
                <h1 className="mb-1">Add New User</h1>
                <p className="text-muted">Create a new user account</p>
            </div>

            <div className="form-container card border-0 shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="user-form">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <div className="row g-4">
                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter user full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    className="form-control"
                                    placeholder="Enter mobile number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="role" className="form-label">User Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    className="form-select"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Support">Support</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="department" className="form-label">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    className="form-control"
                                    placeholder="Enter department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="designation" className="form-label">Designation</label>
                                <input
                                    type="text"
                                    id="designation"
                                    name="designation"
                                    className="form-control"
                                    placeholder="Enter designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    className="form-control"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="form-select"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="form-control"
                                    placeholder="Enter street address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="city" className="form-label">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="form-control"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="state" className="form-label">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    className="form-control"
                                    placeholder="Enter state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="country" className="form-label">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    className="form-control"
                                    placeholder="Enter country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="profilePhoto" className="form-label">Profile Photo</label>
                                <input
                                    type="file"
                                    id="profilePhoto"
                                    name="profilePhoto"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                            <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                                {submitting ? "Saving..." : "Add User"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={() => navigate("/users")}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
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