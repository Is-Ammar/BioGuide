import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Bookmark, Download, Trash2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../lib/auth';
import { loadPublications, type Publication } from '../lib/searchEngine';

const Profile = () => {
  const { user, logout } = useAuth();
  const [savedPublications, setSavedPublications] = useState<Publication[]>([]);
  const [favoritePublications, setFavoritePublications] = useState<Publication[]>([]);
  const [activeTab, setActiveTab] = useState<'saved' | 'favorites'>('saved');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const loadUserPublications = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        setSavedPublications([]);
        setFavoritePublications([]);
      } catch (error) {
        console.error('Failed to load user publications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPublications();
  }, [user]);

  const handleExportSaved = () => {
    if (savedPublications.length === 0) return;
    
    const exportData = {
      exportDate: new Date().toISOString(),
      user: user?.email,
      publications: savedPublications.map(pub => ({
        id: pub.id,
        title: pub.title,
        authors: pub.authors,
        year: pub.year,
        doi: pub.doi,
        url: pub.url
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FF BioGuide-saved-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
            <p className="text-slate-400 mb-6">You need to be signed in to view your profile.</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cosmic-500 text-white rounded-lg hover:bg-cosmic-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <div className="glass-dark border-b border-slate-700/50">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.first_name} {user.last_name}</h1>
                  <p className="text-slate-400">{user.email}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleExportSaved}
                    disabled={savedPublications.length === 0}
                    className="flex items-center gap-2 px-4 py-2 glass text-slate-300 hover:text-white hover:neon-glow transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Saved</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass-dark p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Bookmark className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Saved Publications</h3>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-1">
                {0}
              </p>
              <p className="text-slate-400 text-sm">publications in your library</p>
            </div>

            <div className="glass-dark p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Favorites</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-400 mb-1">
                {0}
              </p>
              <p className="text-slate-400 text-sm">starred publications</p>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex gap-4 border-b border-slate-700">
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'saved'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                Saved Publications ({0})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'favorites'
                    ? 'text-yellow-400 border-yellow-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                Favorites ({0})
              </button>
            </div>
          </motion.div>

          {/* Publication Lists */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-cosmic-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Loading publications...</p>
              </div>
            ) : (
              <>
                {activeTab === 'saved' && (
                  <div className="space-y-4">
                    {savedPublications.length === 0 ? (
                      <div className="text-center py-12">
                        <Bookmark className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-400 mb-2">No saved publications</h3>
                        <p className="text-slate-500 mb-6">Start building your research library</p>
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-cosmic-500 text-white rounded-lg hover:bg-cosmic-600 transition-colors"
                        >
                          Explore Publications
                        </Link>
                      </div>
                    ) : (
                      savedPublications.map(publication => (
                        <div key={publication.id} className="glass-dark p-6 rounded-xl">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <Link
                                to={`/publication/${publication.id}`}
                                className="text-lg font-semibold text-white hover:text-cosmic-300 transition-colors mb-2 block"
                              >
                                {publication.title}
                              </Link>
                              <p className="text-slate-400 text-sm mb-2">
                                {publication.authors.slice(0, 3).map(author => 
                                  `${author.givenNames} ${author.surname}`
                                ).join(', ')} • {publication.year}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-bio-500/20 text-bio-300 rounded text-xs">
                                  {publication.organism}
                                </span>
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                  {publication.assay}
                                </span>
                                <span className="px-2 py-1 bg-cosmic-500/20 text-cosmic-300 rounded text-xs">
                                  {publication.mission}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const updatedUser = {
                                  ...user,
                                  savedPublications: user.savedPublications.filter(id => id !== publication.id)
                                };
                                localStorage.setItem('FF BioGuide_user', JSON.stringify(updatedUser));
                                setSavedPublications(prev => prev.filter(p => p.id !== publication.id));
                              }}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="space-y-4">
                    {favoritePublications.length === 0 ? (
                      <div className="text-center py-12">
                        <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-400 mb-2">No favorite publications</h3>
                        <p className="text-slate-500 mb-6">Star publications to add them to your favorites</p>
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-cosmic-500 text-white rounded-lg hover:bg-cosmic-600 transition-colors"
                        >
                          Explore Publications
                        </Link>
                      </div>
                    ) : (
                      favoritePublications.map(publication => (
                        <div key={publication.id} className="glass-dark p-6 rounded-xl">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <Link
                                to={`/publication/${publication.id}`}
                                className="text-lg font-semibold text-white hover:text-cosmic-300 transition-colors mb-2 block"
                              >
                                {publication.title}
                              </Link>
                              <p className="text-slate-400 text-sm mb-2">
                                {publication.authors.slice(0, 3).map(author => 
                                  `${author.givenNames} ${author.surname}`
                                ).join(', ')} • {publication.year}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-bio-500/20 text-bio-300 rounded text-xs">
                                  {publication.organism}
                                </span>
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                  {publication.assay}
                                </span>
                                <span className="px-2 py-1 bg-cosmic-500/20 text-cosmic-300 rounded text-xs">
                                  {publication.mission}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const updatedUser = {
                                  ...user,
                                  favoritePublications: user.favoritePublications.filter(id => id !== publication.id)
                                };
                                localStorage.setItem('FF BioGuide_user', JSON.stringify(updatedUser));
                                setFavoritePublications(prev => prev.filter(p => p.id !== publication.id));
                              }}
                              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;