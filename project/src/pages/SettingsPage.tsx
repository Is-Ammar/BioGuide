import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  UserIcon, 
  BellIcon, 
  KeyIcon, 
  CogIcon,
  MoonIcon,
  SunIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    missions: true,
    alerts: true,
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: KeyIcon },
    { id: 'system', name: 'System', icon: CogIcon },
  ];

  return (
    <div className="space-y-6">
      <Header 
        title="Settings" 
        subtitle="Manage your account and system preferences"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-neon-aqua/20 text-neon-aqua border border-neon-aqua/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="lg:w-3/4">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Profile Information</h3>
                <div className="flex items-center space-x-6 mb-6">
                  <img
                    src="https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-neon-aqua/50"
                  />
                  <div>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                    <p className="text-sm text-gray-400 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" defaultValue="Dr. Sarah Chen" />
                  <Input label="Email" defaultValue="sarah.chen@nasa.gov" />
                  <Input label="Job Title" defaultValue="Mission Scientist" />
                  <Input label="Department" defaultValue="Space Biology" />
                  <Input label="Phone" defaultValue="+1 (555) 123-4567" />
                  <Input label="Location" defaultValue="Houston, TX" />
                </div>
                <div className="flex justify-end mt-6">
                  <Button variant="neon">Save Changes</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Delivery Methods</h4>
                    <div className="space-y-4">
                      {Object.entries({
                        email: 'Email Notifications',
                        push: 'Push Notifications',
                        sms: 'SMS Notifications',
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-300">{label}</span>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[key as keyof typeof notifications] ? 'bg-neon-aqua' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Notification Types</h4>
                    <div className="space-y-4">
                      {Object.entries({
                        missions: 'Mission Updates',
                        alerts: 'Critical Alerts',
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-300">{label}</span>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[key as keyof typeof notifications] ? 'bg-neon-aqua' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <Input type="password" label="Current Password" />
                      <Input type="password" label="New Password" />
                      <Input type="password" label="Confirm New Password" />
                    </div>
                    <Button variant="neon" className="mt-4">Update Password</Button>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-lg font-medium text-white mb-4">API Keys</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Production API Key</p>
                          <p className="text-gray-400 text-sm">Last used 2 hours ago</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm">Regenerate</Button>
                          <Button variant="ghost" size="sm">Revoke</Button>
                        </div>
                      </div>
                      <Button variant="secondary">Generate New API Key</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">System Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {darkMode ? <MoonIcon className="w-5 h-5 text-gray-400" /> : <SunIcon className="w-5 h-5 text-yellow-400" />}
                      <div>
                        <p className="text-white font-medium">Theme</p>
                        <p className="text-gray-400 text-sm">Choose your preferred theme</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-neon-aqua' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Language</p>
                        <p className="text-gray-400 text-sm">Select your preferred language</p>
                      </div>
                    </div>
                    <select className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-aqua/50">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Data Management</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Auto-refresh Data</p>
                          <p className="text-gray-400 text-sm">Automatically refresh dashboard data</p>
                        </div>
                        <select className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-aqua/50">
                          <option value="30">Every 30 seconds</option>
                          <option value="60">Every minute</option>
                          <option value="300">Every 5 minutes</option>
                          <option value="0">Manual only</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Cache Duration</p>
                          <p className="text-gray-400 text-sm">How long to cache data locally</p>
                        </div>
                        <select className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-aqua/50">
                          <option value="1">1 hour</option>
                          <option value="6">6 hours</option>
                          <option value="24">24 hours</option>
                          <option value="168">1 week</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};