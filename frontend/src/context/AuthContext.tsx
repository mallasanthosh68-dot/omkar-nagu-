import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { getApiUrl } from '../config/api';

interface RegisterData {
  name: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  adminLogin: (phone: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  setAuthSession: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('omkar_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('omkar_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem('omkar_user');
      const savedToken = localStorage.getItem('omkar_token');
      // If we already have user and token stored in localStorage, start with isLoading = false
      // so protected routes immediately render without redirection on page reload!
      return !(savedUser && savedToken);
    } catch {
      return true;
    }
  });

  // Sync state with backend on mount
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await fetch(getApiUrl('/api/auth/me'), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setUser(data.user);
              localStorage.setItem('omkar_user', JSON.stringify(data.user));
            }
          } else if (res.status === 401) {
            // Only logout if token is explicitly expired/invalid from backend
            try {
              const errData = await res.json();
              if (errData?.message && (errData.message.toLowerCase().includes('expired') || errData.message.toLowerCase().includes('invalid token'))) {
                if (isMounted) logout();
              }
            } catch {
              // Ignore json parse error
            }
          }
          // Do not log out on 404, 500 or connection errors so sessions stay valid on reload
        } catch (err) {
          console.warn('Network error checking auth status:', err);
        }
      }
      if (isMounted) setIsLoading(false);
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (phone: string, password: string) => {
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Login failed.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('omkar_user', JSON.stringify(data.user));
      localStorage.setItem('omkar_token', data.token);

      return { success: true, message: data.message, user: data.user };
    } catch (err: any) {
      return { success: false, message: 'Server connection failed. Please ensure the backend is running.' };
    }
  };

  const adminLogin = async (phone: string, password: string) => {
    try {
      const res = await fetch(getApiUrl('/api/auth/admin-login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Admin authentication failed.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('omkar_user', JSON.stringify(data.user));
      localStorage.setItem('omkar_token', data.token);

      return { success: true, message: data.message, user: data.user };
    } catch (err: any) {
      return { success: false, message: 'Server connection failed. Please check network connection.' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, message: resData.message || 'Registration failed.' };
      }

      setUser(resData.user);
      setToken(resData.token);
      localStorage.setItem('omkar_user', JSON.stringify(resData.user));
      localStorage.setItem('omkar_token', resData.token);

      return { success: true, message: resData.message, user: resData.user };
    } catch (err: any) {
      return { success: false, message: 'Server connection failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('omkar_user');
    localStorage.removeItem('omkar_token');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const nextUser = { ...user, ...updatedUser };
      setUser(nextUser);
      localStorage.setItem('omkar_user', JSON.stringify(nextUser));
    }
  };

  const setAuthSession = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('omkar_user', JSON.stringify(newUser));
    localStorage.setItem('omkar_token', newToken);
  };

  const role = user?.role || null;
  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'ADMIN';
  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isAdmin,
        isCustomer,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
        updateUser,
        setAuthSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
