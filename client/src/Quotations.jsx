import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const Quotations = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/quotations`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load quotations");
            const data = await response.json();
            setQuotations(data || []);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load quotations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    const handleDelete = async (quotationId) => {
        const ok = window.confirm("Delete this quotation?");
        if (!ok) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/quotations/${quotationId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            if (!response.ok) throw new Error("Failed to delete quotation");
            fetchQuotations();
        } catch (err) {
            setError(err.message || "Unable to delete quotation");
        }
    };

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Quotations</h1>
                    <p className="text-muted mb-0">Pricing proposals for inquiries</p>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                    <th>Valid Until</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted py-4">Loading quotations...</td>
                                    </tr>
                                ) : quotations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted py-4">No quotations found.</td>
                                    </tr>
                                ) : (
                                    quotations.map((quote) => (
                                        <tr key={quote._id}>
                                            <td>
                                                <strong>{quote.customerName}</strong>
                                                {quote.customerMobile && <div className="text-muted small">{quote.customerMobile}</div>}
                                            </td>
                                            <td>{quote.status || "Draft"}</td>
                                            <td>{quote.grandTotal || 0}</td>
                                            <td>{quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : "-"}</td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate(`/edit-quotation/${quote._id}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => navigate(`/add-proforma-invoice?quotationId=${quote._id}`)}
                                                    >
                                                        Create Proforma
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(quote._id)}
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

export default Quotations;
