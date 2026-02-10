import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { useAuth } from "./compenents/auth/AuthContext.jsx";

const Leads = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

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
            setLeads(data);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

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
            
            {/* Leads table */}
            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Source</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead._id}>
                                <td>{lead._id}</td>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.mobile}</td>
                                <td>{lead.leadSource}</td>
                                <td>
                                    <span className="badge text-bg-info">{lead.status}</span>
                                </td>
                                <td>
                                    <span className="badge text-bg-primary">{lead.status}</span>
                                </td>
                                <td>{lead.owner}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(lead._id)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(lead)}>Delete</button>
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