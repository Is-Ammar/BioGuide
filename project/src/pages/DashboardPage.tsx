import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { QuickStats } from '../components/dashboard/QuickStats';
import { MissionCard } from '../components/dashboard/MissionCard';
import { mockMissions } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const telemetryData = [
  { time: '00:00', radiation: 0.12, temperature: 22.5, pressure: 101.3 },
  { time: '04:00', radiation: 0.11, temperature: 22.8, pressure: 101.2 },
  { time: '08:00', radiation: 0.13, temperature: 22.3, pressure: 101.4 },
  { time: '12:00', radiation: 0.12, temperature: 22.7, pressure: 101.1 },
  { time: '16:00', radiation: 0.14, temperature: 22.4, pressure: 101.3 },
  { time: '20:00', radiation: 0.12, temperature: 22.6, pressure: 101.2 },
];

export const DashboardPage = () => {
  const activeMissions = mockMissions.filter(m => m.status === 'active');
  const criticalMissions = mockMissions.filter(m => m.status === 'critical');

  return (
    <div className="space-y-6">
      <Header 
        title="Mission Control Dashboard" 
        subtitle="Real-time monitoring and mission oversight"
      />

      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Real-time Telemetry</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="radiation" 
                  stroke="#00FFFF" 
                  strokeWidth={2}
                  dot={{ fill: '#00FFFF', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Mission Status Overview</h3>
          <div className="space-y-4">
            {['Active', 'Critical', 'Planned', 'Completed'].map((status, index) => {
              const count = mockMissions.filter(m => 
                m.status.toLowerCase() === status.toLowerCase()
              ).length;
              const colors = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    />
                    <span className="text-gray-300">{status} Missions</span>
                  </div>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {criticalMissions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="w-3 h-3 bg-red-400 rounded-full mr-3 animate-pulse"></span>
            Critical Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {criticalMissions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MissionCard mission={mission} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Active Missions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MissionCard mission={mission} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};