import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomerCrm from "./pages/CustomerCrm";
import DeveloperCrm from "./pages/DeveloperCrm";
import LeadDetail from "./pages/LeadDetail";
import SiteVisits from "./pages/SiteVisits";
import SalesTeam from "./pages/SalesTeam";
import Profile from "./pages/Profile";

function CrmApp() {
  return (
    <ProtectedRoute>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer-crm" element={<CustomerCrm />} />
          <Route path="/developer-crm" element={<DeveloperCrm />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
          <Route path="/site-visits" element={<SiteVisits />} />
          <Route path="/sales-team" element={<SalesTeam />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<CrmApp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
