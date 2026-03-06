import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const API_BASE_URL = "http://localhost:5500";

const moduleOptions = [
  { value: "leads", label: "Leads Report" },
  { value: "inquiries", label: "Inquiries Report" },
  { value: "lead-followups", label: "Lead Follow-up Report" },
  { value: "inquiry-followups", label: "Inquiry Follow-up Report" },
  { value: "quotations", label: "Quotation Report" },
  { value: "proforma", label: "Proforma Report" },
];

const Reports = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const moduleName = searchParams.get("module") || "leads";
  const status = searchParams.get("status") || "";
  const assignedTo = searchParams.get("assignedTo") || "";
  const sourceType = searchParams.get("sourceType") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const updateQuery = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });
    if (!next.get("module")) next.set("module", moduleName);
    setSearchParams(next);
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (assignedTo) params.set("assignedTo", assignedTo);
      if (sourceType) params.set("sourceType", sourceType);
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const response = await fetch(`${API_BASE_URL}/api/reports/${moduleName}?${params.toString()}`, {
        headers: authHeaders,
      });
      if (!response.ok) throw new Error("Failed to load report");
      const data = await response.json();
      setRows(data.rows || []);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [moduleName, status, assignedTo, sourceType, from, to, token]);

  const columns = useMemo(() => {
    if (!rows.length) return [];
    return Object.keys(rows[0]);
  }, [rows]);

  const downloadCsv = async () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (assignedTo) params.set("assignedTo", assignedTo);
    if (sourceType) params.set("sourceType", sourceType);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    params.set("export", "csv");
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${moduleName}?${params.toString()}`, { headers: authHeaders });
      if (!response.ok) throw new Error("Failed to export CSV");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${moduleName}-report.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Unable to export CSV");
    }
  };

  return (
    <div className="comman-page container-fluid py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">Reports</h1>
          <p className="text-muted mb-0">All modules reporting with CSV export</p>
        </div>
        <button className="btn btn-outline-success" onClick={downloadCsv}>Export CSV</button>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <select className="form-select" value={moduleName} onChange={(e) => updateQuery({ module: e.target.value })}>
                {moduleOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-2"><input type="text" className="form-control" placeholder="Status" value={status} onChange={(e) => updateQuery({ status: e.target.value })} /></div>
            <div className="col-6 col-md-2"><input type="text" className="form-control" placeholder="Assignee" value={assignedTo} onChange={(e) => updateQuery({ assignedTo: e.target.value })} /></div>
            <div className="col-6 col-md-2"><input type="text" className="form-control" placeholder="Source" value={sourceType} onChange={(e) => updateQuery({ sourceType: e.target.value })} /></div>
            <div className="col-6 col-md-1"><input type="date" className="form-control" value={from} onChange={(e) => updateQuery({ from: e.target.value })} /></div>
            <div className="col-6 col-md-1"><input type="date" className="form-control" value={to} onChange={(e) => updateQuery({ to: e.target.value })} /></div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm table-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={Math.max(columns.length, 1)} className="text-center text-muted py-4">Loading report...</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={Math.max(columns.length, 1)} className="text-center text-muted py-4">No data found.</td></tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr key={idx}>
                      {columns.map((col) => (
                        <td key={`${idx}-${col}`}>{formatCell(row[col])}</td>
                      ))}
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

const formatCell = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime()) && String(value).includes("T")) {
    return date.toLocaleString();
  }
  return String(value);
};

export default Reports;
