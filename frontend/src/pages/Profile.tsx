import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { User as UserIcon, Star, Bookmark, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../lib/auth';
import { loadPublications, type Publication } from '../lib/searchEngine';
import ProfileHero from '../components/profile/ProfileHero';
import StatCard from '../components/profile/StatCard';
import TabNav from '../components/profile/TabNav';
import PublicationCard from '../components/profile/PublicationCard';
import { PublicationSkeleton, StatSkeletons } from '../components/profile/Skeletons';
import EmptyState from '../components/profile/EmptyState';
import ConfirmDialog from '../components/profile/ConfirmDialog';
import BackgroundStars from '../components/BackgroundStars';

const Profile = () => {
  const { user, logout, savedIds, favoriteIds, toggleSave, toggleFavorite } = useAuth() as any;
  const [savedPublications, setSavedPublications] = useState<Publication[]>([]);
  const [favoritePublications, setFavoritePublications] = useState<Publication[]>([]);
  const [activeTab, setActiveTab] = useState<'saved' | 'favorites'>('saved');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'done'>('idle');
  const [allPublications, setAllPublications] = useState<Publication[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const pubs = await loadPublications();
        if (mounted) setAllPublications(pubs);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    const mapPublications = () => {
      setSavedPublications(allPublications.filter(p => savedIds?.includes(p.id)));
      setFavoritePublications(allPublications.filter(p => favoriteIds?.includes(p.id)));
      setIsLoading(false);
    };
    mapPublications();
  }, [user, savedIds, favoriteIds, allPublications]);

  const handleExportSaved = useCallback(() => {
    if (savedPublications.length === 0 || exportState === 'exporting') return;
    setExportState('exporting');
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
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FF_BioGuide-saved-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setExportState('done'), 300);
    setTimeout(() => setExportState('idle'), 2400);
  }, [savedPublications, exportState, user]);

  const requestDelete = useCallback((id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return;

    if (activeTab === 'saved') {
      await toggleSave(pendingDeleteId);
      setSavedPublications(prev => prev.filter(p => p.id !== pendingDeleteId));
    } else {
      await toggleFavorite(pendingDeleteId);
      setFavoritePublications(prev => prev.filter(p => p.id !== pendingDeleteId));
    }
    
    setPendingDeleteId(null);
    setConfirmOpen(false);
  }, [pendingDeleteId, activeTab, toggleSave, toggleFavorite]);

  const stats = useMemo(() => ({
    saved: savedPublications.length,
    favorites: favoritePublications.length
  }), [savedPublications.length, favoritePublications.length]);

  if (!user) {
    return (
      <div
        className="min-h-screen bg-gray-950 overflow-hidden relative"
        style={{
          backgroundImage: 'url(https://i.imgur.com/4fFEQts.png)',
          backgroundSize: '25px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '15% 15%',
          filter: 'brightness(0.9)'
        }}
      >
        <BackgroundStars count={30} variant="subtle" blur />
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-[60vh] px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <UserIcon className="w-20 h-20 text-slate-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold tracking-tight mb-4">Please Sign In</h1>
            <p className="text-slate-400 mb-8 leading-relaxed">Sign in to access your personalized research profile, saved publications, favorites, and more.</p>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-cosmic-500 to-cosmic-600 hover:from-cosmic-400 hover:to-cosmic-500 px-8 py-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-400/60">
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-950 overflow-hidden relative"
      style={{
        backgroundImage: 'url(https://i.imgur.com/4fFEQts.png)',
        backgroundSize: '25px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '15% 15%',
        filter: 'brightness(0.9)'
      }}
    >
      <BackgroundStars count={100} variant="default" />
      <Navigation />
      <div className="pt-24 pb-24 relative">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <ProfileHero
            user={user}
            onExport={handleExportSaved}
            onSignOut={logout}
            exportDisabled={savedPublications.length === 0}
            stats={stats}
          />

          {/* Stat Section */}
          {isLoading ? (
            <StatSkeletons />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard icon={<Bookmark className="w-5 h-5 text-cosmic-300" />} label="Saved" value={stats.saved} accent="cosmic" delay={0.05} />
              <StatCard icon={<Star className="w-5 h-5 text-yellow-300" />} label="Favorites" value={stats.favorites} accent="yellow" delay={0.1} />
              <StatCard icon={<BookMarked className="w-5 h-5 text-bio-300" />} label="Publications" value={allPublications.length} accent="bio" delay={0.15} />
              <StatCard icon={<UserIcon className="w-5 h-5 text-purple-300" />} label="Member" value={new Date(user.createdAt).getFullYear()} accent="purple" delay={0.2} />
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabNav
              tabs={[
                { id: 'saved', label: 'Saved', count: stats.saved },
                { id: 'favorites', label: 'Favorites', count: stats.favorites }
              ]}
              active={activeTab}
              onChange={(id) => setActiveTab(id as 'saved' | 'favorites')}
            />
            {exportState !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`text-xs font-medium px-3 py-1 rounded-full border backdrop-blur bg-slate-800/70 ${exportState==='done' ? 'border-bio-400/50 text-bio-300' : 'border-cosmic-400/50 text-cosmic-300'} shadow`}
              >
                {exportState === 'exporting' ? 'Exporting…' : 'Export Complete'}
              </motion.div>
            )}
          </div>

          {/* Publication Lists */}
          <LayoutGroup>
            <div className="relative min-h-[200px]">
              {isLoading ? (
                <PublicationSkeleton count={4} />
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'saved' ? (
                    <motion.div
                      key="saved"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4"
                    >
                      {savedPublications.length === 0 ? (
                        <EmptyState type="saved" />
                      ) : (
                        savedPublications.map((pub, i) => (
                          <PublicationCard key={pub.id} publication={pub} onRemove={() => requestDelete(pub.id)} index={i} />
                        ))
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="favorites"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4"
                    >
                      {favoritePublications.length === 0 ? (
                        <EmptyState type="favorites" />
                      ) : (
                        favoritePublications.map((pub, i) => (
                          <PublicationCard key={pub.id} publication={pub} onRemove={() => requestDelete(pub.id)} index={i} />
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </LayoutGroup>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Remove publication?"
        description="This will remove the publication from your list. You can re-add it later from the dashboard."
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Profile;