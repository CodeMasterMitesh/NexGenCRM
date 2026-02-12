import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const Customers = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/customers`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load customers");
            const data = await response.json();
            const filteredCustomers = (data || []).filter((item) => {
                const type = (item.type || "").toLowerCase();
                return type === "customer" || type === "";
            });
            setCustomers(filteredCustomers);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load customers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (customerId) => {
        const ok = window.confirm("Delete this customer?");
        if (!ok) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            if (!response.ok) throw new Error("Failed to delete customer");
            fetchCustomers();
        } catch (err) {
            setError(err.message || "Unable to delete customer");
        }
    };

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Customers Management</h1>
                    <p className="text-muted mb-0">Maintain your customer directory</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/add-customer")}>+ Add Customer</button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Customers table */}
            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Source</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted py-4">Loading customers...</td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted py-4">No customers found.</td>
                            </tr>
                        ) : (
                            customers.map(customer => (
                                <tr key={customer._id}>
                                    <td>{customer._id}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>
                                        <span className="badge text-bg-info">{customer.leadSource || "-"}</span>
                                    </td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/edit-customer/${customer._id}`)}>Edit</button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(customer._id)}>Delete</button>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => navigate(`/add-inquiry?sourceType=customer&sourceId=${customer._id}`)}
                                            >
                                                Inquiry
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

export default Customers;