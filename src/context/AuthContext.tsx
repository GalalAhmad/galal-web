'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface UserSession {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  gender?: string;
  ageGroup?: string;
  maritalStatus?: string;
  country?: string;
  city?: string;
  provider?: string;
  role?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  login: (userData: UserSession) => void;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<UserSession>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AUTH_STORAGE_KEY = 'galal_user_session';
export const AUTH_EVENT_NAME = 'galal_auth_changed';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync server session status with client state. Server response is the sole authoritative source of truth.
  const syncServerSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          // Merge validated server identity with harmless client preference caches
          let cached: any = {};
          try {
            cached = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}');
          } catch {}

          const validatedUser: UserSession = {
            ...cached,
            id: data.user.id,
            name: data.user.name,
            role: data.user.role,
            phone: data.user.phone || cached.phone,
            email: data.user.email || cached.email,
          };

          setUser(validatedUser);
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(validatedUser));
          } catch {}
          return;
        }
      }

      // If server returns unauthenticated (401 / !authenticated), purge state and cache immediately
      setUser(null);
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {}
    } catch (err) {
      // On network failure: fail-closed. localStorage is for display cache only and never grants authorization.
      console.warn('[AUTH] Failed to verify server session over network. Failing closed.');
      setUser(null);
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {}
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncServerSession();

    const handleAuthChange = () => {
      syncServerSession();
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [syncServerSession]);

  const login = (userData: UserSession) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    } catch (e) {
      console.error('Error removing user session:', e);
    }
  };

  const updateUser = (updatedData: Partial<UserSession>) => {
    try {
      const merged = { ...user, ...updatedData } as UserSession;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(merged));
      setUser(merged);
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    } catch (e) {
      console.error('Error updating user session:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loading: isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
