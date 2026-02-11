import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./AddLead.css";

const AddCustomer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        leadSource: "",
        status: "Active",
        notes: "",
        customerCategory: "",
        address: "",
        city: "",
        state: "",
        country: "",
    });
    const [leadSources, setLeadSources] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchLeadSources = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/lead-sources`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load lead sources");
            const data = await response.json();
            setLeadSources(data);
            setFormData((prev) => {
                if (prev.leadSource) return prev;
                if (!data || data.length === 0) return prev;
                return { ...prev, leadSource: data[0].name };
            });
        } catch {
            setLeadSources([]);
        }
    };

    useEffect(() => {
        fetchLeadSources();
    }, []);

    useEffect(() => {
        if (!isEditMode) return;
        const fetchCustomer = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
                    headers: authHeaders,
                });
                if (!response.ok) throw new Error("Failed to load customer");
                const data = await response.json();
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    mobile: data.mobile || "",
                    leadSource: data.leadSource || "",
                    status: data.status || "Active",
                    notes: data.notes || "",
                    customerCategory: data.customerCategory || "",
                    address: data.address || "",
                    city: data.city || "",
                    state: data.state || "",
                    country: data.country || "",
                });
                setError("");
            } catch (err) {
                setError(err.message || "Unable to load customer");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError("");
            const method = isEditMode ? "PUT" : "POST";
            const url = isEditMode
                ? `${API_BASE_URL}/api/customers/${id}`
                : `${API_BASE_URL}/api/customers`;
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || `Failed to ${isEditMode ? "update" : "add"} customer`);
            }
            navigate("/customers");
        } catch (err) {
            setError(err.message || `Unable to ${isEditMode ? "update" : "add"} customer`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="add-lead-page container-fluid py-4">
                <div className="text-muted">Loading customer...</div>
            </div>
        );
    }

    return (
        <div className="add-lead-page container-fluid py-4">
            <div className="form-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h1 className="mb-1">{isEditMode ? "Edit Customer" : "Add Customer"}</h1>
                    <p className="text-muted">{isEditMode ? "Update customer details" : "Create a new customer"}</p>
                </div>
                {isEditMode && (
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/customers")}>
                        Back
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-container card border-0 shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="lead-form">
                        <div className="row g-4">
                            <div className="col-12 col-md-6 col-lg-4">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label className="form-label">Mobile</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    className="form-control"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label className="form-label">Lead Source</label>
                                <select
                                    name="leadSource"
                                    className="form-select"
                                    value={formData.leadSource}
                                    onChange={handleChange}
                                >
                                    {leadSources.length === 0 ? (
                                        <option value="">Select lead source</option>
                                    ) : (
                                        leadSources.map((source) => (
                                            <option key={source._id} value={source.name}>
                                                {source.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label className="form-label">Status</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    name="customerCategory"
                                    className="form-control"
                                    value={formData.customerCategory}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-2">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-2">
                                <label className="form-label">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    className="form-control"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-2">
                                <label className="form-label">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    className="form-control"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Notes</label>
                                <textarea
                                    name="notes"
                                    className="form-control"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                            <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                                {submitting ? "Saving..." : isEditMode ? "Update Customer" : "Add Customer"}
                            </button>
                            <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate("/customers")}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCustomer;
