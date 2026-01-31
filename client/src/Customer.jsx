import "./Style.css";

const Customers = () => {
    // Sample customers data
    const customers = [
        { id: 1, name: "John Doe", email: "john@example.com", source: "Facebook" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", source: "Website" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", source: "Cold Call" },
        { id: 4, name: "Sarah Williams", email: "sarah@example.com", source: "Referral" },
    ];

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Customers Management</h1>
                    <p className="text-muted mb-0">Maintain your customer directory</p>
                </div>
                <button className="btn btn-primary">+ Add Customer</button>
            </div>
            
            {/* Customers table */}
            <div className="card border-0 shadow-sm table-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped align-middle mb-0">
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
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>
                                    <span className="badge text-bg-info">{customer.source}</span>
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

export default Customers;