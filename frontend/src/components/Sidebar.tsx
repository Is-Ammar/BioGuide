import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, Save, Trash2, Plus } from 'lucide-react';
import { type SearchResult, type SearchQuery } from '../lib/searchEngine';

// Smooth minimal variants (slower)
const sidebarVariants = {
  hidden: { x: -56, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.55, ease: 'easeOut' } },
  exit: { x: -48, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }
};

const collapseVariants = {
  hidden: { opacity: 0, height: 0 },
  show: { opacity: 1, height: 'auto', transition: { duration: 0.45, ease: 'easeOut' } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.35, ease: 'easeIn' } }
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  searchResults: SearchResult | null;
  onFacetSelect: (facetType: string, value: string) => void;
  savedViews: Record<string, SearchQuery>;
  onLoadView: (query: SearchQuery) => void;
  onSaveView: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  searchResults,
  onFacetSelect,
  savedViews,
  onLoadView,
  onSaveView
}) => {
  const [newViewName, setNewViewName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSaveView = () => {
    if (newViewName.trim()) {
      onSaveView(newViewName.trim());
      setNewViewName('');
      setShowSaveInput(false);
    }
  };

  const FacetSection = ({ 
    title, 
    facets, 
    facetType 
  }: { 
    title: string; 
    facets: Record<string, number>; 
    facetType: string;
  }) => {
    const sortedFacets = Object.entries(facets).sort(([,a], [,b]) => b - a);
    return (
      <div className="mb-6">
  <h3 className="text-sm font-semibold text-semantic-text-secondary mb-3 tracking-wide">{title}</h3>
        <div className="space-y-2">
          {sortedFacets.slice(0, 8).map(([value, count], i) => (
            <motion.button
              key={value}
              onClick={() => onFacetSelect(facetType, value)}
              className="flex items-center justify-between w-full p-2 text-left text-sm text-semantic-text-secondary hover:text-semantic-text-primary rounded-lg transition-colors group bg-semantic-surface-1/20 hover:bg-semantic-surface-2/40 border border-transparent hover:border-semantic-border-accent/40 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.05 * i } }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
            >
              <span className="truncate flex-1 group-hover:text-accent">{value}</span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-mono bg-semantic-surface-2/60 text-semantic-text-dim border border-semantic-border-muted/40 group-hover:border-semantic-border-accent/40">{count}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-20 z-40 p-2 rounded-xl text-semantic-text-secondary hover:text-semantic-text-primary transition-colors bg-semantic-surface-1/70 border border-semantic-border-muted hover:border-semantic-border-accent shadow-lg shadow-black/40 backdrop-blur-md"
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-80 overflow-y-auto bg-gradient-to-br from-semantic-surface-1/90 via-semantic-surface-1/80 to-semantic-surface-2/90 border-r border-semantic-border-muted backdrop-blur-xl shadow-[0_0_0_1px_rgba(56,189,248,0.12),0_8px_40px_-10px_rgba(0,0,0,0.6)]"
            variants={sidebarVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-2 mb-7 ml-9">
                <Filter className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-semantic-text-primary tracking-wide">Filters & Views</h2>
              </div>

              {/* Saved Views */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-semantic-text-secondary tracking-wide">Saved Views</h3>
                  <button
                    onClick={() => setShowSaveInput(!showSaveInput)}
                    className="p-1 text-semantic-text-secondary hover:text-semantic-text-primary transition-colors rounded-md hover:bg-semantic-surface-2/40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {showSaveInput && (
                    <motion.div
                      className="mb-3"
                      variants={collapseVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newViewName}
                          onChange={(e) => setNewViewName(e.target.value)}
                          placeholder="View name..."
                          className="flex-1 px-3 py-2 rounded-lg text-semantic-text-primary placeholder-semantic-text-dim text-sm bg-semantic-surface-2/70 border border-semantic-border-muted focus:border-semantic-border-accent focus:ring-2 focus:ring-[color:var(--color-ring-accent)] outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveView();
                            } else if (e.key === 'Escape') {
                              setShowSaveInput(false);
                              setNewViewName('');
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={handleSaveView}
                          className="px-3 py-2 rounded-lg text-sm font-medium text-semantic-text-primary bg-accent/20 hover:bg-accent/30 border border-semantic-border-accent shadow-inner shadow-cosmic-500/20 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {Object.entries(savedViews).map(([name, query], i) => (
                    <motion.div
                      key={name}
                      className="flex items-center justify-between p-2 rounded-lg group bg-semantic-surface-1/30 border border-transparent hover:border-semantic-border-accent/40 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.04 * i } }}
                      exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
                    >
                      <button
                        onClick={() => onLoadView(query)}
                        className="flex-1 text-left text-sm text-semantic-text-secondary hover:text-semantic-text-primary transition-colors"
                      >
                        {name}
                      </button>
                      <button
                        onClick={() => {
                          const updatedViews = { ...savedViews };
                          delete updatedViews[name];
                          localStorage.setItem('FF BioGuide_saved_views', JSON.stringify(updatedViews));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-semantic-text-dim hover:text-danger transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                  {Object.keys(savedViews).length === 0 && (
                    <p className="text-semantic-text-dim text-xs italic">No saved views yet</p>
                  )}
                </div>
              </div>

              {/* Facets */}
              {searchResults && (
                <div className="space-y-6">
                  <FacetSection 
                    title="Sources" 
                    facets={searchResults.facets.sources} 
                    facetType="source"
                  />
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-semantic-text-secondary mb-3 tracking-wide">Years</h3>
                    <div className="space-y-2">
                      {Object.entries(searchResults.facets.years)
                        .sort(([a], [b]) => parseInt(b) - parseInt(a))
                        .slice(0, 8)
                        .map(([year, count], i) => (
                          <motion.button
                            key={year}
                            onClick={() => onFacetSelect('year', year)}
                            className="flex items-center justify-between w-full p-2 text-left text-sm text-semantic-text-secondary hover:text-semantic-text-primary rounded-lg transition-colors group bg-semantic-surface-1/20 hover:bg-semantic-surface-2/40 border border-transparent hover:border-semantic-border-accent/40 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.05 * i } }}
                            exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
                          >
                            <span className="group-hover:text-accent">{year}</span>
                            <span className="ml-2 px-2 py-0.5 rounded text-xs font-mono bg-semantic-surface-2/60 text-semantic-text-dim border border-semantic-border-muted/40 group-hover:border-semantic-border-accent/40">{count}</span>
                          </motion.button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;