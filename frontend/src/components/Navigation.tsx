import React from 'react';
import HgLogo from '../../../icon/hg.png';
import { Link, useLocation } from 'react-router-dom';
import { User, LogIn, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../lib/auth';

const navItems: { label: string; to: string }[] = [
  { label: 'Explore', to: '/dashboard?mode=explore' },
  { label: 'Search', to: '/dashboard?mode=search' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();


  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-semantic-surface-1/85 border-b border-semantic-border-muted"
      role="navigation"
      aria-label="Primary"
    >
      <div className="w-full px-4 md:px-8 relative">
        <div className="relative md:h-16 h-24 md:py-0 py-3 mx-auto flex items-center justify-between flex-wrap md:flex-nowrap gap-4">
          <div className="order-1 flex items-center gap-3">
            <Link to="/" className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
              <span className="sr-only">BioGuide Home</span>
              <span className="relative inline-flex h-10 w-10 rounded-xl overflow-hidden border border-semantic-border-muted group-hover:border-semantic-border-accent transition-colors">
                <img
                  src={HgLogo}
                  alt="BioGuide Logo"
                  className="h-full w-full object-cover select-none"
                  loading="eager"
                  decoding="async"
                />
                <span className="pointer-events-none absolute inset-0 rounded-xl group-hover:bg-accent/5" />
              </span>
            </Link>
            <Link
              to="/"
              className="font-extrabold tracking-tight text-lg md:text-xl text-accent hover:text-accent-alt transition-colors"
            >
              BioGuide
            </Link>
          </div>

            {/* Links */}
            <div className="order-3 md:order-2 w-full md:w-auto">
              <ul className="flex flex-wrap md:flex-nowrap md:space-x-1 justify-between md:justify-center font-medium text-sm">
                {navItems.map((item) => {
                  const basePath = item.to.split('?')[0];
                  const searchParams = new URLSearchParams(location.search);
                  const mode = searchParams.get('mode');
                  let active = false;
                  if (basePath === '/dashboard') {
                    if (item.label === 'Explore') active = mode === 'explore';
                    if (item.label === 'Search') active = mode === 'search';
                  } else {
                    active = location.pathname.startsWith(basePath);
                  }
                  return (
                    <li key={item.to} className="w-auto">
                      <Link
                        to={item.to}
                        aria-current={active ? 'page' : undefined}
                        className={`md:px-4 md:py-2 px-3 py-2 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--color-surface-0)]
                          ${active
                            ? 'text-accent font-semibold bg-semantic-surface-2/70 border border-semantic-border-accent'
                            : 'text-semantic-text-secondary hover:text-accent hover:bg-semantic-surface-2/50'}
                        `}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

          <div className="order-2 md:order-3 flex items-center gap-3 ml-auto">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-semantic-text-secondary hover:text-semantic-text-primary bg-semantic-surface-2/70 hover:bg-semantic-surface-2/90 border border-semantic-border-muted hover:border-semantic-border-accent transition-colors text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--color-surface-0)]"
                >
                  <User className="w-4 h-4 text-accent" />
                  <span className="hidden sm:inline max-w-[140px] truncate">
                    {user.first_name} {user.last_name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-semantic-text-secondary hover:text-semantic-text-primary bg-semantic-surface-2/60 hover:bg-semantic-surface-2/80 border border-semantic-border-muted hover:border-semantic-border-accent transition-colors text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--color-surface-0)]"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login?redirect=/"
                onClick={() => localStorage.setItem('FF_BioGuide_redirect_after_auth', '/')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent hover:bg-accent-alt text-white transition-colors text-sm font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--color-surface-0)]"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;