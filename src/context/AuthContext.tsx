'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  logout: () => void;
  updateUser: (updatedData: Partial<UserSession>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AUTH_STORAGE_KEY = 'galal_user_session';
export const AUTH_EVENT_NAME = 'galal_auth_changed';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSession = () => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();

    // Listen to local storage changes across tabs & custom internal auth events
    const handleAuthChange = () => {
      loadSession();
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const login = (userData: UserSession) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      window.dispatchEvent(new Event(AUTH_EVENT_NAME));
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  };

  const logout = () => {
    try {
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
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      loading: isLoading,
      login,
      logout,
      updateUser
    }}>
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
