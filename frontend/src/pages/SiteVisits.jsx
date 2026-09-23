import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSiteVisits, createSiteVisit, updateSiteVisit } from "../services/siteVisitService";
import { getLeads } from "../services/leadService";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const STATUS_OPTIONS = ["scheduled", "completed", "cancelled"];

export default function SiteVisits() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadResults, setLeadResults] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [visitDate, setVisitDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    getSiteVisits()
      .then((data) => setVisits(data.siteVisits))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!leadSearch) {
      setLeadResults([]);
      return;
    }
    const timer = setTimeout(() => {
      getLeads({ search: leadSearch, limit: 5 })
        .then((data) => setLeadResults(data.leads))
        .catch(() => setLeadResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [leadSearch]);

  async function handleStatusChange(visitId, status) {
    try {
      await updateSiteVisit(visitId, { status });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!selectedLead || !visitDate) return;
    setSubmitting(true);
    try {
      await createSiteVisit({ leadId: selectedLead.id, scheduledAt: visitDate });
      closeModal();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setLeadSearch("");
    setLeadResults([]);
    setSelectedLead(null);
    setVisitDate("");
  }

  const columns = [
    { key: "leadName", header: "Lead", render: (row) => row.lead?.name || "—" },
    { key: "phone", header: "Phone", render: (row) => row.lead?.phone || "—" },
    { key: "assignedTo", header: "Assigned To", render: (row) => row.crmUser?.email || "—" },
    { key: "scheduledAt", header: "Date & Time", render: (row) => new Date(row.scheduledAt).toLocaleString() },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <select
          className="input"
          style={{ maxWidth: 140 }}
          value={row.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
    { key: "createdAt", header: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Site Visits</h1>
        <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Schedule Visit
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <DataTable
          columns={columns}
          data={visits}
          onRowClick={(row) => row.lead?.id && navigate(`/leads/${row.lead.id}`)}
          emptyMessage="No site visits scheduled yet."
        />
      )}

      {showModal && (
        <Modal title="Schedule Site Visit" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Lead</label>
              {selectedLead ? (
                <div className="input" style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{selectedLead.name}</span>
                  <button type="button" className="btn-ghost btn btn-sm" onClick={() => setSelectedLead(null)}>
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search leads by name, email or phone..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                  />
                  {leadResults.length > 0 && (
                    <ul className="simple-list mt-16">
                      {leadResults.map((lead) => (
                        <li key={lead.id} style={{ cursor: "pointer" }} onClick={() => setSelectedLead(lead)}>
                          <span>{lead.name}</span>
                          <span className="text-muted">{lead.phone}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>

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

            <button type="submit" className="btn btn-primary" disabled={!selectedLead || submitting}>
              {submitting ? "Scheduling..." : "Schedule Visit"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
