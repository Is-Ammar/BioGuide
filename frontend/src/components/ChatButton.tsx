import React from 'react';
import { motion } from 'framer-motion';

interface ChatButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, unreadCount = 0 }) => {
  return (
    <motion.button
      onClick={onClick}
      title="AI Assistant"
      aria-label="AI Assistant"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-5 right-5 w-14 h-14 bg-gradient-to-br from-cosmic-500 to-bio-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-400 z-50"
    >
      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <span className="text-white text-sm font-bold">AI</span>
      </div>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-md">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </motion.button>
  );
};

export default ChatButton;
