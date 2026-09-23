import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1 className="page-title">Profile</h1>

      <Card title="Account Information">
        <dl className="info-grid">
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          <div><dt>Role</dt><dd><StatusBadge value={user.role} type="role" /></dd></div>
          <div><dt>Status</dt><dd><StatusBadge value={user.isActive} type="active" /></dd></div>
          <div><dt>Member Since</dt><dd>{new Date(user.createdAt).toLocaleDateString()}</dd></div>
        </dl>
      </Card>
    </div>
  );
}
