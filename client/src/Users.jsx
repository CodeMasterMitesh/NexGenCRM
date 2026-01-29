import { useNavigate } from "react-router-dom";
import "./Style.css";
// import { EventsBtn } from "./compenents/Events";
// import {Greeting} from "./compenents/EventProps";
import {EventPropagation} from "./compenents/EventPropagation";
const Users = () => {
    const navigate = useNavigate();

    // Sample users data
    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Sales" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Manager" },
        { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Sales" },
    ];

    return (
        <div className="comman-page">
            {/* Page title */}
            <div className="page-header">
                <h1 className="page-title">Users Management</h1>
                <button 
                    className="add-btn"
                    onClick={() => navigate("/add-user")}
                >
                    + Add User
                </button>
            </div>
            {/* <EventsBtn /> */}
            {/* <Greeting /> */}
            {/* <EventPropagation /> */}
            {/* Users table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="role-badge">{user.role}</span>
                                </td>
                                <td>
                                    <button className="action-btn edit">Edit</button>
                                    <button className="action-btn delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;