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

  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const setAuthUser = (user: AuthUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const removeAuthUser = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const removeAuthToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      setAuthToken,
      setAuthUser,
      removeAuthToken,
      removeAuthUser,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
