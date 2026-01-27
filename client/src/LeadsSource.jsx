import "./Style.css";

const LeadSource = () => {
    // Sample users data
    const leadSources = [
        { id: 1, name: "Facebook", description: "Facebook" },
        { id: 2, name: "Website", description: "Website" },
        { id: 3, name: "Cold Call", description: "Cold Call" },
        { id: 4, name: "Referral", description: "Referral" },
    ];

    return (
        <div className="comman-page">
            {/* Page title */}
            <div className="page-header">
                <h1 className="page-title">Lead Sources Management</h1>
                <button className="add-btn">+ Add Lead Source</button>
            </div>
            
            {/* Leads table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leadSources.map(leadSource => (
                            <tr key={leadSource.id}>
                                <td>{leadSource.id}</td>
                                <td>{leadSource.name}</td>
                                <td>
                                    <span className="source-badge">{leadSource.description}</span>
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

export default LeadSource;