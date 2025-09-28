import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from './api';

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    country: string;
  }) => Promise<boolean>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('FF_BioGuide_user');
    const token = localStorage.getItem('FF_BioGuide_token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('FF_BioGuide_user');
        localStorage.removeItem('FF_BioGuide_token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiService.signin({ email, password });
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        localStorage.setItem('FF_BioGuide_user', JSON.stringify(response.user));
        localStorage.setItem('FF_BioGuide_token', response.token);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    country: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiService.signup({
        ...userData,
        agreement: true
      });
      
      if (response.success) {
        return await login(userData.email, userData.password);
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('FF_BioGuide_user');
      localStorage.removeItem('FF_BioGuide_token');
      setLoading(false);
    }
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};