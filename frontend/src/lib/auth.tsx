import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from './api';
import { useNavigate } from 'react-router-dom';
import { showToast } from './useToast';

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
  profession?: 'student' | 'researcher' | 'scientist' | 'other';
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
    age: number;
    profession: 'student' | 'researcher' | 'scientist' | 'other';
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  loading: boolean;
  initializing: boolean;
  savedIds: string[];
  favoriteIds: string[];
  toggleSave: (publicationId: string) => Promise<void>;
  toggleFavorite: (publicationId: string) => Promise<void>;
  setUserFromToken: (user: User) => void;
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
  const [initializing, setInitializing] = useState(true); // Track initial auth check
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load user and fetch their publications
  useEffect(() => {
    const load = async () => {
      const tokenStored = localStorage.getItem('FF_BioGuide_token');
      const userStored = localStorage.getItem('FF_BioGuide_user');
      if (userStored && tokenStored) {
        try {
          setUser(JSON.parse(userStored));
        } catch (error) {
          localStorage.removeItem('FF_BioGuide_user');
        }
      } else if (tokenStored && !userStored) {
        try {
          const resp = await apiService.getCurrentUser();
            if (resp.success && resp.user) {
              setUser(resp.user);
              localStorage.setItem('FF_BioGuide_user', JSON.stringify(resp.user));
            } else {
              localStorage.removeItem('FF_BioGuide_token');
            }
        } catch (err) {
          localStorage.removeItem('FF_BioGuide_token');
        }
      }
      setInitializing(false);
    };
    load();
  }, []);

  // Fetch user publications when user is available
  useEffect(() => {
    if (user) {
      fetchUserPublications();
    } else {
      setSavedIds([]);
      setFavoriteIds([]);
    }
  }, [user]);

  const fetchUserPublications = async () => {
    try {
      const response = await apiService.getUserPublications();
      if (response.success) {
        setSavedIds(response.savedPublications || []);
        setFavoriteIds(response.favoritePublications || []);
      }
    } catch (error) {
      console.error('Failed to fetch user publications:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiService.signin({ email, password });
      
      if (response.success && response.user && response.token) {
        const isNew = localStorage.getItem('FF_BioGuide_account_created');
        setUser(response.user);
        localStorage.setItem('FF_BioGuide_user', JSON.stringify(response.user));
        localStorage.setItem('FF_BioGuide_token', response.token);
        setIsAuthModalOpen(false);
        // Show login success toast (5s handled by utility)
        showToast('Login successful', 'success');
        // If a new account flag exists, show one-time toast and then remove flag so it never repeats
        if (isNew === '1') {
          showToast('Account created successfully', 'success');
          localStorage.removeItem('FF_BioGuide_account_created');
        }

        // Handle redirect when login originates from AuthModal or any page other than dedicated /login
        try {
          const isOnLoginPage = window.location.pathname.startsWith('/login');
          if (!isOnLoginPage) {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectQuery = urlParams.get('redirect');
            const stored = localStorage.getItem('FF_BioGuide_redirect_after_auth');
            const target = stored || redirectQuery || '/dashboard';
            // Clear stored redirect intent once consumed
            localStorage.removeItem('FF_BioGuide_redirect_after_auth');
            // If target explicitly '/', send user to dashboard (primary app area)
            if (target === '/') {
              navigate('/dashboard', { replace: true });
            } else {
              navigate(target, { replace: true });
            }
          }
        } catch (_) {
          // Silently ignore redirect errors (e.g., during tests / SSR edge cases)
        }
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
    age: number;
    profession: 'student' | 'researcher' | 'scientist' | 'other';
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiService.signup({
        ...userData,
        agreement: true
      });
      
      if (response.success) {
        // mark new account so after auto-login we can show one-time toast
        localStorage.setItem('FF_BioGuide_account_created', '1');
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
      setSavedIds([]);
      setFavoriteIds([]);
      localStorage.removeItem('FF_BioGuide_user');
      localStorage.removeItem('FF_BioGuide_token');
      setLoading(false);
      // Always navigate to landing page gracefully (client-side) even if already there
      if (window.location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  };

  const toggleSave = async (publicationId: string) => {
    try {
      const response = await apiService.toggleSavedPublication(publicationId);
      if (response.success) {
        setSavedIds(response.savedPublications || []);
        setFavoriteIds(response.favoritePublications || []);
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  const toggleFavorite = async (publicationId: string) => {
    try {
      const response = await apiService.toggleFavoritePublication(publicationId);
      if (response.success) {
        setSavedIds(response.savedPublications || []);
        setFavoriteIds(response.favoritePublications || []);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setUserFromToken = (userData: User) => {
    setUser(userData);
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
        loading,
        initializing,
        savedIds,
        favoriteIds,
        toggleSave,
        toggleFavorite,
        setUserFromToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};