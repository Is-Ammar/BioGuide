import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './lib/auth';
import AuthModal from './components/AuthModal';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for code splitting
const Landing = React.lazy(() => import('./pages/Landing'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PublicationDetail = React.lazy(() => import('./pages/PublicationDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/Login'));

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <PageWrapper>
                  <Landing />
                </PageWrapper>
              } />
              <Route path="/dashboard" element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              } />
              <Route path="/publication/:id" element={
                <PageWrapper>
                  <PublicationDetail />
                </PageWrapper>
              } />
              <Route path="/profile" element={
                <PageWrapper>
                  <Profile />
                </PageWrapper>
              } />
              <Route path="/login" element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
        <AuthModal />
      </div>
    </AuthProvider>
  );
}

export default App;