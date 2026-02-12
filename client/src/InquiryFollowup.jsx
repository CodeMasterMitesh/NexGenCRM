import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";

const InquiryFollowup = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [inquiry, setInquiry] = useState(null);
    const [followups, setFollowups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const [formData, setFormData] = useState({
        followupDate: "",
        followupTime: "",
        status: "Pending",
        priority: "Medium",
        remarks: "",
    });

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchInquiry = async () => {
        const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, { headers: authHeaders });
        if (!response.ok) throw new Error("Failed to load inquiry details");
        return response.json();
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const inquiryData = await fetchInquiry();
            setInquiry(inquiryData);
            setFollowups(inquiryData.followups || []);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load inquiry details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (user?.name) {
            setFormData((prev) => ({
                ...prev,
                createdBy: prev.createdBy || user.name,
            }));
        }
    }, [user]);

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
            setSaving(true);
            setError("");

            if (!formData.followupDate) {
                setSaving(false);
                setError("Please provide a followup date.");
                return;
            }

            const payload = {
                followupDate: formData.followupDate,
                followupTime: formData.followupTime,
                status: formData.status,
                priority: formData.priority,
                remarks: formData.remarks,
                createdBy: user?.name || "",
            };

            const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}/followups`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to add followup");
            }

            setFormData({
                followupDate: "",
                followupTime: "",
                status: "Pending",
                priority: "Medium",
                remarks: "",
            });
            await loadData();
        } catch (err) {
            setError(err.message || "Unable to add followup");
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (followup) => {
        setEditingId(followup._id);
        const dateStr = followup.followupDate ? new Date(followup.followupDate).toISOString().split("T")[0] : "";
        setEditData({
            followupDate: dateStr,
            followupTime: followup.followupTime || "",
            status: followup.status || "Pending",
            priority: followup.priority || "Medium",
            remarks: followup.remarks || "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const saveEdit = async (followupId) => {
        try {
            const payload = {
                followupDate: editData.followupDate,
                followupTime: editData.followupTime,
                status: editData.status,
                priority: editData.priority,
                remarks: editData.remarks,
            };
            const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}/followups/${followupId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to update followup");
            }
            await loadData();
            cancelEdit();
        } catch (err) {
            setError(err.message || "Unable to update followup");
        }
    };

    const deleteFollowup = async (followupId) => {
        const confirmDelete = window.confirm("Delete this followup?");
        if (!confirmDelete) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}/followups/${followupId}`, {
                method: "DELETE",
                headers: { ...authHeaders },
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to delete followup");
            }
            await loadData();
        } catch (err) {
            setError(err.message || "Unable to delete followup");
        }
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-muted">Loading inquiry followup details...</div>
            </div>
        );
    }

    if (!inquiry) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger">Inquiry not found.</div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="mb-1">Inquiry Followup</h1>
                    <p className="text-muted mb-0">
                        {inquiry.sourceName} - {inquiry.vehicleType} | {inquiry.status}
                    </p>
                </div>
                <button className="btn btn-outline-secondary" onClick={() => navigate("/inquiries")}>
                    Back
                </button>
            </div>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Add New Followup</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Followup Date*</label>
                                    <input
                                        type="date"
                                        name="followupDate"
                                        className="form-control"
                                        value={formData.followupDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Followup Time</label>
                                    <input
                                        type="time"
                                        name="followupTime"
                                        className="form-control"
                                        value={formData.followupTime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Priority</label>
                                    <select
                                        name="priority"
                                        className="form-select"
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Remarks</label>
                                    <textarea
                                        name="remarks"
                                        className="form-control"
                                        rows="3"
                                        placeholder="Add remarks or notes"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Add Followup"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">
                                Followups ({followups.length})
                            </h5>
                        </div>
                        <div className="card-body">
                            {followups.length === 0 ? (
                                <p className="text-muted mb-0">No followups scheduled yet.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                                <th>Priority</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {followups
                                                .sort((a, b) => new Date(b.followupDate) - new Date(a.followupDate))
                                                .map((fu) => (
                                                    <tr key={fu._id}>
                                                        <td>
                                                            {editingId === fu._id ? (
                                                                <input
                                                                    type="date"
                                                                    className="form-control form-control-sm"
                                                                    value={editData.followupDate}
                                                                    onChange={(e) =>
                                                                        setEditData({
                                                                            ...editData,
                                                                            followupDate: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            ) : (
                                                                new Date(fu.followupDate).toLocaleDateString()
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingId === fu._id ? (
                                                                <input
                                                                    type="time"
                                                                    className="form-control form-control-sm"
                                                                    value={editData.followupTime}
                                                                    onChange={(e) =>
                                                                        setEditData({
                                                                            ...editData,
                                                                            followupTime: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            ) : (
                                                                fu.followupTime || "-"
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingId === fu._id ? (
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={editData.status}
                                                                    onChange={(e) =>
                                                                        setEditData({
                                                                            ...editData,
                                                                            status: e.target.value,
                                                                        })
                                                                    }
                                                                >
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Scheduled">Scheduled</option>
                                                                    <option value="Completed">Completed</option>
                                                                    <option value="Cancelled">Cancelled</option>
                                                                </select>
                                                            ) : (
                                                                <span
                                                                    className={`badge bg-${
                                                                        fu.status === "Completed"
                                                                            ? "success"
                                                                            : fu.status === "Cancelled"
                                                                                ? "danger"
                                                                                : "warning"
                                                                    }`}
                                                                >
                                                                    {fu.status}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingId === fu._id ? (
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={editData.priority}
                                                                    onChange={(e) =>
                                                                        setEditData({
                                                                            ...editData,
                                                                            priority: e.target.value,
                                                                        })
                                                                    }
                                                                >
                                                                    <option value="Low">Low</option>
                                                                    <option value="Medium">Medium</option>
                                                                    <option value="High">High</option>
                                                                </select>
                                                            ) : (
                                                                <span
                                                                    className={`badge bg-${
                                                                        fu.priority === "High"
                                                                            ? "danger"
                                                                            : fu.priority === "Low"
                                                                                ? "info"
                                                                                : "secondary"
                                                                    }`}
                                                                >
                                                                    {fu.priority}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingId === fu._id ? (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-success me-2"
                                                                        onClick={() => saveEdit(fu._id)}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-secondary"
                                                                        onClick={cancelEdit}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary me-2"
                                                                        onClick={() => startEdit(fu)}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => deleteFollowup(fu._id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {followups.length > 0 && (
                                <div className="mt-3 pt-3 border-top">
                                    {followups.map((fu) => (
                                        <div key={fu._id} className="mb-3">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <strong>{new Date(fu.followupDate).toLocaleDateString()}</strong>
                                                    {fu.followupTime && <span className="ms-2 text-muted">{fu.followupTime}</span>}
                                                </div>
                                                <span className={`badge bg-${
                                                    fu.priority === "High"
                                                        ? "danger"
                                                        : fu.priority === "Low"
                                                            ? "info"
                                                            : "secondary"
                                                }`}>
                                                    {fu.priority}
                                                </span>
                                            </div>
                                            <p className="mb-1 mt-2">{fu.remarks}</p>
                                            <small className="text-muted">By {fu.createdBy || "System"}</small>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InquiryFollowup;
