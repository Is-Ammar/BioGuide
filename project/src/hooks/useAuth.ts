import { useState, useEffect } from 'react';
import { AuthState, User } from '../types';

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@nasa.gov',
  role: 'scientist',
  avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  status: 'online',
  lastActive: new Date().toISOString(),
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      const isLoggedIn = localStorage.getItem('nasa_auth') === 'true';
      setAuthState({
        user: isLoggedIn ? mockUser : null,
        isAuthenticated: isLoggedIn,
        isLoading: false,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    localStorage.setItem('nasa_auth', 'true');
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('nasa_auth');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser = { ...mockUser, name, email };
    localStorage.setItem('nasa_auth', 'true');
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
    signup,
  };
};