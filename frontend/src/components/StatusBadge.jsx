// components/StatusBadge.jsx — colored badges for lead stage, CrmUser role,
// and active/inactive status. Colors are static UI config, not business data.
const STAGE_STYLES = {
  new: "badge-blue",
  contacted: "badge-amber",
  qualified: "badge-purple",
  converted: "badge-green",
  rejected: "badge-red",
};

const ROLE_LABELS = {
  admin: "Admin",
  sales_manager: "Sales Manager",
  sales_rep: "Sales Rep",
};

const TYPE_LABELS = {
  customer: "Customer",
  developer: "Developer",
  broker: "Broker",
  builder: "Builder",
};

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export default function StatusBadge({ value, type = "stage" }) {
  if (type === "stage") {
    return <span className={`badge ${STAGE_STYLES[value] || "badge-gray"}`}>{capitalize(value)}</span>;
  }
  if (type === "role") {
    return <span className="badge badge-gray">{ROLE_LABELS[value] || value}</span>;
  }
  if (type === "leadType") {
    return <span className="badge badge-indigo">{TYPE_LABELS[value] || value}</span>;
  }
  if (type === "active") {
    return <span className={`badge ${value ? "badge-green" : "badge-red"}`}>{value ? "Active" : "Inactive"}</span>;
  }
  return <span className="badge badge-gray">{value}</span>;
}
