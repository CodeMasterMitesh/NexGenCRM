import "./Style.css";

const Leads = () => {
    // Sample users data
    const leads = [
        { id: 1, name: "John Doe", email: "john@example.com", source: "Facebook" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", source: "Website" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", source: "Cold Call" },
        { id: 4, name: "Sarah Williams", email: "sarah@example.com", source: "Referral" },
    ];

    return (
        <div className="comman-page">
            {/* Page title */}
            <div className="page-header">
                <h1 className="page-title">Leads Management</h1>
                <button className="add-btn">+ Add Lead</button>
            </div>
            
            {/* Leads table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Source</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td>{lead.id}</td>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>
                                    <span className="source-badge">{lead.source}</span>
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

export default Leads;