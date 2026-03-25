import React, { createContext, useState, useEffect } from 'react';
import { getTouristById } from '../services/api';
import { decodeJwtPayload } from '../utils/jwt';

export const AuthContext = createContext();

const ADMIN_EMAIL = 'admin@touristsafety.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => decodeJwtPayload(localStorage.getItem('token'))?.role || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setRole(null);
      return;
    }

    const payload = decodeJwtPayload(token);
    const tokenRole = payload?.role;
    setRole(tokenRole || null);
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    const restoreUser = async () => {
      if (!token || user) return;

      const payload = decodeJwtPayload(token);
      const userId = payload?.sub ? Number(payload.sub) : null;
      if (!userId) return;

      setLoading(true);
      try {
        const response = await getTouristById(userId);
        if (!cancelled) {
          const apiUser = response.data;
          const inferredRole =
            payload?.role || (apiUser?.email === ADMIN_EMAIL ? 'ADMIN' : 'USER');
          setRole(inferredRole);
          setUser({ ...apiUser, role: inferredRole });
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          setRole(null);
          localStorage.removeItem('token');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restoreUser();
    return () => {
      cancelled = true;
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (userData, authToken) => {
    const inferredRole =
      userData?.role || (userData?.email === ADMIN_EMAIL ? 'ADMIN' : 'USER');
    setRole(inferredRole);
    setUser({ ...userData, role: inferredRole });
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || role,
        isAdmin: (user?.role || role) === 'ADMIN',
        token,
        login,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
