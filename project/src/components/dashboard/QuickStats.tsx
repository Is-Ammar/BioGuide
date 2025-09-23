import { motion } from 'framer-motion';
import { 
  RocketLaunchIcon, 
  UsersIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { TelemetryCard } from './TelemetryCard';

export const QuickStats = () => {
  const stats = [
    {
      title: 'Active Missions',
      value: 12,
      icon: <RocketLaunchIcon className="w-6 h-6" />,
      color: 'blue' as const,
      trend: 'up' as const,
    },
    {
      title: 'Crew Members',
      value: 47,
      icon: <UsersIcon className="w-6 h-6" />,
      color: 'green' as const,
      trend: 'stable' as const,
    },
    {
      title: 'Critical Alerts',
      value: 3,
      icon: <ExclamationTriangleIcon className="w-6 h-6" />,
      color: 'red' as const,
      trend: 'down' as const,
    },
    {
      title: 'Systems Online',
      value: '98.7%',
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: 'green' as const,
      trend: 'up' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TelemetryCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};