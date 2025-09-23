import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { MissionCard } from '../components/dashboard/MissionCard';
import { mockMissions } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

export const MissionsPage = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'critical' | 'completed' | 'planned'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'startDate'>('startDate');

  const filteredMissions = mockMissions
    .filter(mission => filter === 'all' || mission.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.progress - a.progress;
        case 'startDate':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        default:
          return 0;
      }
    });

  const filterOptions = [
    { value: 'all', label: 'All Missions', count: mockMissions.length },
    { value: 'active', label: 'Active', count: mockMissions.filter(m => m.status === 'active').length },
    { value: 'critical', label: 'Critical', count: mockMissions.filter(m => m.status === 'critical').length },
    { value: 'completed', label: 'Completed', count: mockMissions.filter(m => m.status === 'completed').length },
    { value: 'planned', label: 'Planned', count: mockMissions.filter(m => m.status === 'planned').length },
  ];

  return (
    <div className="space-y-6">
      <Header 
        title="Mission Management" 
        subtitle="Monitor and manage all space missions"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? 'neon' : 'ghost'}
              size="sm"
              onClick={() => setFilter(option.value as any)}
              className="text-sm"
            >
              {option.label} ({option.count})
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-aqua/50"
            >
              <option value="startDate">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="progress">Sort by Progress</option>
            </select>
          </div>
          <Button variant="neon" size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Mission
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MissionCard mission={mission} />
          </motion.div>
        ))}
      </div>

      {filteredMissions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-white mb-2">No missions found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or create a new mission.</p>
          <Button variant="neon">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create New Mission
          </Button>
        </div>
      )}
    </div>
  );
};