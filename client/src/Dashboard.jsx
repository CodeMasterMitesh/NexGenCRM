import "./Dashboard.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [followupSummary, setFollowupSummary] = useState({ todayFollowups: [], overdueFollowups: [], upcomingFollowups: [] });
    const [stats, setStats] = useState({ totalCustomers: 0, activeLeads: 0, totalSales: 0, pendingTasks: 0 });
    const [loading, setLoading] = useState(true);
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        const fetchFollowupSummary = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5500/api/leads/dashboard/followups/summary", {
                    headers: authHeaders,
                });
                if (!response.ok) throw new Error("Failed to load followup summary");
                const data = await response.json();
                setFollowupSummary(data);
            } catch (err) {
                setFollowupSummary({ todayFollowups: [], overdueFollowups: [], upcomingFollowups: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchFollowupSummary();
    }, []);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch("http://localhost:5500/api/dashboard/summary", {
                    headers: authHeaders,
                });
                if (!response.ok) throw new Error("Failed to load dashboard summary");
                const data = await response.json();
                setStats({
                    totalCustomers: data.totalCustomers || 0,
                    activeLeads: data.activeLeads || 0,
                    totalSales: data.totalSales || 0,
                    pendingTasks: data.pendingTasks || 0,
                });
            } catch {
                setStats({ totalCustomers: 0, activeLeads: 0, totalSales: 0, pendingTasks: 0 });
            }
        };
        fetchSummary();
    }, [token]);

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
                    <StatsCard title="Total Customers" value={stats.totalCustomers} icon="👥" color="#667eea" />
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <StatsCard title="Active Leads" value={stats.activeLeads} icon="🎯" color="#f093fb" />
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <StatsCard title="Total Sales" value={`₹${stats.totalSales.toLocaleString()}`} icon="💰" color="#4facfe" />
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                    <StatsCard title="Pending Tasks" value={stats.pendingTasks} icon="📋" color="#fa709a" />
                </div>
            </div>


            <div className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pb-0">
                            <h5 className="mb-0">Today's Followup Leads</h5>
                        </div>
                        <div className="card-body">
                            {loading ? <div>Loading...</div> : (
                                <div className="list-group list-group-flush">
                                    {followupSummary.todayFollowups.length === 0 && <div className="text-muted">No follow-ups for today.</div>}
                                    {followupSummary.todayFollowups.map((item, idx) => (
                                        <LeadFollowupItem key={idx} lead={item.lead} followUp={item.followUp} onOpen={() => navigate(`/lead-followup/${item.lead._id}`)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pb-0">
                            <h5 className="mb-0">Overdue Followup Leads</h5>
                        </div>
                        <div className="card-body">
                            {loading ? <div>Loading...</div> : (
                                <div className="list-group list-group-flush">
                                    {followupSummary.overdueFollowups.length === 0 && <div className="text-muted">No overdue follow-ups.</div>}
                                    {followupSummary.overdueFollowups.map((item, idx) => (
                                        <LeadFollowupItem key={idx} lead={item.lead} followUp={item.followUp} onOpen={() => navigate(`/lead-followup/${item.lead._id}`)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pb-0">
                            <h5 className="mb-0">Upcoming Followup Leads</h5>
                        </div>
                        <div className="card-body">
                            {loading ? <div>Loading...</div> : (
                                <div className="list-group list-group-flush">
                                    {followupSummary.upcomingFollowups.length === 0 && <div className="text-muted">No upcoming follow-ups.</div>}
                                    {followupSummary.upcomingFollowups.map((item, idx) => (
                                        <LeadFollowupItem key={idx} lead={item.lead} followUp={item.followUp} onOpen={() => navigate(`/lead-followup/${item.lead._id}`)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Lead followup item component
const LeadFollowupItem = ({ lead, followUp, onOpen }) => (
    <button type="button" className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 text-start bg-transparent" onClick={onOpen}>
        <div>
            <strong>{lead.name}</strong>
            <div className="text-muted small">{lead.contactPerson || "-"} | {lead.mobile}</div>
            <div className="text-muted small">{new Date(followUp.date).toLocaleString()} - {followUp.note}</div>
            <div className="text-muted small">Priority: {followUp.priority || lead.priority || "-"} | Assigned: {followUp.assignTo || lead.assignedTo || "-"}</div>
            <div className="text-muted small">Enter By: {followUp.enterBy || lead.enteredBy || "-"}</div>
        </div>
        <span className={`badge ${followUp.status === "Overdue" ? "text-bg-danger" : followUp.status === "Scheduled" ? "text-bg-warning" : "text-bg-success"}`}>
            {followUp.status}
        </span>
    </button>
);

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