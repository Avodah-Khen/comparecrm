import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLead, updateLead } from "../services/leadService";
import { addActivity } from "../services/activityService";
import { createSiteVisit } from "../services/siteVisitService";
import { getSalesTeam } from "../services/salesTeamService";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const STAGE_OPTIONS = ["new", "contacted", "qualified", "converted", "rejected"];
const ACTIVITY_TYPES = ["note", "call", "email", "site_visit", "stage_change"];

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [salesTeam, setSalesTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingField, setSavingField] = useState("");

  const [activityType, setActivityType] = useState(ACTIVITY_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [addingActivity, setAddingActivity] = useState(false);

  const [visitDate, setVisitDate] = useState("");
  const [schedulingVisit, setSchedulingVisit] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([getLead(id), getSalesTeam()])
      .then(([leadData, teamData]) => {
        setLead(leadData.lead);
        setSalesTeam(teamData.users);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStageChange(e) {
    const stage = e.target.value;
    setSavingField("stage");
    try {
      await updateLead(id, { stage });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingField("");
    }
  }

  async function handleAssignChange(e) {
    const assignedTo = e.target.value || null;
    setSavingField("assignedTo");
    try {
      await updateLead(id, { assignedTo });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingField("");
    }
  }

  async function handleAddActivity(e) {
    e.preventDefault();
    setAddingActivity(true);
    try {
      await addActivity({ leadId: id, activityType, notes });
      setNotes("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingActivity(false);
    }
  }

  async function handleScheduleVisit(e) {
    e.preventDefault();
    if (!visitDate) return;
    setSchedulingVisit(true);
    try {
      await createSiteVisit({ leadId: id, scheduledAt: visitDate });
      setVisitDate("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSchedulingVisit(false);
    }
  }

  if (loading) return <LoadingState />;
  if (error && !lead) return <ErrorState message={error} />;
  if (!lead) return <ErrorState message="Lead not found." />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{lead.name}</h1>
        <StatusBadge value={lead.leadType} type="leadType" />
      </div>

      {error && <ErrorState message={error} />}

      <div className="detail-grid">
        <div>
          <Card title="Lead Information">
            <dl className="info-grid">
              <div><dt>Email</dt><dd>{lead.email}</dd></div>
              <div><dt>Phone</dt><dd>{lead.phone}</dd></div>
              <div><dt>Source</dt><dd>{lead.source}</dd></div>
              <div><dt>Property</dt><dd>{lead.propertyTitle || lead.propertyId || "—"}</dd></div>
              <div><dt>Created</dt><dd>{new Date(lead.createdAt).toLocaleString()}</dd></div>
              <div><dt>Last Updated</dt><dd>{new Date(lead.updatedAt).toLocaleString()}</dd></div>
            </dl>
          </Card>

          <Card title="Manage Lead" className="mt-16">
            <div className="form-group">
              <label htmlFor="stage">Stage</label>
              <select id="stage" className="input" value={lead.stage} disabled={savingField === "stage"} onChange={handleStageChange}>
                {STAGE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignedTo">Assigned To</label>
              <select
                id="assignedTo"
                className="input"
                value={lead.assignedTo || ""}
                disabled={savingField === "assignedTo"}
                onChange={handleAssignChange}
              >
                <option value="">Unassigned</option>
                {salesTeam.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.email}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          <Card title="Schedule Site Visit" className="mt-16">
            <form onSubmit={handleScheduleVisit}>
              <div className="form-group">
                <label htmlFor="visitDate">Date &amp; Time</label>
                <input
                  id="visitDate"
                  type="datetime-local"
                  className="input"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={schedulingVisit}>
                {schedulingVisit ? "Scheduling..." : "Schedule Visit"}
              </button>
            </form>

            {lead.siteVisits.length > 0 && (
              <ul className="simple-list mt-16">
                {lead.siteVisits.map((visit) => (
                  <li key={visit.id}>
                    <span>{new Date(visit.scheduledAt).toLocaleString()}</span>
                    <StatusBadge value={visit.status} type="stage" />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div>
          <Card title="Add Activity / Note">
            <form onSubmit={handleAddActivity}>
              <div className="form-group">
                <label htmlFor="activityType">Type</label>
                <select id="activityType" className="input" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  className="input"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={addingActivity}>
                {addingActivity ? "Adding..." : "Add Activity"}
              </button>
            </form>
          </Card>

          <Card title="Activity Timeline" className="mt-16">
            {lead.activities.length === 0 ? (
              <EmptyState message="No activity recorded yet." />
            ) : (
              <div className="timeline">
                {lead.activities.map((activity) => (
                  <div key={activity.id} className="timeline-item">
                    <strong>{activity.activityType.replace("_", " ")}</strong>
                    {activity.notes && <p>{activity.notes}</p>}
                    <div className="timeline-meta">
                      {activity.crmUser.email} · {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <p className="mt-16">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }}>← Back to leads</a>
      </p>
    </div>
  );
}
