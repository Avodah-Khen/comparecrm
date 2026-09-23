// context/AuthContext.jsx — current CrmUser session. Frontend role checks
// here only control UI visibility; the backend enforces real authorization.
import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import { getToken, setToken, clearToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    authService
      .getCurrentUser()
      .then(({ user }) => setUser(user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, user } = await authService.login(email, password);
    setToken(token);
    setUser(user);
  }

  function logout() {
    authService.logout().catch(() => {});
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
