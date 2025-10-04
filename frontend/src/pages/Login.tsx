import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, UserPlus, ArrowLeft, User, Phone } from 'lucide-react';
import CountrySelect from '../components/CountrySelect';
import { countries } from '../data/countries';
import { useAuth } from '../lib/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user, initializing } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');

  const selectedCountry = countries.find(c => c.name === country);

  const phonePlaceholder = React.useMemo(() => {
    if (!selectedCountry) return 'Select country first';
    const dial = `+${selectedCountry.dialCode}`;
    if (selectedCountry.phoneNumberFormat) {
      const fmt = selectedCountry.phoneNumberFormat.format;
      const digitsExample = fmt.replace(/x/g, '0');
      return `${dial} ${digitsExample}`.trim();
    }
    return `${dial} 1234567890`;
  }, [selectedCountry]);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!initializing && user) {
      const redirectTo = localStorage.getItem('FF_BioGuide_redirect_after_auth') || 
                         new URLSearchParams(location.search).get('redirect');
      
      localStorage.removeItem('FF_BioGuide_redirect_after_auth');
      
      if (redirectTo === '/') {
        navigate('/', { replace: true });
      } else if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, initializing, navigate, location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    const redirectTo = params.get('redirect');

    if (redirectTo) {
      localStorage.setItem('FF_BioGuide_redirect_after_auth', redirectTo);
    }

    if (errorParam) {
      if (errorParam === 'auth_failed') {
        setError('Google authentication failed. Please try again.');
      } else if (errorParam === 'no_user') {
        setError('Unable to retrieve user information. Please try again.');
      } else {
        setError('An error occurred during authentication.');
      }
    }
  }, [location]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setRegEmail('');
    setRegPassword('');
    setPhoneNumber('');
    setCountry('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          setError('Invalid email or password. Please check your credentials.');
        }
      } else {
        if (!firstName || !lastName || !regEmail || !regPassword || !phoneNumber || !country) {
          setError('Please fill in all required fields.');
          setIsLoading(false);
          return;
        }
        
        success = await register({
          first_name: firstName,
          last_name: lastName,
          email: regEmail,
          password: regPassword,
          phone_number: phoneNumber,
          country: country
        });
        
        if (!success) {
          setError('Registration failed. Please try again.');
        }
      }

      if (success) {
        const redirectTo = localStorage.getItem('FF_BioGuide_redirect_after_auth');
        localStorage.removeItem('FF_BioGuide_redirect_after_auth');
        
        if (redirectTo === '/') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bio-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      <motion.div
        className="relative z-10 glass-dark rounded-2xl p-8 w-full max-w-md border border-cosmic-500/30"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to FF BioGuide
        </Link>

        <div className="text-center mb-8">
          <motion.div
            className="text-3xl font-black bg-gradient-to-r from-cosmic-400 to-neon-cyan bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            FF BioGuide
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join FF BioGuide'}
          </h1>
          <p className="text-slate-400">
            {isLogin 
              ? 'Sign in to access your research library'
              : 'Create an account to start building your collection'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isLogin ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 transition-colors"
                      placeholder="First Name"
                      required
                      minLength={2}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 transition-colors"
                      placeholder="Last Name"
                      required
                      minLength={2}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Country
                </label>
                <CountrySelect value={country} onChange={setCountry} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 transition-colors"
                    placeholder={phonePlaceholder}
                    required
                    disabled={!country}
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <motion.div
              className="text-red-400 text-sm text-center p-3 bg-red-400/10 border border-red-400/20 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cosmic-500 to-bio-500 text-white py-3 rounded-lg font-medium hover:from-cosmic-600 hover:to-bio-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <Mail className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </motion.button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
            </div>
          </div>

<motion.button
  type="button"
  aria-label="Continue with Google"
  onClick={handleGoogleLogin}
  disabled={isLoading}
  className="relative group w-full overflow-hidden rounded-lg border border-slate-600/60 bg-slate-800/40 px-4 py-3 font-medium text-slate-200 backdrop-blur-sm flex items-center justify-center gap-3 transition-all
             hover:border-cosmic-400/70 hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-cosmic-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    <span className="absolute -inset-[1px] bg-gradient-to-r from-cosmic-500/15 via-neon-cyan/15 to-bio-500/15 blur-xl" />
  </span>
  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
  <span className="relative flex items-center gap-3">
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    </span>
    <span className="relative tracking-wide">Continue with Google</span>
  </span>
</motion.button>

        </form>

        <div className="text-center mt-6">
          <p className="text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }}
              className="ml-2 text-cosmic-400 hover:text-cosmic-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;