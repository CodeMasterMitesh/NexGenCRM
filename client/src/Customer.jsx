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
        <div className="comman-page">
            {/* Page title */}
            <div className="page-header">
                <h1 className="page-title">Customers Management</h1>
                <button className="add-btn">+ Add Customer</button>
            </div>
            
            {/* Customers table */}
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
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>
                                    <span className="source-badge">{customer.source}</span>
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

export default Customers;