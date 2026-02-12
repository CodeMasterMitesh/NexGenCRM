import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
const Users = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                headers: authHeaders,
            });
            if (!response.ok) {
                throw new Error("Failed to load users");
            }
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

    const handleDelete = async (userId, userName) => {
        try {
            setDeleting(true);
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", ...authHeaders }
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            setUsers(users.filter(user => user._id !== userId));
            setDeleteConfirm(null);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to delete user");
        } finally {
            setDeleting(false);
        }
    };

    const handleEdit = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Users Management</h1>
                    <p className="text-muted mb-0">Manage your team and roles</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/add-user")}
                    >
                        + Add User
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Delete User</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={deleting}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-0">
                                    Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(deleteConfirm._id, deleteConfirm.name)}
                                    disabled={deleting}
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users table */}
            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    {loading && (
                        <div className="p-4 text-center text-muted">Loading users...</div>
                    )}
                    {error && !loading && (
                        <div className="alert alert-danger m-3 mb-0">{error}</div>
                    )}
                    {!loading && !error && (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle mb-0">
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
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center text-muted py-4">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user._id}>
                                                <td>
                                                    <strong>{user.name}</strong>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{user.mobile}</td>
                                                <td>
                                                    <span className="badge text-bg-primary">{user.role || "Sales"}</span>
                                                </td>
                                                <td>{user.department || "-"}</td>
                                                <td>
                                                    <span className={`badge ${user.status === "Active" ? "text-bg-success" : "text-bg-secondary"}`}>
                                                        {user.status || "Active"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEdit(user._id)}
                                                            title="Edit user"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => setDeleteConfirm(user)}
                                                            title="Delete user"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;