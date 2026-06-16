"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '../lib/api';

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  organization: Organization;
}

interface User {
  id: string;
  email: string;
  name?: string;
  memberships?: Membership[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: Record<string, string>) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('nova_token');
      if (token) {
        try {
          const userData = await api('/auth/me');
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user:", error);
          Cookies.remove('nova_token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (data: Record<string, string>) => {
    const response = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    Cookies.set('nova_token', response.access_token, { expires: 1 });
    setUser(response.user);
    router.push('/dashboard');
  };

  const register = async (data: Record<string, string>) => {
    await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    await login({ email: data.email as string, password: data.password as string });
  };

  const logout = () => {
    Cookies.remove('nova_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
