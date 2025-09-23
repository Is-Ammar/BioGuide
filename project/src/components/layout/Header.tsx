import { motion } from 'framer-motion';
import { BellIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications] = useState(3);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card border-b border-white/10 p-6 mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-400" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <BellIcon className="w-5 h-5 text-gray-400" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-orange text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </motion.button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Dr. Sarah Chen</p>
              <p className="text-xs text-gray-400">Mission Scientist</p>
            </div>
            <img
              src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2"
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-neon-aqua/50"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};