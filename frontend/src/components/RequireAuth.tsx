import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);

  // Add a small delay to prevent flash redirects when auth context is updating
  useEffect(() => {
    if (!initializing) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initializing]);

  if (initializing || showLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cosmic-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Store the path they were trying to access for redirect after auth
    // This will be used for protected routes like /dashboard
    localStorage.setItem('FF_BioGuide_redirect_after_auth', location.pathname);
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
