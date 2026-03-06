import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";
import PageSectionHeader from "./compenents/list/PageSectionHeader.jsx";
import TablePagination from "./compenents/list/TablePagination.jsx";
import useClientPagination from "./compenents/list/useClientPagination.js";
import { exportRowsToCsv } from "./compenents/list/exportCsv.js";

const LeadSource = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [leadSources, setLeadSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 10;

  const API_BASE_URL = "http://localhost:5500";
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchLeadSources = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/lead-sources`, { headers: authHeaders });
      if (!response.ok) throw new Error("Failed to load lead sources");
      setLeadSources((await response.json()) || []);
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
    if (!window.confirm("Delete this lead source?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/lead-sources/${sourceId}`, { method: "DELETE", headers: authHeaders });
      if (!response.ok) throw new Error("Failed to delete lead source");
      fetchLeadSources();
    } catch (err) {
      setError(err.message || "Unable to delete lead source");
    }
  };

  const csvRows = useMemo(() => leadSources.map((item) => ({ id: item._id, name: item.name, description: item.description || "-" })), [leadSources]);
  const { currentPage, totalPages, totalItems, pagedItems, onPageChange } = useClientPagination(leadSources, pageSize);

  return (
    <div className="comman-page container-fluid py-4">
      <PageSectionHeader
        title="Lead Sources Management"
        subtitle="Manage lead acquisition channels"
        breadcrumbItems={[{ label: "Home", to: "/dashboard" }, { label: "Lead Sources" }]}
        actions={(
          <>
            <button className="btn btn-outline-success" onClick={() => exportRowsToCsv(csvRows, "lead-sources.csv")}>Export</button>
            <button className="btn btn-primary" onClick={() => navigate("/add-lead-source")}>+ Add Lead Source</button>
          </>
        )}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm table-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle mb-0">
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
                  <tr><td colSpan={4} className="text-center text-muted py-4">Loading lead sources...</td></tr>
                ) : pagedItems.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-muted py-4">No lead sources found.</td></tr>
                ) : (
                  pagedItems.map((leadSource) => (
                    <tr key={leadSource._id}>
                      <td>{leadSource._id}</td>
                      <td>{leadSource.name}</td>
                      <td>{leadSource.description || "-"}</td>
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
          <div className="px-3 pb-3">
            <TablePagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadSource;
