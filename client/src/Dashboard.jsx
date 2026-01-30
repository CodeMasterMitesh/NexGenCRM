import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            {/* Page title */}
            <h1 className="page-title">Dashboard</h1>
            
            {/* Stats cards section */}
            <div className="stats-cards">
                <StatsCard 
                    title="Total Customers" 
                    value="1,238" 
                    icon="👥" 
                    color="#667eea" 
                />
                <StatsCard 
                    title="Active Leads" 
                    value="567" 
                    icon="🎯" 
                    color="#f093fb" 
                />
                <StatsCard 
                    title="Total Sales" 
                    value="$89,450" 
                    icon="💰" 
                    color="#4facfe" 
                />
                <StatsCard 
                    title="Pending Tasks" 
                    value="23" 
                    icon="📋" 
                    color="#fa709a" 
                />
            </div>

            {/* Recent activity section */}
            <div className="recent-section">
                <div className="recent-leads">
                    <h2>Recent Leads</h2>
                    <div className="list-card">
                        <LeadItem name="John Doe" company="Tech Corp" status="Hot" />
                        <LeadItem name="Jane Smith" company="ABC Ltd" status="Warm" />
                        <LeadItem name="Mike Johnson" company="XYZ Inc" status="Cold" />
                    </div>
                </div>
                
                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="list-card">
                        <ActivityItem 
                            action="New lead added" 
                            time="2 hours ago" 
                        />
                        <ActivityItem 
                            action="Deal closed with ABC Ltd" 
                            time="5 hours ago" 
                        />
                        <ActivityItem 
                            action="Follow-up call scheduled" 
                            time="Yesterday" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stats card component - shows numbers
const StatsCard = ({ title, value, icon, color }) => {
    return (
        <div className="stats-card" style={{ borderLeftColor: color }}>
            <div className="stats-icon">{icon}</div>
            <div className="stats-info">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );
};

// Lead item component
const LeadItem = ({ name, company, status }) => {
    return (
        <div className="lead-item">
            <div>
                <strong>{name}</strong>
                <p>{company}</p>
            </div>
            <span className={`status ${status.toLowerCase()}`}>{status}</span>
        </div>
    );
};

// Activity item component
const ActivityItem = ({ action, time }) => {
    return (
        <div className="activity-item">
            <p>{action}</p>
            <span className="time">{time}</span>
        </div>
    );
};

export default Dashboard;