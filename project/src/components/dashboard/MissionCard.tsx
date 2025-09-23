import { motion } from 'framer-motion';
import { RocketLaunchIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Mission } from '../../types';
import { Card } from '../ui/Card';

interface MissionCardProps {
  mission: Mission;
  onClick?: () => void;
}

export const MissionCard = ({ mission, onClick }: MissionCardProps) => {
  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      case 'completed': return 'text-blue-400 bg-blue-400/20';
      case 'planned': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTypeIcon = (type: Mission['type']) => {
    const iconClass = "w-8 h-8";
    switch (type) {
      case 'ISS': return '🛰️';
      case 'Mars': return '🔴';
      case 'Moon': return '🌙';
      case 'Deep Space': return '🌌';
      default: return '🚀';
    }
  };

  return (
    <Card onClick={onClick} className="relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
          {mission.status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-start space-x-4 mb-4">
        <div className="text-3xl">{getTypeIcon(mission.type)}</div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{mission.name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{mission.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-medium">{mission.progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-neon-aqua to-neon-purple h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${mission.progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <UsersIcon className="w-4 h-4" />
              <span>{mission.crew.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-4 h-4" />
              <span>{new Date(mission.startDate).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {mission.crew.slice(0, 3).map((member, index) => (
              <img
                key={member.id}
                src={member.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2`}
                alt={member.name}
                className="w-6 h-6 rounded-full border-2 border-dark-950"
              />
            ))}
            {mission.crew.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-dark-950 flex items-center justify-center text-xs text-white">
                +{mission.crew.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};