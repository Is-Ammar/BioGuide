import { useAuth, PendingAction } from './auth';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook for protecting actions that require authentication.
 * 
 * Usage:
 * ```tsx
 * const requireAuth = useRequireAuth();
 * 
 * const handleSave = () => {
 *   requireAuth(() => {
 *     // This only runs if user is authenticated
 *     toggleSave(publicationId);
 *   }, {
 *     type: 'save',
 *     payload: { id: publicationId }
 *   });
 * };
 * ```
 */
export const useRequireAuth = () => {
  const { user, setPendingAction } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Execute an action only if authenticated, otherwise redirect to login
   * @param action - The function to execute if authenticated
   * @param pendingActionData - Optional pending action to save and replay after login
   * @param redirectPath - Optional explicit redirect path after login (defaults to current path)
   */
  const requireAuth = (
    action: () => void | Promise<void>,
    pendingActionData?: Omit<PendingAction, 'redirectPath'>,
    redirectPath?: string
  ) => {
    if (user) {
      // User is authenticated, execute immediately
      return action();
    } else {
      // User is not authenticated, save pending action and redirect to login
      const targetPath = redirectPath || location.pathname;
      
      // Save the redirect path to sessionStorage
      sessionStorage.setItem('FF_BioGuide_redirect_path', targetPath);
      
      // If there's a pending action, save it
      if (pendingActionData) {
        setPendingAction({
          ...pendingActionData,
          redirectPath: targetPath
        });
      }
      
      // Navigate to login with callbackUrl
      navigate(`/login?callbackUrl=${encodeURIComponent(targetPath)}`);
    }
  };

  return requireAuth;
};
