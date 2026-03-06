import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import PageSectionHeader from "./compenents/list/PageSectionHeader.jsx";
import TablePagination from "./compenents/list/TablePagination.jsx";
import useClientPagination from "./compenents/list/useClientPagination.js";
import { exportRowsToCsv } from "./compenents/list/exportCsv.js";

const Users = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const pageSize = 10;

  const API_BASE_URL = "http://localhost:5500";
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users`, { headers: authHeaders });
      if (!response.ok) throw new Error("Failed to load users");
      const data = await response.json();
      const filteredUsers = (data || []).filter((item) => {
        const type = (item.type || "").toLowerCase();
        return type === "users" || type === "user" || type === "";
      });
      setUsers(filteredUsers);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      setDeleting(true);
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setDeleteConfirm(null);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const csvRows = useMemo(
    () =>
      users.map((item) => ({
        name: item.name,
        email: item.email,
        mobile: item.mobile,
        role: item.role || "Sales",
        department: item.department || "-",
        status: item.status || "Active",
      })),
    [users]
  );

  const { currentPage, totalPages, totalItems, pagedItems, onPageChange } = useClientPagination(users, pageSize);

  return (
    <div className="comman-page container-fluid py-4">
      <PageSectionHeader
        title="Users Management"
        subtitle="Manage your team and roles"
        breadcrumbItems={[{ label: "Home", to: "/dashboard" }, { label: "Users" }]}
        actions={(
          <>
            <button className="btn btn-outline-success" onClick={() => exportRowsToCsv(csvRows, "users.csv")}>Export</button>
            <button className="btn btn-primary" onClick={() => navigate("/add-user")}>+ Add User</button>
          </>
        )}
      />

      {deleteConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Delete User</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteConfirm(null)} disabled={deleting}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setDeleteConfirm(null)} disabled={deleting}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(deleteConfirm._id)} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm table-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center text-muted">Loading users...</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedItems.length === 0 ? (
                      <tr><td colSpan={7} className="text-center text-muted py-4">No users found.</td></tr>
                    ) : (
                      pagedItems.map((user) => (
                        <tr key={user._id}>
                          <td><strong>{user.name}</strong></td>
                          <td>{user.email}</td>
                          <td>{user.mobile}</td>
                          <td><span className="badge text-bg-primary">{user.role || "Sales"}</span></td>
                          <td>{user.department || "-"}</td>
                          <td><span className={`badge ${user.status === "Active" ? "text-bg-success" : "text-bg-secondary"}`}>{user.status || "Active"}</span></td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/edit-user/${user._id}`)}>Edit</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(user)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-3 pb-3">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
