import "./Dashboard.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./compenents/auth/AuthContext.jsx";

const API_BASE_URL = "http://localhost:5500";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`, { headers: authHeaders });
        if (!response.ok) throw new Error("Failed to load dashboard");
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  const leadPipeline = useMemo(() => {
    if (!summary) return [];
    return [
      { title: "New Leads", value: summary.stageCounts?.new || 0, className: "lead-band blue" },
      { title: "Qualified", value: summary.stageCounts?.qualified || 0, className: "lead-band cyan" },
      { title: "Won", value: summary.stageCounts?.won || 0, className: "lead-band green" },
    ];
  }, [summary]);

  if (loading) {
    return <div className="container-fluid py-4 text-muted">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container-fluid py-4"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="dashboard-page container-fluid py-4">
      <div className="dashboard-top mb-4">
        <div>
          <h1 className="mb-1">Dashboard</h1>
          <p className="text-muted mb-0">Live CRM snapshot with lead, inquiry and revenue insights</p>
        </div>
        <button className="btn btn-success" onClick={() => navigate("/add-lead")}>+ Add Lead</button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <div className="pipeline-wrap">
            {leadPipeline.map((item) => (
              <div key={item.title} className={item.className}>
                <div className="lead-title">{item.title}</div>
                <div className="lead-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="side-card">
            <h5>Follow-up Reminders</h5>
            <ReminderList
              rows={summary?.leadFollowups?.today || []}
              emptyLabel="No lead follow-ups for today"
              onOpen={(row) => navigate(`/lead-followup/${row.leadId}`)}
              type="lead"
            />
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-xl-3"><Kpi title="Customers" value={summary?.totalCustomers || 0} /></div>
        <div className="col-12 col-md-6 col-xl-3"><Kpi title="Active Leads" value={summary?.stageCounts?.active || 0} /></div>
        <div className="col-12 col-md-6 col-xl-3"><Kpi title="Pending Tasks" value={summary?.pendingTasks || 0} /></div>
        <div className="col-12 col-md-6 col-xl-3"><Kpi title="Converted Revenue" value={`INR ${(summary?.revenue?.convertedLeadRevenue || 0).toLocaleString("en-IN")}`} /></div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="panel-card">
            <h5>Lead Follow-up Buckets</h5>
            <BucketRow label="Today" value={summary?.leadFollowups?.today?.length || 0} />
            <BucketRow label="Overdue" value={summary?.leadFollowups?.overdue?.length || 0} />
            <BucketRow label="Upcoming" value={summary?.leadFollowups?.upcoming?.length || 0} />
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="panel-card">
            <h5>Inquiry Follow-up Buckets</h5>
            <BucketRow label="Today" value={summary?.inquiryFollowups?.today?.length || 0} />
            <BucketRow label="Overdue" value={summary?.inquiryFollowups?.overdue?.length || 0} />
            <BucketRow label="Upcoming" value={summary?.inquiryFollowups?.upcoming?.length || 0} />
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="panel-card">
            <h5>Commercial Overview</h5>
            <BucketRow label="Quotation Value" value={`INR ${(summary?.revenue?.quotationValue || 0).toLocaleString("en-IN")}`} />
            <BucketRow label="Proforma Value" value={`INR ${(summary?.revenue?.proformaValue || 0).toLocaleString("en-IN")}`} />
            <BucketRow label="Paid Proforma" value={summary?.proforma?.paid || 0} />
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12 col-lg-6">
          <div className="side-card">
            <h5>Overdue Lead Follow-ups</h5>
            <ReminderList
              rows={summary?.leadFollowups?.overdue || []}
              emptyLabel="No overdue lead follow-ups"
              onOpen={(row) => navigate(`/lead-followup/${row.leadId}`)}
              type="lead"
            />
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="side-card">
            <h5>Today Inquiry Follow-ups</h5>
            <ReminderList
              rows={summary?.inquiryFollowups?.today || []}
              emptyLabel="No inquiry follow-ups for today"
              onOpen={(row) => navigate(`/inquiry-followup/${row.inquiryId}`)}
              type="inquiry"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Kpi = ({ title, value }) => (
  <div className="kpi-card">
    <div className="kpi-value">{value}</div>
    <div className="kpi-label">{title}</div>
  </div>
);

const BucketRow = ({ label, value }) => (
  <div className="bucket-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const ReminderList = ({ rows, emptyLabel, onOpen, type }) => {
  if (!rows.length) {
    return <div className="text-muted small">{emptyLabel}</div>;
  }

  return (
    <div className="reminder-list">
      {rows.slice(0, 5).map((row, idx) => (
        <button key={idx} type="button" className="reminder-item" onClick={() => onOpen(row)}>
          <div>
            <div className="fw-semibold">{type === "lead" ? row.leadName : row.sourceName}</div>
            <div className="small text-muted">{row.mobile || "-"} | {row.assignedTo || "-"}</div>
          </div>
          <span className="badge text-bg-warning">{row.priority || row.status || "Open"}</span>
        </button>
      ))}
    </div>
  );
};

export default Dashboard;
