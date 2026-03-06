import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const ProformaInvoices = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  const filteredRows = useMemo(() => {
    return invoices.filter((invoice) => {
      const source = `${invoice.customerName || ""} ${invoice.invoiceNumber || ""}`.toLowerCase();
      if (search && !source.includes(search.toLowerCase())) return false;
      if (statusFilter && invoice.status !== statusFilter) return false;
      const createdAt = invoice.createdAt ? new Date(invoice.createdAt) : null;
      if (fromDate && (!createdAt || createdAt < new Date(fromDate))) return false;
      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        if (!createdAt || createdAt > endDate) return false;
      }
      return true;
    });
  }, [invoices, search, statusFilter, fromDate, toDate]);

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

  const downloadPdf = async (invoiceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/proforma-invoices/${invoiceId}/pdf`, { headers: authHeaders });
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `proforma-${invoiceId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to download proforma PDF");
    }
  };

  return (
    <div className="comman-page container-fluid py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">Proforma Invoices</h1>
          <p className="text-muted mb-0">Proforma invoices for dealers</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/add-proforma-invoice")}>+ Add Proforma Invoice</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-4"><input className="form-control" placeholder="Search customer/invoice no" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Issued">Issued</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-6 col-md-3"><input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
            <div className="col-6 col-md-3"><input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          </div>
        </div>
      </div>

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
                  <tr><td colSpan={6} className="text-center text-muted py-4">Loading invoices...</td></tr>
                ) : filteredRows.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted py-4">No proforma invoices found.</td></tr>
                ) : (
                  filteredRows.map((invoice) => (
                    <tr key={invoice._id}>
                      <td>{invoice.invoiceNumber || "-"}</td>
                      <td>
                        <strong>{invoice.customerName}</strong>
                        {invoice.customerMobile && <div className="text-muted small">{invoice.customerMobile}</div>}
                      </td>
                      <td>{invoice.status || "Draft"}</td>
                      <td>{Number(invoice.grandTotal || 0).toLocaleString("en-IN")}</td>
                      <td>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : "-"}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/edit-proforma-invoice/${invoice._id}`)}>Edit</button>
                          <button className="btn btn-sm btn-outline-info" onClick={() => downloadPdf(invoice._id)}>PDF</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(invoice._id)}>Delete</button>
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
