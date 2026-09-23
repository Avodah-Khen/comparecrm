import { NavLink } from "react-router-dom";

// Static navigation config — safe to hardcode (UI labels, not business data).
const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/customer-crm", label: "Customer CRM", icon: "👤" },
  { to: "/developer-crm", label: "Developer CRM", icon: "🏢" },
  { to: "/site-visits", label: "Site Visits", icon: "📅" },
  { to: "/sales-team", label: "Sales Team", icon: "👥" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">C</span>
        CompareCRM
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
