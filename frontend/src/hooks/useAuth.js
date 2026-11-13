import { useState } from 'react';
import { API } from '../services/api';

function normalizeRole(rawRole) {
  if (!rawRole) return "";
  return rawRole.startsWith("ROLE_") ? rawRole : `ROLE_${rawRole}`;
}

export function useAuth() {
  const [user, setUser] = useState(() => API.getSession());
  const userRole = normalizeRole(user?.role);

  const setSessionData = (sessionData) => setUser(sessionData);

  const logout = () => {
    API.clearSession();
    setUser(null);
  };

  return { user, userRole, setSessionData, logout };
}
