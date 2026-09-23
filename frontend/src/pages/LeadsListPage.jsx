// pages/LeadsListPage.jsx — shared Lead list/search/filter view, reused by
// Customer CRM and Developer CRM so the Lead model isn't duplicated.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeads } from "../services/leadService";
import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const STAGE_OPTIONS = ["new", "contacted", "qualified", "converted", "rejected"];

export default function LeadsListPage({ title, leadTypes, showTypeFilter = false }) {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [leadType, setLeadType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      getLeads({ search, stage, leadType: leadType || leadTypes.join(","), page })
        .then((data) => {
          setLeads(data.leads);
          setTotal(data.total);
          setPages(data.pages);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, stage, leadType, page]);

  useEffect(() => {
    setPage(1);
  }, [search, stage, leadType]);

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "source", header: "Source" },
    ...(showTypeFilter ? [{ key: "leadType", header: "Type", render: (row) => <StatusBadge value={row.leadType} type="leadType" /> }] : []),
    { key: "property", header: "Property", render: (row) => row.propertyTitle || "—" },
    { key: "stage", header: "Stage", render: (row) => <StatusBadge value={row.stage} type="stage" /> },
    { key: "assignedTo", header: "Assigned To", render: (row) => row.assignee?.email || "Unassigned" },
    { key: "createdAt", header: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or phone..." />

        <select className="input" style={{ maxWidth: 180 }} value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">All Stages</option>
          {STAGE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {showTypeFilter && (
          <select className="input" style={{ maxWidth: 180 }} value={leadType} onChange={(e) => setLeadType(e.target.value)}>
            <option value="">All Types</option>
            {leadTypes.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={leads}
            onRowClick={(row) => navigate(`/leads/${row.id}`)}
            emptyMessage="No leads match your filters."
          />

          {total > 0 && (
            <div className="pagination">
              <span>
                Page {page} of {pages} · {total} leads
              </span>
              <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <button className="btn btn-ghost btn-sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
