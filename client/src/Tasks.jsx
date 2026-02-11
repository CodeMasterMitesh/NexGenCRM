import { useEffect, useState } from "react";
import { useAuth } from "./compenents/auth/AuthContext.jsx";
import "./Style.css";

const Tasks = () => {
    const { token, user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Pending",
        priority: "",
        dueDate: "",
        assignedTo: "",
    });

    const API_BASE_URL = "http://localhost:5500";
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/tasks`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load tasks");
            const data = await response.json();
            setTasks(data);
            setError("");
        } catch (err) {
            setError(err.message || "Unable to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, { headers: authHeaders });
            if (!response.ok) throw new Error("Failed to load employees");
            const data = await response.json();
            const staff = (data || []).filter((item) => item.type !== "Lead");
            setEmployees(staff);
        } catch {
            setEmployees([]);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                createdBy: user?.name || "",
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
            };
            const response = await fetch(`${API_BASE_URL}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || "Failed to create task");
            }
            setFormData({
                title: "",
                description: "",
                status: "Pending",
                priority: "",
                dueDate: "",
                assignedTo: "",
            });
            fetchTasks();
        } catch (err) {
            setError(err.message || "Unable to create task");
        }
    };

    const handleUpdate = async (taskId, updates) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update task");
            fetchTasks();
        } catch (err) {
            setError(err.message || "Unable to update task");
        }
    };

    const handleDelete = async (taskId) => {
        const ok = window.confirm("Delete this task?");
        if (!ok) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            if (!response.ok) throw new Error("Failed to delete task");
            fetchTasks();
        } catch (err) {
            setError(err.message || "Unable to delete task");
        }
    };

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Tasks</h1>
                    <p className="text-muted mb-0">Track daily work and follow-ups</p>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <form onSubmit={handleCreate} className="row g-3">
                        <div className="col-12 col-md-4">
                            <label className="form-label">Task Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label">Assigned To</label>
                            <select
                                name="assignedTo"
                                className="form-select"
                                value={formData.assignedTo}
                                onChange={handleChange}
                            >
                                <option value="">Select employee</option>
                                {employees.map((employee) => (
                                    <option key={employee._id} value={employee.name}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                className="form-control"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label">Priority</label>
                            <select
                                name="priority"
                                className="form-select"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="">Select priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                className="form-select"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-8">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                name="description"
                                className="form-control"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" type="submit">Add Task</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="p-4 text-center text-muted">Loading tasks...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Assigned</th>
                                        <th>Due Date</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center text-muted py-4">No tasks yet.</td>
                                        </tr>
                                    ) : (
                                        tasks.map((task) => (
                                            <tr key={task._id}>
                                                <td>
                                                    <strong>{task.title}</strong>
                                                    {task.description && <div className="text-muted small">{task.description}</div>}
                                                </td>
                                                <td>{task.assignedTo || "-"}</td>
                                                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                                                <td>{task.priority || "-"}</td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={task.status}
                                                        onChange={(e) => handleUpdate(task._id, { status: e.target.value })}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(task._id)}>
                                                        Delete
                                                    </button>
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

export default Tasks;
