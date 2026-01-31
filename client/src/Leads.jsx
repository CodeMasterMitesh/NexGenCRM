import { useNavigate } from "react-router-dom";
import "./Style.css";

const Leads = () => {
    const navigate = useNavigate();

    // Sample leads data
    const leads = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            mobile: "+1 555-102-3344",
            company: "NovaTech",
            source: "Facebook",
            status: "New",
            owner: "Alicia Patel",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            mobile: "+1 555-221-5566",
            company: "BrightOps",
            source: "Website",
            status: "Contacted",
            owner: "Rahul Verma",
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike@example.com",
            mobile: "+1 555-889-1122",
            company: "CloudBridge",
            source: "Cold Call",
            status: "Qualified",
            owner: "Sarah Lee",
        },
        {
            id: 4,
            name: "Sarah Williams",
            email: "sarah@example.com",
            mobile: "+1 555-908-3333",
            company: "MarketFlow",
            source: "Referral",
            status: "Converted",
            owner: "Daniel Park",
        },
    ];

    return (
        <div className="comman-page container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Leads Management</h1>
                    <p className="text-muted mb-0">Track and manage lead pipeline</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/add-lead")}>
                    + Add Lead
                </button>
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
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Company</th>
                            <th>Source</th>
                            <th>Status</th>
                            <th>Owner</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td>{lead.id}</td>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.mobile}</td>
                                <td>{lead.company}</td>
                                <td>
                                    <span className="badge text-bg-info">{lead.source}</span>
                                </td>
                                <td>
                                    <span className="badge text-bg-primary">{lead.status}</span>
                                </td>
                                <td>{lead.owner}</td>
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

export default Leads;