import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const LeadSource = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [leadSources, setLeadSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchLeadSources = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/lead-sources`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load lead sources");
            const data = await response.json();
            setLeadSources(data);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load lead sources");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeadSources();
    }, []);

    const handleDelete = async (sourceId) => {
        const ok = window.confirm("Delete this lead source?");
        if (!ok) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/lead-sources/${sourceId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            if (!response.ok) throw new Error("Failed to delete lead source");
            fetchLeadSources();
        } catch (err) {
            setError(err.message || "Unable to delete lead source");
        }
    };

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Lead Sources Management</h1>
                    <p className="text-muted mb-0">Manage lead acquisition channels</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/add-lead-source")}>+ Add Lead Source</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Leads table */}
            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="text-center text-muted py-4">Loading lead sources...</td>
                            </tr>
                        ) : leadSources.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center text-muted py-4">No lead sources found.</td>
                            </tr>
                        ) : (
                            leadSources.map(leadSource => (
                                <tr key={leadSource._id}>
                                    <td>{leadSource._id}</td>
                                    <td>{leadSource.name}</td>
                                    <td>
                                        <span className="badge text-bg-info">{leadSource.description || "-"}</span>
                                    </td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/edit-lead-source/${leadSource._id}`)}>Edit</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(leadSource._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadSource;