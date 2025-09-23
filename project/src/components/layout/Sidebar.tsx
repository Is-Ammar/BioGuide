import { motion } from 'framer-motion';
import {
  HomeIcon,
  RocketLaunchIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, id: 'dashboard' },
  { name: 'Missions', icon: RocketLaunchIcon, id: 'missions' },
  { name: 'Teams', icon: UsersIcon, id: 'teams' },
  { name: 'Data Explorer', icon: ChartBarIcon, id: 'data' },
  { name: 'Settings', icon: Cog6ToothIcon, id: 'settings' },
];

export const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 glass-card border-r border-white/10 z-40"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-aqua to-neon-purple rounded-lg flex items-center justify-center">
            <RocketLaunchIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">NASA</h1>
            <p className="text-xs text-gray-400">Mission Control</p>
          </div>
        </div>

        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-aqua/50"
          />
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`nav-item w-full ${currentPage === item.id ? 'active' : ''}`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </motion.button>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Dr. Sarah Chen</p>
              <p className="text-xs text-gray-400">Scientist</p>
            </div>
            <div className="status-indicator status-online"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};