import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockUsers } from '../data/mockData';
import { PlusIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export const TeamsPage = () => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'scientist': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'engineer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Team Management" 
        subtitle="Manage team members and their roles"
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-white">Team Members ({mockUsers.length})</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{mockUsers.filter(u => u.status === 'online').length} Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>{mockUsers.filter(u => u.status === 'away').length} Away</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>{mockUsers.filter(u => u.status === 'offline').length} Offline</span>
            </div>
          </div>
        </div>
        <Button variant="neon">
          <PlusIcon className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative">
              <div className="absolute top-4 right-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(user.status)}`}></div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-neon-aqua/30"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Role</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className="text-white text-sm capitalize">{user.status}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Last Active</span>
                  <span className="text-white text-sm">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Team Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-gray-400 font-medium">Permission</th>
                <th className="text-center py-3 text-gray-400 font-medium">Admin</th>
                <th className="text-center py-3 text-gray-400 font-medium">Scientist</th>
                <th className="text-center py-3 text-gray-400 font-medium">Engineer</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                'View Missions',
                'Create Missions',
                'Edit Missions',
                'Delete Missions',
                'Manage Team',
                'View Analytics',
                'System Settings',
              ].map((permission, index) => (
                <tr key={permission} className="border-b border-white/5">
                  <td className="py-3 text-white">{permission}</td>
                  <td className="py-3 text-center">
                    <span className="text-green-400">✓</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={index < 4 ? "text-green-400" : "text-red-400"}>
                      {index < 4 ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={index < 3 ? "text-green-400" : "text-red-400"}>
                      {index < 3 ? "✓" : "✗"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};