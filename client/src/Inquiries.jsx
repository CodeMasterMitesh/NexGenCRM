import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const Inquiries = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/inquiries`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load inquiries");
            const data = await response.json();
            setInquiries(data || []);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load inquiries");
        } finally {
            setLoading(false);
        }
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

    useEffect(() => {
        fetchInquiries();
        fetchEmployees();
    }, []);

    const employeeById = useMemo(() => {
        return employees.reduce((acc, employee) => {
            acc[employee._id] = employee;
            return acc;
        }, {});
    }, [employees]);

    const handleDelete = async (inquiryId) => {
        const ok = window.confirm("Delete this inquiry?");
        if (!ok) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/inquiries/${inquiryId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            if (!response.ok) throw new Error("Failed to delete inquiry");
            fetchInquiries();
        } catch (err) {
            setError(err.message || "Unable to delete inquiry");
        }
    };

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Inquiries</h1>
                    <p className="text-muted mb-0">Capture showroom and service interest</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/add-inquiry")}>
                    + Add Inquiry
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Status</th>
                                    <th>Assigned</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">Loading inquiries...</td>
                                    </tr>
                                ) : inquiries.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">No inquiries found.</td>
                                    </tr>
                                ) : (
                                    inquiries.map((inq) => (
                                        <tr key={inq._id}>
                                            <td>{inq.sourceType || "-"}</td>
                                            <td>
                                                <strong>{inq.sourceName || "-"}</strong>
                                                {inq.mobile && <div className="text-muted small">{inq.mobile}</div>}
                                            </td>
                                            <td>{inq.vehicleType || "-"}</td>
                                            <td>{inq.status || "New"}</td>
                                            <td>{employeeById[inq.assignedTo]?.name || inq.assignedTo || "-"}</td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate(`/edit-inquiry/${inq._id}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-info"
                                                        onClick={() => navigate(`/inquiry-followup/${inq._id}`)}
                                                    >
                                                        Followup
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => navigate(`/add-quotation?inquiryId=${inq._id}`)}
                                                    >
                                                        Create Quotation
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(inq._id)}
                                                    >
                                                        Delete
                                                    </button>
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

export default Inquiries;
