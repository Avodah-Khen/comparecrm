import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSalesTeam, createSalesTeamMember, updateSalesTeamMember } from "../services/salesTeamService";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const ROLE_OPTIONS = ["admin", "sales_manager", "sales_rep"];

export default function SalesTeam() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sales_rep");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    getSalesTeam()
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRoleChange(id, newRole) {
    if (id === user.id && !window.confirm("This is your own account. Change your role anyway?")) {
      setUsers((prev) => [...prev]); // reset the <select> back to its current value
      return;
    }
    try {
      await updateSalesTeamMember(id, { role: newRole });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleActive(member) {
    if (member.id === user.id && !window.confirm("This is your own account. Deactivate it anyway?")) return;
    try {
      await updateSalesTeamMember(member.id, { isActive: !member.isActive });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSalesTeamMember({ email, password, role });
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
    setEmail("");
    setPassword("");
    setRole("sales_rep");
  }

  const columns = [
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (member) =>
        isAdmin ? (
          <select className="input" style={{ maxWidth: 160 }} value={member.role} onChange={(e) => handleRoleChange(member.id, e.target.value)}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r.replace("_", " ")}
              </option>
            ))}
          </select>
        ) : (
          <StatusBadge value={member.role} type="role" />
        ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (member) =>
        isAdmin ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleToggleActive(member)}>
            <StatusBadge value={member.isActive} type="active" />
          </button>
        ) : (
          <StatusBadge value={member.isActive} type="active" />
        ),
    },
    { key: "createdAt", header: "Joined", render: (member) => new Date(member.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Sales Team</h1>
        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Team Member
          </button>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <DataTable columns={columns} data={users} emptyMessage="No sales team members yet." />
      )}

      {showModal && (
        <Modal title="Add Team Member" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="newEmail">Email</label>
              <input id="newEmail" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Password</label>
              <input
                id="newPassword"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newRole">Role</label>
              <select id="newRole" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Adding..." : "Add Team Member"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
