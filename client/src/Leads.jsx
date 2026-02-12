import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { useAuth } from "./compenents/auth/AuthContext.jsx";

const Leads = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [assignedFilter, setAssignedFilter] = useState("");
    const [employees, setEmployees] = useState([]);

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    const isAdmin = user?.role === "Admin";
    const userId = user?.id;
    const userName = user?.name;

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                headers: authHeaders,
            });
            if (!response.ok) {
                throw new Error("Failed to load employees");
            }
            const data = await response.json();
            const staff = (data || []).filter((item) => (item.type || "").toLowerCase() !== "lead");
            setEmployees(staff);
        } catch {
            setEmployees([]);
        }
    };

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/leads`, {
                headers: authHeaders,
            });
            if (!response.ok) {
                throw new Error("Failed to load leads");
            }
            const data = await response.json();
            const filteredLeads = isAdmin
                ? data
                : (data || []).filter(
                    (lead) => lead.assignedTo === userId || lead.assignedTo === userName
                );
            setLeads(filteredLeads);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchEmployees();
    }, [token, userId, userName, isAdmin]);

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = searchTerm
            ? [lead.name, lead.contactPerson, lead.email, lead.mobile]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            : true;

        const matchesStatus = statusFilter ? lead.status === statusFilter : true;
        const matchesAssigned = assignedFilter ? lead.assignedTo === assignedFilter : true;

        return matchesSearch && matchesStatus && matchesAssigned;
    });

    const handleDelete = async (leadId, leadName) => {
        try {
            setDeleting(true);
            const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", ...authHeaders }
            });

            if (!response.ok) {
                throw new Error("Failed to delete lead");
            }

            setLeads(leads.filter(lead => lead._id !== leadId));
            setDeleteConfirm(null);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to delete lead");
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = (leadId) => {
        navigate(`/edit-lead/${leadId}`);
    };

    const handleFollowup = (leadId) => {
        navigate(`/lead-followup/${leadId}`);
    };
    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Leads Management</h1>
                    <p className="text-muted mb-0">Track and manage lead pipeline</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/add-lead")}>
                    + Add Lead
                </button>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, contact, email, mobile"
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
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Converted">Converted</option>
                                <option value="Lost">Lost</option>
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
            </div>
            
            {/* Leads table */}
            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th>Assigned</th>
                            <th>Enter By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map(lead => (
                            <tr key={lead._id}>
                                <td>{lead._id}</td>
                                <td>{lead.name}</td>
                                <td>{lead.contactPerson || "-"}</td>
                                <td>{lead.mobile}</td>
                                <td>
                                    <span className="badge text-bg-info">{lead.status}</span>
                                </td>
                                <td>{lead.assignedTo || "-"}</td>
                                <td>{lead.enteredBy || "-"}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(lead._id)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(lead)}>Delete</button>
                                        <button className="btn btn-sm btn-outline-success" onClick={() => handleFollowup(lead._id)}>Followup</button>
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => navigate(`/add-inquiry?sourceType=lead&sourceId=${lead._id}`)}
                                        >
                                            Inquiry
                                        </button>
                                    </div>
                                </td>
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

export default Leads;