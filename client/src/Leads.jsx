import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import PageSectionHeader from "./compenents/list/PageSectionHeader.jsx";
import TablePagination from "./compenents/list/TablePagination.jsx";
import useClientPagination from "./compenents/list/useClientPagination.js";
import { exportRowsToCsv } from "./compenents/list/exportCsv.js";

const Leads = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const [employees, setEmployees] = useState([]);
  const [convertingId, setConvertingId] = useState("");
  const pageSize = 10;

  const API_BASE_URL = "http://localhost:5500";
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const isAdmin = user?.role === "Admin";
  const userId = user?.id;
  const userName = user?.name;

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, { headers: authHeaders });
      if (!response.ok) throw new Error("Failed to load employees");
      const data = await response.json();
      setEmployees((data || []).filter((item) => (item.type || "").toLowerCase() !== "lead"));
    } catch {
      setEmployees([]);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/leads`, { headers: authHeaders });
      if (!response.ok) throw new Error("Failed to load leads");
      const data = await response.json();
      const scoped = isAdmin ? data : (data || []).filter((lead) => lead.assignedTo === userId || lead.assignedTo === userName);
      setLeads(scoped);
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

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        const matchesSearch = searchTerm
          ? [lead.name, lead.contactPerson, lead.email, lead.mobile].filter(Boolean).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        const matchesStatus = statusFilter ? lead.status === statusFilter : true;
        const matchesAssigned = assignedFilter ? lead.assignedTo === assignedFilter : true;
        return matchesSearch && matchesStatus && matchesAssigned;
      }),
    [leads, searchTerm, statusFilter, assignedFilter]
  );

  const { currentPage, totalPages, totalItems, pagedItems, onPageChange, setCurrentPage } = useClientPagination(filteredLeads, pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, assignedFilter]);

  const handleDelete = async (leadId) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders },
      });
      if (!response.ok) throw new Error("Failed to delete lead");
      setLeads((prev) => prev.filter((lead) => lead._id !== leadId));
    } catch (err) {
      setError(err.message || "Failed to delete lead");
    }
  };

  const handleConvert = async (leadId) => {
    if (!window.confirm("Convert this lead to customer?")) return;
    try {
      setConvertingId(leadId);
      const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}/convert-to-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || "Failed to convert lead");
      }
      await fetchLeads();
    } catch (err) {
      setError(err.message || "Failed to convert lead");
    } finally {
      setConvertingId("");
    }
  };

  const csvRows = useMemo(
    () =>
      filteredLeads.map((item) => ({
        id: item._id,
        name: item.name,
        contact: item.contactPerson || "-",
        mobile: item.mobile,
        status: item.status,
        assignedTo: item.assignedTo || "-",
        enterBy: item.enteredBy || "-",
      })),
    [filteredLeads]
  );

  return (
    <div className="comman-page container-fluid py-4">
      <PageSectionHeader
        title="Leads Management"
        subtitle="Track and manage lead pipeline"
        breadcrumbItems={[{ label: "Home", to: "/dashboard" }, { label: "Leads" }]}
        actions={(
          <>
            <button className="btn btn-outline-success" onClick={() => exportRowsToCsv(csvRows, "leads.csv")}>Export</button>
            <button className="btn btn-primary" onClick={() => navigate("/add-lead")}>+ Add Lead</button>
          </>
        )}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <input type="text" className="form-control" placeholder="Search by name, contact, email, mobile" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <select className="form-select" value={assignedFilter} onChange={(e) => setAssignedFilter(e.target.value)}>
                <option value="">All Assigned</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.name}>{employee.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm table-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle mb-0">
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
                {loading ? (
                  <tr><td colSpan={8} className="text-center text-muted py-4">Loading leads...</td></tr>
                ) : pagedItems.length === 0 ? (
                  <tr><td colSpan={8} className="text-center text-muted py-4">No leads found.</td></tr>
                ) : (
                  pagedItems.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead._id}</td>
                      <td>{lead.name}</td>
                      <td>{lead.contactPerson || "-"}</td>
                      <td>{lead.mobile}</td>
                      <td><span className="badge text-bg-info">{lead.status}</span></td>
                      <td>{lead.assignedTo || "-"}</td>
                      <td>{lead.enteredBy || "-"}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/edit-lead/${lead._id}`)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(lead._id)}>Delete</button>
                          <button className="btn btn-sm btn-outline-success" onClick={() => navigate(`/lead-followup/${lead._id}`)}>Followup</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/add-inquiry?sourceType=lead&sourceId=${lead._id}`)}>Inquiry</button>
                          <button className="btn btn-sm btn-outline-warning" onClick={() => handleConvert(lead._id)} disabled={lead.status === "Converted" || convertingId === lead._id}>
                            {lead.status === "Converted" ? "Converted" : convertingId === lead._id ? "Converting..." : "Convert"}
                          </button>
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

export default Leads;
