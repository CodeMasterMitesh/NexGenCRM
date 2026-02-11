import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./AddLead.css";

const AddLeadSource = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Active",
    });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        if (!isEditMode) return;
        const fetchLeadSource = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/lead-sources/${id}`, {
                    headers: authHeaders,
                });
                if (!response.ok) throw new Error("Failed to load lead source");
                const data = await response.json();
                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    status: data.status || "Active",
                });
                setError("");
            } catch (err) {
                setError(err.message || "Unable to load lead source");
            } finally {
                setLoading(false);
            }
        };
        fetchLeadSource();
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
                ? `${API_BASE_URL}/api/lead-sources/${id}`
                : `${API_BASE_URL}/api/lead-sources`;
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || `Failed to ${isEditMode ? "update" : "add"} lead source`);
            }
            navigate("/lead-source");
        } catch (err) {
            setError(err.message || `Unable to ${isEditMode ? "update" : "add"} lead source`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="add-lead-page container-fluid py-4">
                <div className="text-muted">Loading lead source...</div>
            </div>
        );
    }

    return (
        <div className="add-lead-page container-fluid py-4">
            <div className="form-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h1 className="mb-1">{isEditMode ? "Edit Lead Source" : "Add Lead Source"}</h1>
                    <p className="text-muted">{isEditMode ? "Update lead source details" : "Create a new lead source"}</p>
                </div>
                {isEditMode && (
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/lead-source")}>
                        Back
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-container card border-0 shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="lead-form">
                        <div className="row g-4">
                            <div className="col-12 col-md-6">
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
                            <div className="col-12 col-md-6">
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
                            <div className="col-12">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                            <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                                {submitting ? "Saving..." : isEditMode ? "Update Lead Source" : "Add Lead Source"}
                            </button>
                            <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate("/lead-source")}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddLeadSource;
