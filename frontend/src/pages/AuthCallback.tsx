import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUserFromToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      // Store the token
      localStorage.setItem('FF_BioGuide_token', token);
      
      // Fetch user data
      fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.user) {
            localStorage.setItem('FF_BioGuide_user', JSON.stringify(data.user));
            
            // Update the auth context with the new user
            if (setUserFromToken) {
              setUserFromToken(data.user);
            }
            
            // Check for stored redirect intent
            const redirectTo = localStorage.getItem('FF_BioGuide_redirect_after_auth');
            
            // Clear the redirect intent
            localStorage.removeItem('FF_BioGuide_redirect_after_auth');
            
            // Navigate to the intended destination
            if (redirectTo === '/') {
              navigate('/', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          } else {
            navigate('/login?error=auth_failed');
          }
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          navigate('/login?error=auth_failed');
        });
    } else if (error) {
      navigate(`/login?error=${error}`);
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setUserFromToken]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-slate-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
