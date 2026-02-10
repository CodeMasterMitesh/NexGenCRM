import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./AddLead.css";

const AddLead = () => {
     const navigate = useNavigate();
    const { id: userId } = useParams();
    const isEditMode = !!userId;
    const { token } = useAuth();

    // State for form fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        leadSource: "Website",
        status: "New",
        expectedValue: "",
        notes: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // Load user data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                        headers: authHeaders,
                    });
                    if (!response.ok) {
                        throw new Error("Failed to load user");
                    }
                    const user = await response.json();
                    setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        mobile: user.mobile || "",
                        leadSource: user.leadSource || "Website",
                        status: user.status || "New",
                        expectedValue: user.expectedValue || "",
                        notes: user.notes || "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError("");

            const payload = {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                leadSource: formData.leadSource,
                status: formData.status,
                expectedValue: formData.expectedValue,
                notes: formData.notes,
            };

            const method = isEditMode ? "PUT" : "POST";
            const url = isEditMode ? `${API_BASE_URL}/api/leads/${userId}` : `${API_BASE_URL}/api/leads`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || `Failed to ${isEditMode ? 'update' : 'add'} lead`);
            }

            alert(`Lead ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate("/leads");
        } catch (err) {
            setError(err.message || `Unable to ${isEditMode ? 'update' : 'add'} lead`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-lead-page container-fluid py-4">
            <div className="form-header">
                <h1 className="mb-1">{isEditMode ? "Edit Lead" : "Add New Lead"}</h1>
                <p className="text-muted">{isEditMode ? "Update lead details" : "Create a new lead record"}</p>
            </div>

            <div className="form-container card border-0 shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="lead-form">
                        <div className="row g-4">
                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter lead full name"
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
                                <label htmlFor="leadSource" className="form-label">Lead Source</label>
                                <select
                                    id="leadSource"
                                    name="leadSource"
                                    className="form-select"
                                    value={formData.leadSource}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Website">Website</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Cold Call">Cold Call</option>
                                    <option value="Event">Event</option>
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
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Lost">Lost</option>
                                </select>
                            </div>
{/* 
                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="owner" className="form-label">Lead Owner</label>
                                <input
                                    type="text"
                                    id="owner"
                                    name="owner"
                                    className="form-control"
                                    placeholder="Assign lead owner"
                                    value={formData.owner}
                                    onChange={handleChange}
                                    required
                                />
                            </div> */}

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="expectedValue" className="form-label">Expected Value (₹)</label>
                                <input
                                    type="number"
                                    id="expectedValue"
                                    name="expectedValue"
                                    className="form-control"
                                    placeholder="Enter expected value"
                                    value={formData.expectedValue}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label htmlFor="notes" className="form-label">Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    className="form-control"
                                    placeholder="Add notes about the lead"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                            <button type="submit" className="btn btn-primary px-4">
                                Add Lead
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={() => navigate("/leads")}
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

export default AddLead;
