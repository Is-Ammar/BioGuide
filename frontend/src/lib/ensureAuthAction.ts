import { useAuth } from './auth';

// Hook returning a function to guard actions requiring auth
// Usage: const ensureAuth = useEnsureAuthAction(); ensureAuth({ type:'download', payload:{ id, pdfUrl }, redirectPath:`/publication/${id}` }, () => {/* immediate action if already logged in */});
export function useEnsureAuthAction() {
  const { user, openAuthModal, setPendingAction } = useAuth() as any;

  return function ensureAuth(action: { type: string; payload?: any; redirectPath?: string }, immediate?: () => void) {
    if (user) {
      // Already authenticated; execute immediately
      immediate && immediate();
      return true;
    }
    // Store pending action
    setPendingAction({ ...action });
    // Also stash redirect path for Google OAuth flow param
    if (action.redirectPath) {
      sessionStorage.setItem('FF_BioGuide_redirect_path', action.redirectPath);
    }
    openAuthModal();
    return false;
  };
}

// Utility to build Google OAuth URL including redirect param
export function buildGoogleOAuthUrl(base = 'http://localhost:3000/api/auth/google') {
  const redirectPath = sessionStorage.getItem('FF_BioGuide_redirect_path') || '/dashboard';
  const url = new URL(base);
  url.searchParams.set('redirect', redirectPath);
  return url.toString();
}
