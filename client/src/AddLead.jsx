import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./AddLead.css";

const AddLead = () => {
     const navigate = useNavigate();
    const { id: userId } = useParams();
    const isEditMode = !!userId;
    const { token, user } = useAuth();

    // State for form fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        mobile2: "",
        contactPerson: "",
        email2: "",
        leadSource: "Website",
        status: "New",
        expectedValue: "",
        notes: "",
        customerCategory: "",
        assignedTo: "",
        enteredBy: "",
        priority: "",
        address: "",
        city: "",
        state: "",
        country: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");
    const [employees, setEmployees] = useState([]);

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                headers: authHeaders,
            });
            if (!response.ok) {
                throw new Error("Failed to load employees");
            }
            const data = await response.json();
            const staff = (data || []).filter((item) => item.type !== "Lead");
            setEmployees(staff);
        } catch {
            setEmployees([]);
        }
    };

    // Load user data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`${API_BASE_URL}/api/leads/${userId}`, {
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
                        mobile2: user.mobile2 || "",
                        contactPerson: user.contactPerson || "",
                        email2: user.email2 || "",
                        leadSource: user.leadSource || "Website",
                        status: user.status || "New",
                        expectedValue: user.expectedValue || "",
                        notes: user.notes || "",
                        customerCategory: user.customerCategory || "",
                        assignedTo: user.assignedTo || "",
                        enteredBy: user.enteredBy || user?.name || "",
                        priority: user.priority || "",
                        address: user.address || "",
                        city: user.city || "",
                        state: user.state || "",
                        country: user.country || "",
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

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (!isEditMode && user?.name) {
            setFormData((prev) => ({
                ...prev,
                enteredBy: prev.enteredBy || user.name,
            }));
        }
    }, [isEditMode, user]);

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
                mobile2: formData.mobile2,
                contactPerson: formData.contactPerson,
                email2: formData.email2,
                leadSource: formData.leadSource,
                status: formData.status,
                expectedValue: formData.expectedValue,
                notes: formData.notes,
                customerCategory: formData.customerCategory,
                assignedTo: formData.assignedTo,
                enteredBy: formData.enteredBy || user?.name || "",
                priority: formData.priority,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
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
            <div className="form-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h1 className="mb-1">{isEditMode ? "Edit Lead" : "Add New Lead"}</h1>
                    <p className="text-muted">{isEditMode ? "Update lead details" : "Create a new lead record"}</p>
                </div>
                {isEditMode && (
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/leads")}>
                        Back
                    </button>
                )}
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
                                <label htmlFor="email2" className="form-label">Email 2</label>
                                <input
                                    type="email"
                                    id="email2"
                                    name="email2"
                                    className="form-control"
                                    placeholder="Enter alternate email address"
                                    value={formData.email2}
                                    onChange={handleChange}
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
                                <label htmlFor="mobile2" className="form-label">Mobile Number 2</label>
                                <input
                                    type="tel"
                                    id="mobile2"
                                    name="mobile2"
                                    className="form-control"
                                    placeholder="Enter alternate mobile number"
                                    value={formData.mobile2}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="contactPerson" className="form-label">Contact Person</label>
                                <input
                                    type="text"
                                    id="contactPerson"
                                    name="contactPerson"
                                    className="form-control"
                                    placeholder="Enter contact person name"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
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
                                <label htmlFor="customerCategory" className="form-label">Customer Category</label>
                                <input
                                    type="text"
                                    id="customerCategory"
                                    name="customerCategory"
                                    className="form-control"
                                    placeholder="Enter customer category"
                                    value={formData.customerCategory}
                                    onChange={handleChange}
                                />
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

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="priority" className="form-label">Priority</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    className="form-select"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value="">Select priority</option>
                                    <option value="Hot">Hot</option>
                                    <option value="Warm">Warm</option>
                                    <option value="Cold">Cold</option>
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

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="assignedTo" className="form-label">Assign To</label>
                                <select
                                    id="assignedTo"
                                    name="assignedTo"
                                    className="form-select"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                >
                                    <option value="">Select employee</option>
                                    {employees.map((employee) => (
                                        <option key={employee._id} value={employee.name}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label className="form-label">Enter By</label>
                                <div className="form-control bg-light">{formData.enteredBy || user?.name || "-"}</div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="form-control"
                                    placeholder="Enter address"
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
                                {isEditMode ? "Update Lead" : "Add Lead"}
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
