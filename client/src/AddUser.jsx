import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddUser.css";

// Add/Edit User page - handles both creating and editing users
const AddUser = () => {
    const navigate = useNavigate();
    const { id: userId } = useParams();
    const isEditMode = !!userId;

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
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";

    // Load user data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
                    if (!response.ok) {
                        throw new Error("Failed to load user");
                    }
                    const user = await response.json();
                    setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        mobile: user.mobile || "",
                        role: user.role || "Sales",
                        department: user.department || "",
                        designation: user.designation || "",
                        dateOfBirth: user.dateOfBirth?.split('T')[0] || "",
                        gender: user.gender || "",
                        address: user.address || "",
                        city: user.city || "",
                        state: user.state || "",
                        country: user.country || "",
                        status: user.status || "Active",
                        profilePhoto: null,
                    });
                    setError("");
                } catch (err) {
                    setError(err.message || "Failed to load user");
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [isEditMode, userId]);

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
                designation: formData.designation,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                status: formData.status,
            };

            const method = isEditMode ? "PUT" : "POST";
            const url = isEditMode ? `${API_BASE_URL}/api/users/${userId}` : `${API_BASE_URL}/api/users`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || `Failed to ${isEditMode ? 'update' : 'add'} user`);
            }

            alert(`User ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate("/users");
        } catch (err) {
            setError(err.message || `Unable to ${isEditMode ? 'update' : 'add'} user`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-user-page container-fluid py-4">
            <div className="form-header">
                <h1 className="mb-1">{isEditMode ? "Edit User" : "Add New User"}</h1>
                <p className="text-muted">{isEditMode ? "Update user information" : "Create a new user account"}</p>
            </div>

            <div className="form-container card border-0 shadow-sm">
                <div className="card-body">
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {!loading && (
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
                                        disabled={isEditMode}
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
                                        <option value="Sales">Sales</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Operations">Operations</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Admin">Admin</option>
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
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
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
                                    />
                                </div>
                            </div>

                            <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                                <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                                    {submitting ? `${isEditMode ? 'Updating' : 'Saving'}...` : (isEditMode ? 'Update User' : 'Add User')}
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddUser;