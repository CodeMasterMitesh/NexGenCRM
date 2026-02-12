import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./LeadFollowup.css";

const LeadFollowup = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [lead, setLead] = useState(null);
    const [followups, setFollowups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [assignedFilter, setAssignedFilter] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const [formData, setFormData] = useState({
        followupType: "Call",
        dateTime: "",
        followupAfterDays: "",
        priority: "",
        status: "In Progress",
        enterBy: "",
        remarks: "",
        note: "",
    });

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const leadAgeDays = useMemo(() => {
        if (!lead?.createdAt) return "-";
        const created = new Date(lead.createdAt);
        const now = new Date();
        const diffMs = Math.max(now.getTime() - created.getTime(), 0);
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }, [lead]);

    const fetchLead = async () => {
        const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, { headers: authHeaders });
        if (!response.ok) throw new Error("Failed to load lead details");
        return response.json();
    };

    const fetchFollowups = async () => {
        const response = await fetch(`${API_BASE_URL}/api/leads/${id}/followups`, { headers: authHeaders });
        if (!response.ok) throw new Error("Failed to load followups");
        return response.json();
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load employees");
            const data = await response.json();
            const staff = (data || []).filter((item) => (item.type || "").toLowerCase() !== "lead");
            setEmployees(staff);
        } catch {
            setEmployees([]);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [leadData, followupData] = await Promise.all([fetchLead(), fetchFollowups()]);
            setLead(leadData);
            setFollowups(followupData || []);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load lead details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        fetchEmployees();
    }, [id]);

    useEffect(() => {
        if (user?.name) {
            setFormData((prev) => ({
                ...prev,
                enterBy: prev.enterBy || user.name,
            }));
        }
    }, [user]);

    const computedFollowupDate = useMemo(() => {
        if (formData.dateTime) {
            const date = new Date(formData.dateTime);
            return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
        }
        if (!formData.followupAfterDays) return "";
        const base = new Date();
        const days = Number(formData.followupAfterDays);
        if (Number.isNaN(days)) return "";
        base.setDate(base.getDate() + days);
        return base.toLocaleString();
    }, [formData.dateTime, formData.followupAfterDays]);

    const filteredFollowups = followups.filter((fu) => {
        const matchesSearch = searchTerm
            ? [fu.followupType, fu.remarks, fu.note, fu.enterBy, fu.assignTo]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            : true;
        const matchesStatus = statusFilter ? fu.status === statusFilter : true;
        const matchesPriority = priorityFilter ? fu.priority === priorityFilter : true;
        const matchesAssigned = assignedFilter ? fu.assignTo === assignedFilter : true;
        return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "followupAfterDays") {
            const days = value === "" ? "" : Number(value);
            const nextDateTime = value === "" || Number.isNaN(days)
                ? ""
                : toInputDateTime(new Date(Date.now() + days * 24 * 60 * 60 * 1000));
            setFormData((prev) => ({
                ...prev,
                followupAfterDays: value,
                dateTime: nextDateTime,
            }));
            return;
        }
        if (name === "dateTime") {
            setFormData((prev) => ({
                ...prev,
                dateTime: value,
                followupAfterDays: "",
            }));
            return;
        }
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

            if (!formData.dateTime && !formData.followupAfterDays) {
                setSaving(false);
                setError("Please provide a date/time or follow-up after days.");
                return;
            }

            const payload = {
                followupType: formData.followupType,
                followupAfterDays: formData.followupAfterDays ? Number(formData.followupAfterDays) : 0,
                priority: formData.priority,
                status: formData.status,
                assignTo: lead?.assignedTo || "",
                enterBy: formData.enterBy || user?.name || "",
                remarks: formData.remarks,
                note: formData.note || formData.remarks || "Follow-up scheduled",
            };

            if (formData.dateTime) {
                payload.date = new Date(formData.dateTime).toISOString();
            }

            const response = await fetch(`${API_BASE_URL}/api/leads/${id}/followups`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to add follow-up");
            }

            setFormData({
                followupType: "Call",
                dateTime: "",
                followupAfterDays: "",
                priority: "",
                status: "In Progress",
                enterBy: "",
                remarks: "",
                note: "",
            });
            await loadData();
        } catch (err) {
            setError(err.message || "Unable to add follow-up");
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (followup) => {
        setEditingId(followup._id);
        setEditData({
            followupType: followup.followupType || "Call",
            dateTime: toInputDateTime(followup.date),
            followupAfterDays: followup.followupAfterDays || 0,
            priority: followup.priority || "",
            status: followup.status || "Scheduled",
            enterBy: followup.enterBy || user?.name || "",
            remarks: followup.remarks || "",
            note: followup.note || "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const saveEdit = async (followupId) => {
        try {
            const payload = {
                followupType: editData.followupType,
                followupAfterDays: Number(editData.followupAfterDays || 0),
                priority: editData.priority,
                status: editData.status,
                assignTo: lead?.assignedTo || "",
                enterBy: editData.enterBy || user?.name || "",
                remarks: editData.remarks,
                note: editData.note,
            };
            if (editData.dateTime) {
                payload.date = new Date(editData.dateTime).toISOString();
            }
            const response = await fetch(`${API_BASE_URL}/api/leads/${id}/followups/${followupId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to update follow-up");
            }
            await loadData();
            cancelEdit();
        } catch (err) {
            setError(err.message || "Unable to update follow-up");
        }
    };

    const deleteFollowup = async (followupId) => {
        const confirmDelete = window.confirm("Delete this follow-up?");
        if (!confirmDelete) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/leads/${id}/followups/${followupId}`, {
                method: "DELETE",
                headers: { ...authHeaders },
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to delete follow-up");
            }
            await loadData();
        } catch (err) {
            setError(err.message || "Unable to delete follow-up");
        }
    };

    if (loading) {
        return (
            <div className="followup-page container-fluid py-4">
                <div className="text-muted">Loading lead follow-up details...</div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="followup-page container-fluid py-4">
                <div className="alert alert-danger">Lead not found.</div>
            </div>
        );
    }

    return (
        <div className="followup-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Lead Follow-up</h1>
                    <p className="text-muted mb-0">Track every discussion and next action</p>
                </div>
                <button className="btn btn-outline-secondary" onClick={() => navigate("/leads")}>Back to Leads</button>
            </div>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pb-0">
                            <h5 className="mb-0">Lead Details</h5>
                        </div>
                        <div className="card-body">
                            <div className="lead-title">{lead.name}</div>
                            <div className="lead-meta">Lead Age: {leadAgeDays} Day(s)</div>

                            <div className="detail-grid mt-3">
                                <DetailItem label="Contact Person" value={lead.contactPerson || "-"} />
                                <DetailItem label="Mobile No" value={lead.mobile || "-"} />
                                <DetailItem label="Mobile No 2" value={lead.mobile2 || "-"} />
                                <DetailItem label="Email" value={lead.email || "-"} />
                                <DetailItem label="Email 2" value={lead.email2 || "-"} />
                                <DetailItem label="State" value={lead.state || "-"} />
                                <DetailItem label="Customer Category" value={lead.customerCategory || "-"} />
                                <DetailItem label="Create Date" value={formatDateTime(lead.createdAt)} />
                                <DetailItem label="Assign To" value={lead.assignedTo || "-"} />
                                <DetailItem label="Enter By" value={lead.enteredBy || "-"} />
                                <DetailItem label="Priority" value={lead.priority || "-"} />
                                <DetailItem label="Status" value={lead.status || "-"} />
                            </div>

                            <div className="mt-3">
                                <div className="detail-label">Notes</div>
                                <div className="detail-value">{lead.notes || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pb-0">
                            <h5 className="mb-0">New Follow-up</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="followup-form">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="followupType">Followup Type</label>
                                        <select
                                            id="followupType"
                                            name="followupType"
                                            className="form-select"
                                            value={formData.followupType}
                                            onChange={handleChange}
                                        >
                                            <option value="Call">Call</option>
                                            <option value="Email">Email</option>
                                            <option value="Visit">Visit</option>
                                            <option value="Meeting">Meeting</option>
                                            <option value="WhatsApp">WhatsApp</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="dateTime">Date Time</label>
                                        <input
                                            type="datetime-local"
                                            id="dateTime"
                                            name="dateTime"
                                            className="form-control"
                                            value={formData.dateTime}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="followupAfterDays">Followup After Days</label>
                                        <input
                                            type="number"
                                            id="followupAfterDays"
                                            name="followupAfterDays"
                                            className="form-control"
                                            value={formData.followupAfterDays}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                        {computedFollowupDate && (
                                            <div className="text-muted small mt-1">
                                                Next follow-up on: {computedFollowupDate}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="priority">Priority</label>
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

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="status">Status</label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-select"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Overdue">Overdue</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Enter By</label>
                                        <div className="form-control bg-light">{formData.enterBy || user?.name || "-"}</div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="remarks">Remarks</label>
                                        <textarea
                                            id="remarks"
                                            name="remarks"
                                            className="form-control"
                                            rows="3"
                                            value={formData.remarks}
                                            onChange={handleChange}
                                            placeholder="Enter detailed remarks"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label" htmlFor="note">Notes</label>
                                        <textarea
                                            id="note"
                                            name="note"
                                            className="form-control"
                                            rows="2"
                                            value={formData.note}
                                            onChange={handleChange}
                                            placeholder="Quick notes for this follow-up"
                                        />
                                    </div>
                                </div>

                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? "Saving..." : "Save Follow-up"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-white border-0 pb-0">
                    <h5 className="mb-0">Follow-up History</h5>
                </div>
                <div className="card-body p-0">
                    <div className="p-3 border-bottom">
                        <div className="row g-3">
                            <div className="col-12 col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search type, remarks, assignee"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-2">
                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-2">
                                <select
                                    className="form-select"
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                >
                                    <option value="">All Priority</option>
                                    <option value="Hot">Hot</option>
                                    <option value="Warm">Warm</option>
                                    <option value="Cold">Cold</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-4">
                                <select
                                    className="form-select"
                                    value={assignedFilter}
                                    onChange={(e) => setAssignedFilter(e.target.value)}
                                >
                                    <option value="">All Assigned</option>
                                    {employees.map((employee) => (
                                        <option key={employee._id} value={employee.name}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Followup Type</th>
                                    <th>Date Time</th>
                                    <th>Followup After Days</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th>Enter By</th>
                                    <th>Assigned</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFollowups.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted py-4">No follow-ups yet.</td>
                                    </tr>
                                )}
                                {filteredFollowups.map((fu, index) => (
                                    <tr key={fu._id || index}>
                                        <td>{index + 1}</td>
                                        {editingId === fu._id ? (
                                            <>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={editData.followupType || "Call"}
                                                        onChange={(e) => setEditData((prev) => ({ ...prev, followupType: e.target.value }))}
                                                    >
                                                        <option value="Call">Call</option>
                                                        <option value="Email">Email</option>
                                                        <option value="Visit">Visit</option>
                                                        <option value="Meeting">Meeting</option>
                                                        <option value="WhatsApp">WhatsApp</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control form-control-sm"
                                                        value={editData.dateTime || ""}
                                                        onChange={(e) => setEditData((prev) => ({ ...prev, dateTime: e.target.value }))}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={editData.followupAfterDays}
                                                        min="0"
                                                        onChange={(e) => setEditData((prev) => ({ ...prev, followupAfterDays: e.target.value }))}
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={editData.priority || ""}
                                                        onChange={(e) => setEditData((prev) => ({ ...prev, priority: e.target.value }))}
                                                    >
                                                        <option value="">-</option>
                                                        <option value="Hot">Hot</option>
                                                        <option value="Warm">Warm</option>
                                                        <option value="Cold">Cold</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={editData.status || "Scheduled"}
                                                        onChange={(e) => setEditData((prev) => ({ ...prev, status: e.target.value }))}
                                                    >
                                                        <option value="Scheduled">Scheduled</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Overdue">Overdue</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={editData.remarks || ""}
                                                        onChange={(e) => setEditData((prev) => ({ ...prev, remarks: e.target.value }))}
                                                    />
                                                </td>
                                                <td>{editData.enterBy || "-"}</td>
                                                <td>{lead?.assignedTo || "-"}</td>
                                                <td>
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <button className="btn btn-outline-primary" onClick={() => saveEdit(fu._id)}>Save</button>
                                                        <button className="btn btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{fu.followupType || "-"}</td>
                                                <td>{formatDateTime(fu.date)}</td>
                                                <td>{fu.followupAfterDays || 0}</td>
                                                <td>{fu.priority || "-"}</td>
                                                <td>
                                                    <span className={`badge ${statusBadge(fu.status)}`}>
                                                        {fu.status}
                                                    </span>
                                                </td>
                                                <td>{fu.remarks || fu.note || "-"}</td>
                                                <td>{fu.enterBy || "-"}</td>
                                                <td>{lead?.assignedTo || "-"}</td>
                                                <td>
                                                    <div className="btn-group btn-group-sm" role="group">
                                                        <button className="btn btn-outline-primary" onClick={() => startEdit(fu)}>Edit</button>
                                                        <button className="btn btn-outline-danger" onClick={() => deleteFollowup(fu._id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div className="detail-item">
        <div className="detail-label">{label}</div>
        <div className="detail-value">{value}</div>
    </div>
);

const statusBadge = (status) => {
    switch (status) {
        case "Completed":
            return "text-bg-success";
        case "Overdue":
            return "text-bg-danger";
        case "Scheduled":
            return "text-bg-warning";
        case "In Progress":
            return "text-bg-primary";
        default:
            return "text-bg-secondary";
    }
};

const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
};

const toInputDateTime = (value) => {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (num) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default LeadFollowup;
