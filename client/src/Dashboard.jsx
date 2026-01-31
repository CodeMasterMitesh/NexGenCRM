import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard container-fluid py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h1 className="page-title mb-1">Dashboard</h1>
                    <p className="text-muted mb-0">Overview of your CRM performance</p>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-xl-3">
                    <StatsCard title="Total Customers" value="1,238" icon="👥" color="#667eea" />
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <StatsCard title="Active Leads" value="567" icon="🎯" color="#f093fb" />
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <StatsCard title="Total Sales" value="₹89,450" icon="💰" color="#4facfe" />
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <StatsCard title="Pending Tasks" value="23" icon="📋" color="#fa709a" />
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pb-0">
                            <h5 className="mb-0">Recent Leads</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group list-group-flush">
                                <LeadItem name="John Doe" company="Tech Corp" status="Hot" />
                                <LeadItem name="Jane Smith" company="ABC Ltd" status="Warm" />
                                <LeadItem name="Mike Johnson" company="XYZ Inc" status="Cold" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pb-0">
                            <h5 className="mb-0">Recent Activity</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group list-group-flush">
                                <ActivityItem action="New lead added" time="2 hours ago" />
                                <ActivityItem action="Deal closed with ABC Ltd" time="5 hours ago" />
                                <ActivityItem action="Follow-up call scheduled" time="Yesterday" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stats card component - shows numbers
const StatsCard = ({ title, value, icon, color }) => {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
                <div className="stats-icon" style={{ color }}>
                    {icon}
                </div>
                <div>
                    <h3 className="mb-1">{value}</h3>
                    <p className="text-muted mb-0">{title}</p>
                </div>
            </div>
        </div>
    );
};

// Lead item component
const LeadItem = ({ name, company, status }) => {
    return (
        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
            <div>
                <strong>{name}</strong>
                <div className="text-muted small">{company}</div>
            </div>
            <span className={`badge ${status.toLowerCase() === "hot" ? "text-bg-danger" : status.toLowerCase() === "warm" ? "text-bg-warning" : "text-bg-info"}`}>
                {status}
            </span>
        </div>
    );
};

// Activity item component
const ActivityItem = ({ action, time }) => {
    return (
        <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
            <span>{action}</span>
            <span className="text-muted small">{time}</span>
        </div>
    );
};

export default Dashboard;