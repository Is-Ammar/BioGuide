import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface TelemetryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color?: 'green' | 'yellow' | 'red' | 'blue';
}

export const TelemetryCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon, 
  color = 'blue' 
}: TelemetryCardProps) => {
  const colorClasses = {
    green: 'text-green-400 bg-green-400/20',
    yellow: 'text-yellow-400 bg-yellow-400/20',
    red: 'text-red-400 bg-red-400/20',
    blue: 'text-blue-400 bg-blue-400/20',
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return null;
    }
  };

  return (
    <Card hover={false} className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-2xl">{getTrendIcon()}</span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <motion.span
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {value}
          </motion.span>
          {unit && <span className="text-gray-400 text-sm">{unit}</span>}
        </div>
      </div>
    </Card>
  );
};