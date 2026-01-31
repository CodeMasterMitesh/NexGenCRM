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
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Lead Sources Management</h1>
                    <p className="text-muted mb-0">Manage lead acquisition channels</p>
                </div>
                <button className="btn btn-primary">+ Add Lead Source</button>
            </div>
            
            {/* Leads table */}
            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
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
                                    <span className="badge text-bg-info">{leadSource.description}</span>
                                </td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-sm btn-outline-primary">Edit</button>
                                        <button className="btn btn-sm btn-outline-danger">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadSource;