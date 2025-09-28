import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';

const navItems = [
	{ label: 'Dashboard', to: '/dashboard' },
];

const Navigation = () => {
	const location = useLocation();
	const { user, logout } = useAuth();
	const isLanding = location.pathname === '/';
	const isDashboard = location.pathname.startsWith('/dashboard');

	// Track sidebar open state via custom event from Sidebar component (only matters on dashboard)
	const [sidebarOpen, setSidebarOpen] = useState(false);
	useEffect(() => {
		const handler = (e: Event) => {
			const custom = e as CustomEvent<{ open: boolean }>;
			setSidebarOpen(!!custom.detail?.open);
		};
		window.addEventListener('sidebar:toggle', handler as EventListener);
		return () => window.removeEventListener('sidebar:toggle', handler as EventListener);
	}, []);

	const containerBase = 'px-4 sm:px-6 lg:px-8';
	const containerClasses = isDashboard
		? `w-full ${containerBase} transition-[padding] duration-300 ${sidebarOpen ? 'md:pl-80' : ''}`
		: `max-w-7xl mx-auto ${containerBase}`;

	return (
		<motion.nav
			className={`fixed top-0 left-0 right-0 z-50 ${isLanding ? 'glass' : 'glass-dark'} border-b border-white/10 backdrop-blur-xl`}
			initial={{ y: -72, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			role="navigation"
			aria-label="Primary"
		>
			{/* Container: full-width on dashboard (with sidebar offset), centered on others */}
			<div className={containerClasses}>
				<div className="flex items-center h-16 w-full">
					{/* Brand */}
					<Link to="/" className="relative group flex items-center gap-2 flex-shrink-0">
						<div className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/20 via-emerald-500/10 to-transparent blur-md transition" />
						<motion.div
							className="relative font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-purple-200 to-emerald-200 text-xl sm:text-2xl"
							whileHover={{ scale: 1.06 }}
							whileTap={{ scale: 0.97 }}
							transition={{ type: 'spring', stiffness: 400, damping: 18 }}
						>
							FF BioGuide
						</motion.div>
					</Link>

					{/* Center nav links (unchanged) */}
					<div className="hidden md:flex items-center gap-8 ml-10">
						{navItems.map(item => {
							const active = location.pathname.startsWith(item.to);
							return (
								<div key={item.to} className="relative">
									<Link
										to={item.to}
										aria-current={active ? 'page' : undefined}
										className={`px-1 text-sm font-medium transition-colors ${active ? 'text-white' : 'text-slate-300 hover:text-white'}`}
									>
										{item.label}
									</Link>
									<AnimatePresence>
										{active && (
											<motion.span
												layoutId="nav-active-pill"
												className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-emerald-400 via-purple-400 to-emerald-400"
												initial={{ opacity: 0, scaleX: 0 }}
												animate={{ opacity: 1, scaleX: 1 }}
												exit={{ opacity: 0, scaleX: 0 }}
												transition={{ duration: 0.35, ease: 'easeOut' }}
											/>
										)}
									</AnimatePresence>
								</div>
							);
						})}
					</div>

					{/* Spacer to push auth to far right */}
					<div className="flex-grow" />

					{/* Right side auth */}
					<div className="flex items-center gap-4 flex-shrink-0">
						{user ? (
							<div className="flex items-center gap-4">
								<Link
									to="/profile"
									className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
								>
									<User className="w-4 h-4 text-purple-300 group-hover:text-emerald-300 transition-colors" />
									<span className="hidden sm:inline text-xs font-medium truncate max-w-[140px]">{user.first_name} {user.last_name}</span>
								</Link>
								<motion.button
									onClick={logout}
									className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors overflow-hidden"
									whileHover={{ y: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									<span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-emerald-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-emerald-500/10 transition-all" />
									<LogOut className="w-4 h-4" />
									<span className="hidden sm:inline text-xs font-medium">Logout</span>
								</motion.button>
							</div>
						) : (
							<motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}>
								<Link
									to="/login"
									className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 via-fuchsia-500 to-emerald-500 bg-[length:200%_auto] animate-[gradient-move_8s_linear_infinite] shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)] hover:shadow-[0_0_22px_-3px_rgba(52,211,153,0.5)] transition-all"
								>
									<LogIn className="w-4 h-4" />
									<span>Login</span>
								</Link>
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</motion.nav>
	);
};

export default Navigation;