import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
// import { EventsBtn } from "./compenents/Events";
// import {Greeting} from "./compenents/EventProps";
import {EventPropagation} from "./compenents/EventPropagation";
import { StateManagement } from "./compenents/StateManagement";
const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE_URL = "http://localhost:5500";

    useEffect(() => {
        let isMounted = true;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/users`);
                if (!response.ok) {
                    throw new Error("Failed to load users");
                }
                const data = await response.json();
                if (isMounted) {
                    setUsers(data);
                    setError("");
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Unable to load users");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Users Management</h1>
                    <p className="text-muted mb-0">Manage your team and roles</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <StateManagement className="btn btn-outline-secondary" />
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/add-user")}
                    >
                        + Add User
                    </button>
                </div>
            </div>
            {/* <EventsBtn /> */}
            {/* <Greeting /> */}
            {/* <EventPropagation /> */}
            {/* Users table */}
            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    {loading && (
                        <div className="p-4 text-center text-muted">Loading users...</div>
                    )}
                    {error && !loading && (
                        <div className="p-4 text-center text-danger">{error}</div>
                    )}
                    {!loading && !error && (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>Profile Photo</th>
                                        <th>Role</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="text-center text-muted py-4">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.mobile}</td>
                                                <td>{user.profilePhoto || "-"}</td>
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
                                                    <div className="btn-group" role="group">
                                                        <button className="btn btn-sm btn-outline-primary">Edit</button>
                                                        <button className="btn btn-sm btn-outline-danger">Delete</button>
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