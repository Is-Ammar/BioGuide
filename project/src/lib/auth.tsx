import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  savedPublications: string[];
  favoritePublications: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  savePublication: (id: string) => void;
  toggleFavorite: (id: string) => void;
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

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('FF BioGuide_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would call your API
    if (password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        savedPublications: [],
        favoritePublications: []
      };
      
      // Try to restore saved data from localStorage
      const existingUserData = localStorage.getItem(`FF BioGuide_user_${email}`);
      if (existingUserData) {
        const existingUser = JSON.parse(existingUserData);
        newUser.savedPublications = existingUser.savedPublications || [];
        newUser.favoritePublications = existingUser.favoritePublications || [];
      }

      setUser(newUser);
      localStorage.setItem('FF BioGuide_user', JSON.stringify(newUser));
      localStorage.setItem(`FF BioGuide_user_${email}`, JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    // Mock registration - same as login for demo purposes
    return login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('FF BioGuide_user');
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const savePublication = (id: string) => {
    if (!user) {
      openAuthModal();
      return;
    }

    const updatedUser = {
      ...user,
      savedPublications: user.savedPublications.includes(id)
        ? user.savedPublications.filter(pubId => pubId !== id)
        : [...user.savedPublications, id]
    };

    setUser(updatedUser);
    localStorage.setItem('FF BioGuide_user', JSON.stringify(updatedUser));
    localStorage.setItem(`FF BioGuide_user_${user.email}`, JSON.stringify(updatedUser));
  };

  const toggleFavorite = (id: string) => {
    if (!user) {
      openAuthModal();
      return;
    }

    const updatedUser = {
      ...user,
      favoritePublications: user.favoritePublications.includes(id)
        ? user.favoritePublications.filter(pubId => pubId !== id)
        : [...user.favoritePublications, id]
    };

    setUser(updatedUser);
    localStorage.setItem('FF BioGuide_user', JSON.stringify(updatedUser));
    localStorage.setItem(`FF BioGuide_user_${user.email}`, JSON.stringify(updatedUser));
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
        savePublication,
        toggleFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};