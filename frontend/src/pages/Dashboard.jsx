import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/dashboardService";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const STAGE_LABELS = { new: "New", contacted: "Contacted", qualified: "Qualified", converted: "Converted", rejected: "Rejected" };
const TYPE_LABELS = { customer: "Customer", developer: "Developer", broker: "Broker", builder: "Builder" };

function Distribution({ counts, labels }) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  if (total === 0) return <EmptyState message="No data yet." />;

  return (
    <div className="distribution">
      {Object.entries(counts).map(([key, count]) => (
        <div key={key} className="distribution-row">
          <span>{labels[key] || key}</span>
          <div className="distribution-bar-track">
            <div className="distribution-bar" style={{ width: `${(count / total) * 100}%` }} />
          </div>
          <span>{count}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const statCards = [
    { label: "Total Leads", value: stats.totalLeads },
    { label: "New", value: stats.byStage.new },
    { label: "Contacted", value: stats.byStage.contacted },
    { label: "Qualified", value: stats.byStage.qualified },
    { label: "Converted", value: stats.byStage.converted },
    { label: "Site Visits", value: stats.totalSiteVisits },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="stat-grid">
        {statCards.map((s) => (
          <Card key={s.label} className="stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card title="Leads by Stage">
          <Distribution counts={stats.byStage} labels={STAGE_LABELS} />
        </Card>
        <Card title="Leads by Type">
          <Distribution counts={stats.byType} labels={TYPE_LABELS} />
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card title="Recent Leads">
          {stats.recentLeads.length === 0 ? (
            <EmptyState message="No leads yet." />
          ) : (
            <ul className="simple-list">
              {stats.recentLeads.map((lead) => (
                <li key={lead.id}>
                  <Link to={`/leads/${lead.id}`}>{lead.name}</Link>
                  <StatusBadge value={lead.stage} type="stage" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent Activities">
          {stats.recentActivities.length === 0 ? (
            <EmptyState message="No activity yet." />
          ) : (
            <ul className="simple-list">
              {stats.recentActivities.map((activity) => (
                <li key={activity.id}>
                  <Link to={`/leads/${activity.lead.id}`}>{activity.lead.name}</Link>
                  <span className="text-muted">{activity.activityType}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Upcoming Site Visits">
          {stats.upcomingSiteVisits.length === 0 ? (
            <EmptyState message="No upcoming visits." />
          ) : (
            <ul className="simple-list">
              {stats.upcomingSiteVisits.map((visit) => (
                <li key={visit.id}>
                  <Link to={`/leads/${visit.lead.id}`}>{visit.lead.name}</Link>
                  <span className="text-muted">{new Date(visit.scheduledAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
