import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const ProformaInvoices = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/proforma-invoices`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load proforma invoices");
            const data = await response.json();
            setInvoices(data || []);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load proforma invoices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDelete = async (invoiceId) => {
        const ok = window.confirm("Delete this proforma invoice?");
        if (!ok) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/proforma-invoices/${invoiceId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            if (!response.ok) throw new Error("Failed to delete proforma invoice");
            fetchInvoices();
        } catch (err) {
            setError(err.message || "Unable to delete proforma invoice");
        }
    };

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Proforma Invoices</h1>
                    <p className="text-muted mb-0">Proforma invoices for dealers</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/add-proforma-invoice")}>
                    + Add Proforma Invoice
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Issue Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">Loading invoices...</td>
                                    </tr>
                                ) : invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">No proforma invoices found.</td>
                                    </tr>
                                ) : (
                                    invoices.map((invoice) => (
                                        <tr key={invoice._id}>
                                            <td>{invoice.invoiceNumber || "-"}</td>
                                            <td>
                                                <strong>{invoice.customerName}</strong>
                                                {invoice.customerMobile && <div className="text-muted small">{invoice.customerMobile}</div>}
                                            </td>
                                            <td>{invoice.status || "Draft"}</td>
                                            <td>{invoice.grandTotal || 0}</td>
                                            <td>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : "-"}</td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate(`/edit-proforma-invoice/${invoice._id}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(invoice._id)}
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

export default ProformaInvoices;
