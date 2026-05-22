import { useMemo, useState } from 'react';

import type { AuthUser } from '../services/auth/auth.types';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user');

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  });

  const setAuthData = (token: string, user: AuthUser) => {
    setAuthToken(token);
    setAuthUser(user);
  };

  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const setAuthUser = (user: AuthUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      setAuthData,
      setAuthToken,
      setAuthUser,
      logout,
    }),
    [setAuthData, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
