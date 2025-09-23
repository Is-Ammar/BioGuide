import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon, 
  FunnelIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  BarChart,
  Bar
} from 'recharts';

const genomicsData = [
  { gene: 'ACTN3', expression: 2.4, mission: 'ISS-Alpha', organism: 'mouse' },
  { gene: 'MYOD1', expression: 1.8, mission: 'ISS-Alpha', organism: 'mouse' },
  { gene: 'IGF1', expression: 3.2, mission: 'Mars-Prep', organism: 'drosophila' },
  { gene: 'MSTN', expression: 0.9, mission: 'Lunar-Gateway', organism: 'plant' },
  { gene: 'VEGFA', expression: 2.7, mission: 'ISS-Beta', organism: 'tardigrade' },
];

const radiationData = [
  { time: '00:00', iss: 0.12, mars: 0.45, moon: 0.08, deep: 0.02 },
  { time: '06:00', iss: 0.11, mars: 0.47, moon: 0.09, deep: 0.02 },
  { time: '12:00', iss: 0.13, mars: 0.44, moon: 0.07, deep: 0.03 },
  { time: '18:00', iss: 0.12, mars: 0.46, moon: 0.08, deep: 0.02 },
];

const proteinData = [
  { protein: 'Collagen', fold_change: 1.5, p_value: 0.001 },
  { protein: 'Myosin', fold_change: 0.8, p_value: 0.02 },
  { protein: 'Actin', fold_change: 1.2, p_value: 0.15 },
  { protein: 'Elastin', fold_change: 2.1, p_value: 0.0001 },
  { protein: 'Keratin', fold_change: 0.9, p_value: 0.08 },
];

export const DataPage = () => {
  const [selectedDataset, setSelectedDataset] = useState<'genomics' | 'radiation' | 'proteomics'>('genomics');
  const [selectedOrganism, setSelectedOrganism] = useState<'all' | 'mouse' | 'drosophila' | 'plant' | 'tardigrade'>('all');

  const datasets = [
    { id: 'genomics', name: 'Genomics Data', icon: '🧬', count: '2.4K samples' },
    { id: 'radiation', name: 'Radiation Levels', icon: '☢️', count: '48h monitoring' },
    { id: 'proteomics', name: 'Protein Analysis', icon: '🔬', count: '156 proteins' },
  ];

  const organisms = [
    { id: 'all', name: 'All Organisms', count: genomicsData.length },
    { id: 'mouse', name: 'Mouse', count: genomicsData.filter(d => d.organism === 'mouse').length },
    { id: 'drosophila', name: 'Drosophila', count: genomicsData.filter(d => d.organism === 'drosophila').length },
    { id: 'plant', name: 'Plant', count: genomicsData.filter(d => d.organism === 'plant').length },
    { id: 'tardigrade', name: 'Tardigrade', count: genomicsData.filter(d => d.organism === 'tardigrade').length },
  ];

  const filteredGenomicsData = selectedOrganism === 'all' 
    ? genomicsData 
    : genomicsData.filter(d => d.organism === selectedOrganism);

  return (
    <div className="space-y-6">
      <Header 
        title="Data Explorer" 
        subtitle="Multi-omics data visualization and analysis"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Datasets</h3>
            <div className="space-y-2">
              {datasets.map((dataset) => (
                <button
                  key={dataset.id}
                  onClick={() => setSelectedDataset(dataset.id as any)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedDataset === dataset.id
                      ? 'bg-neon-aqua/20 border border-neon-aqua/50 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{dataset.icon}</span>
                    <div>
                      <div className="font-medium">{dataset.name}</div>
                      <div className="text-xs text-gray-400">{dataset.count}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedDataset === 'genomics' && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-white mb-3">Filter by Organism</h4>
                <div className="space-y-1">
                  {organisms.map((organism) => (
                    <button
                      key={organism.id}
                      onClick={() => setSelectedOrganism(organism.id as any)}
                      className={`w-full p-2 rounded text-left text-sm transition-all ${
                        selectedOrganism === organism.id
                          ? 'bg-neon-purple/20 text-neon-purple'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {organism.name} ({organism.count})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:w-3/4 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search data..."
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-aqua/50"
                />
              </div>
              <Button variant="secondary" size="sm">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
            <Button variant="neon" size="sm">
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {selectedDataset === 'genomics' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Gene Expression Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredGenomicsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="gene" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Bar dataKey="expression" fill="#00FFFF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {selectedDataset === 'radiation' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Radiation Exposure Monitoring</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={radiationData}>
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
                    <Line type="monotone" dataKey="iss" stroke="#00FFFF" strokeWidth={2} name="ISS" />
                    <Line type="monotone" dataKey="mars" stroke="#FF6B35" strokeWidth={2} name="Mars" />
                    <Line type="monotone" dataKey="moon" stroke="#8B5CF6" strokeWidth={2} name="Moon" />
                    <Line type="monotone" dataKey="deep" stroke="#10B981" strokeWidth={2} name="Deep Space" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {selectedDataset === 'proteomics' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Protein Expression Changes</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={proteinData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      type="number" 
                      dataKey="fold_change" 
                      stroke="#9CA3AF" 
                      name="Fold Change"
                      domain={[0, 2.5]}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="p_value" 
                      stroke="#9CA3AF" 
                      name="P-value"
                      domain={[0, 0.2]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value, name) => [value, name === 'fold_change' ? 'Fold Change' : 'P-value']}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.protein || ''}
                    />
                    <Scatter dataKey="p_value" fill="#8B5CF6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <ChartBarIcon className="w-6 h-6 text-neon-aqua" />
                <h4 className="font-semibold text-white">Data Quality</h4>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">98.7%</div>
              <div className="text-sm text-gray-400">Samples passed QC</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 text-neon-purple">📊</div>
                <h4 className="font-semibold text-white">Processing</h4>
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">24</div>
              <div className="text-sm text-gray-400">Jobs in queue</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 text-neon-orange">💾</div>
                <h4 className="font-semibold text-white">Storage</h4>
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">2.4TB</div>
              <div className="text-sm text-gray-400">Total data size</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};