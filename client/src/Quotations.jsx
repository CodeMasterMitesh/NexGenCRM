import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";
import PageSectionHeader from "./compenents/list/PageSectionHeader.jsx";
import TablePagination from "./compenents/list/TablePagination.jsx";
import useClientPagination from "./compenents/list/useClientPagination.js";
import { exportRowsToCsv } from "./compenents/list/exportCsv.js";

const Quotations = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const pageSize = 10;

  const API_BASE_URL = "http://localhost:5500";
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/quotations`, { headers: authHeaders });
      if (!response.ok) throw new Error("Failed to load quotations");
      setQuotations((await response.json()) || []);
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

  const filteredRows = useMemo(() => quotations.filter((quote) => {
    const source = `${quote.customerName || ""} ${quote.customerMobile || ""}`.toLowerCase();
    if (search && !source.includes(search.toLowerCase())) return false;
    if (statusFilter && quote.status !== statusFilter) return false;
    const createdAt = quote.createdAt ? new Date(quote.createdAt) : null;
    if (fromDate && (!createdAt || createdAt < new Date(fromDate))) return false;
    if (toDate) {
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
      if (!createdAt || createdAt > endDate) return false;
    }
    return true;
  }), [quotations, search, statusFilter, fromDate, toDate]);

  const { currentPage, totalPages, totalItems, pagedItems, onPageChange, setCurrentPage } = useClientPagination(filteredRows, pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, fromDate, toDate]);

  const handleDelete = async (quotationId) => {
    if (!window.confirm("Delete this quotation?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotations/${quotationId}`, { method: "DELETE", headers: authHeaders });
      if (!response.ok) throw new Error("Failed to delete quotation");
      fetchQuotations();
    } catch (err) {
      setError(err.message || "Unable to delete quotation");
    }
  };

  const downloadPdf = async (quotationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotations/${quotationId}/pdf`, { headers: authHeaders });
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `quotation-${quotationId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to download quotation PDF");
    }
  };

  const csvRows = useMemo(() => filteredRows.map((q) => ({ customer: q.customerName, status: q.status, total: q.grandTotal, created: q.createdAt, validUntil: q.validUntil })), [filteredRows]);

  return (
    <div className="comman-page container-fluid py-4">
      <PageSectionHeader
        title="Quotations"
        subtitle="Pricing proposals for inquiries"
        breadcrumbItems={[{ label: "Home", to: "/dashboard" }, { label: "Quotations" }]}
        actions={(
          <>
            <button className="btn btn-outline-success" onClick={() => exportRowsToCsv(csvRows, "quotations.csv")}>Export</button>
            <button className="btn btn-primary" onClick={() => navigate("/inquiries")}>Create From Inquiry</button>
          </>
        )}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-4"><input className="form-control" placeholder="Search customer/mobile" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <div className="col-12 col-md-2"><select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All Status</option><option value="Draft">Draft</option><option value="Sent">Sent</option><option value="Accepted">Accepted</option><option value="Rejected">Rejected</option></select></div>
            <div className="col-6 col-md-3"><input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
            <div className="col-6 col-md-3"><input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm table-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Created</th>
                  <th>Valid Until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-muted py-4">Loading quotations...</td></tr>
                ) : pagedItems.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted py-4">No quotations found.</td></tr>
                ) : (
                  pagedItems.map((quote) => (
                    <tr key={quote._id}>
                      <td><strong>{quote.customerName}</strong>{quote.customerMobile && <div className="text-muted small">{quote.customerMobile}</div>}</td>
                      <td>{quote.status || "Draft"}</td>
                      <td>{Number(quote.grandTotal || 0).toLocaleString("en-IN")}</td>
                      <td>{quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : "-"}</td>
                      <td>{quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : "-"}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/edit-quotation/${quote._id}`)}>Edit</button>
                          <button className="btn btn-sm btn-outline-success" onClick={() => navigate(`/add-proforma-invoice?quotationId=${quote._id}`)}>Create Proforma</button>
                          <button className="btn btn-sm btn-outline-info" onClick={() => downloadPdf(quote._id)}>PDF</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(quote._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-3 pb-3">
            <TablePagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotations;
