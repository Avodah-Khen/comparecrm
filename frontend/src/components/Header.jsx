import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="header">
      <div />
      <div className="header-user">
        <Link to="/profile" className="header-user-link">
          <span className="header-avatar">{user?.email?.charAt(0).toUpperCase()}</span>
          {user?.email}
        </Link>
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
