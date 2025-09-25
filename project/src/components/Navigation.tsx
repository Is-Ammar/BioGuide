import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isLanding = location.pathname === '/';

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 ${isLanding ? 'glass' : 'glass-dark'} border-b border-white/10`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="text-2xl font-black text-slate-900"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              FF BioGuide
            </motion.div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 glass px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:neon-glow transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;