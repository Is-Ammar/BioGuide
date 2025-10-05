import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { User as UserIcon, Star, Bookmark, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../lib/auth';
import { loadPublications, type Publication } from '../lib/searchEngine';
import PublicationCard from '../components/profile/PublicationCard';
import { PublicationSkeleton } from '../components/profile/Skeletons';
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
  <div className="min-h-screen bg-semantic-surface-0 overflow-hidden relative text-semantic-text-primary transition-colors">
        <BackgroundStars count={30} variant="subtle" blur />
        <Navigation />
        <div className="pt-28 max-w-5xl mx-auto px-6">
          <div className="relative block h-64 sm:h-72 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499336315816-097655dcfbda?auto=format&fit=crop&w=1600&q=60)' }}>
              <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.75))] dark:bg-black/60" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <UserIcon className="w-20 h-20 text-accent mb-6" />
              <h1 className="text-3xl font-bold tracking-tight mb-4 text-semantic-text-primary drop-shadow-md">Sign in to build your research profile</h1>
              <p className="text-semantic-text-secondary max-w-xl mx-auto mb-6">Store and curate publications, mark favorites, and export structured datasets for downstream analysis.</p>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent-alt hover:brightness-110 px-8 py-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 text-white dark:text-semantic-text-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-semantic-surface-0 overflow-hidden relative font-sans text-semantic-text-primary transition-colors">
      <BackgroundStars count={100} variant="default" />
      <Navigation />
      {/* Hero Banner */}
      <section className="relative block h-[380px] sm:h-[440px] pt-20">
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: 'url(https://images.pexels.com/photos/2565420/pexels-photo-2565420.jpeg)' }}>
          <span className="absolute inset-0 bg-gradient-to-b from-semantic-surface-0/40 via-semantic-surface-0/65 to-semantic-surface-0 dark:from-black/60 dark:via-black/70 dark:to-gray-950 transition-colors" />
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-[70px] pointer-events-none">
          <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 2560 100">
            <polygon className="fill-gray-950" points="2560 0 2560 100 0 100" />
          </svg>
        </div>
      </section>

      {/* Profile Card */}
      <main className="relative -mt-48 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative bg-semantic-surface-1/85 backdrop-blur rounded-2xl shadow-xl border border-semantic-border-muted">
            <div className="px-6 sm:px-10 pb-10">
              <div className="flex flex-wrap justify-center -mt-32 relative">
                <div className="w-full lg:w-3/12 flex justify-center mb-6 lg:mb-0 order-2 lg:order-2 lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2 z-10">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-accent-primary)_0%,transparent_70%)] opacity-60 blur-xl" />
                    <img
                      alt={user.first_name}
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.first_name + ' ' + user.last_name)}`}
                      className="relative shadow-2xl rounded-full h-40 w-40 object-cover border-4 border-semantic-border-accent/50"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 order-3 lg:order-3 flex justify-center lg:justify-end items-center">
                  {/* Match vertical spacing with stats section for alignment */}
                  <div className="flex mt-6 lg:mt-10">
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-2 bg-semantic-surface-2/70 hover:bg-semantic-surface-2 text-semantic-text-secondary hover:text-semantic-text-primary text-xs font-semibold px-4 py-2 rounded-md border border-semantic-border-muted hover:border-semantic-border-accent transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-5/12 px-4 order-1 lg:order-1 flex justify-center lg:justify-start">
                  <div className="flex flex-wrap gap-6 text-center mt-6 lg:mt-10">
                    <div className="p-3">
                      <span className="text-xl font-bold block tracking-wide text-accent">{stats.saved}</span>
                      <span className="text-xs uppercase text-semantic-text-dim">Saved</span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block tracking-wide text-warning">{stats.favorites}</span>
                      <span className="text-xs uppercase text-semantic-text-dim">Favorites</span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block tracking-wide text-accent-alt">{allPublications.length}</span>
                      <span className="text-xs uppercase text-semantic-text-dim">Publications</span>
                    </div>
                    <div className="p-3">
                      <span className="text-xl font-bold block tracking-wide text-accent">{new Date(user.createdAt).getFullYear()}</span>
                      <span className="text-xs uppercase text-semantic-text-dim">Member</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <h1 className="text-4xl font-semibold leading-tight mb-2 tracking-tight bg-gradient-to-r from-accent via-accent-alt to-accent bg-clip-text text-transparent dark:from-cosmic-300 dark:via-bio-300 dark:to-cosmic-400">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="text-sm leading-normal mt-0 mb-4 font-medium text-semantic-text-secondary uppercase tracking-wide flex items-center justify-center gap-2">
                  <i className="fas fa-map-marker-alt text-accent" aria-hidden />
                  <span>{user.country || 'Unknown Location'}</span>
                </div>
                <div className="mb-3 text-semantic-text-secondary flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="flex items-center gap-2 text-sm"><i className="fas fa-envelope text-semantic-text-dim" aria-hidden /> {user.email}</div>
                </div>
                <p className="max-w-2xl mx-auto text-semantic-text-secondary text-sm leading-relaxed">
                  Curating a personalized collection of biomedical research. Save papers, flag key resources, and export structured lists to accelerate discovery.
                </p>
              </div>

              {/* Tabs & Export Status */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-semantic-border-muted pt-6">
                <div className="flex gap-2 rounded-lg bg-semantic-surface-2/70 p-1 border border-semantic-border-muted/60">
                  {['saved','favorites'].map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t as 'saved'|'favorites')}
                      className={`px-4 py-2 text-xs font-medium rounded-md transition flex items-center gap-1 ${activeTab===t ? 'bg-gradient-to-br from-accent to-accent-alt text-white dark:text-white shadow' : 'text-semantic-text-secondary hover:text-semantic-text-primary'}`}
                    >
                      {t === 'saved' ? <Bookmark className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                      {t === 'saved' ? 'Saved' : 'Favorites'}
                      <span className="ml-1 text-[10px] rounded bg-semantic-surface-1/70 px-1.5 py-0.5 border border-semantic-border-muted/50">{t==='saved'?stats.saved:stats.favorites}</span>
                    </button>
                  ))}
                </div>
                {/* Export status removed */}
              </div>

              {/* Publication Lists */}
              <LayoutGroup>
                <div className="relative min-h-[200px] mt-8">
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
        </div>
      </main>
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