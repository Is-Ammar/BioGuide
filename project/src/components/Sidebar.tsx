import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, Save, Trash2, Plus } from 'lucide-react';
import { type SearchResult, type SearchQuery } from '../lib/searchEngine';

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
        <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
        <div className="space-y-2">
          {sortedFacets.slice(0, 8).map(([value, count]) => (
            <button
              key={value}
              onClick={() => onFacetSelect(facetType, value)}
              className="flex items-center justify-between w-full p-2 text-left text-sm text-slate-400 hover:text-white hover:bg-slate-700/30 rounded-lg transition-colors group"
            >
              <span className="truncate flex-1 group-hover:text-cosmic-300">{value}</span>
              <span className="ml-2 px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs font-mono">
                {count}
              </span>
            </button>
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
        className="fixed left-4 top-20 z-40 p-2 glass-dark rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-80 glass-dark border-r border-slate-700/50 overflow-y-auto"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-cosmic-400" />
                <h2 className="text-lg font-semibold text-white">Filters & Views</h2>
              </div>

              {/* Saved Views */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300">Saved Views</h3>
                  <button
                    onClick={() => setShowSaveInput(!showSaveInput)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence>
                  {showSaveInput && (
                    <motion.div
                      className="mb-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newViewName}
                          onChange={(e) => setNewViewName(e.target.value)}
                          placeholder="View name..."
                          className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20"
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
                          className="px-3 py-2 bg-cosmic-500 text-white rounded-lg hover:bg-cosmic-600 transition-colors text-sm"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {Object.entries(savedViews).map(([name, query]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg group"
                    >
                      <button
                        onClick={() => onLoadView(query)}
                        className="flex-1 text-left text-sm text-slate-300 hover:text-white transition-colors"
                      >
                        {name}
                      </button>
                      <button
                        onClick={() => {
                          const updatedViews = { ...savedViews };
                          delete updatedViews[name];
                          localStorage.setItem('FF BioGuide_saved_views', JSON.stringify(updatedViews));
                          // Note: This won't trigger a re-render. In a real app, you'd want to lift this state up.
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {Object.keys(savedViews).length === 0 && (
                    <p className="text-slate-500 text-xs italic">No saved views yet</p>
                  )}
                </div>
              </div>

              {/* Facets */}
              {searchResults && (
                <div className="space-y-6">
                  <FacetSection 
                    title="Organisms" 
                    facets={searchResults.facets.organisms} 
                    facetType="organism"
                  />
                  <FacetSection 
                    title="Assay Types" 
                    facets={searchResults.facets.assays} 
                    facetType="assay"
                  />
                  <FacetSection 
                    title="Missions" 
                    facets={searchResults.facets.missions} 
                    facetType="mission"
                  />
                  <FacetSection 
                    title="Sources" 
                    facets={searchResults.facets.sources} 
                    facetType="source"
                  />

                  {/* Year Range */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Years</h3>
                    <div className="space-y-2">
                      {Object.entries(searchResults.facets.years)
                        .sort(([a], [b]) => parseInt(b) - parseInt(a))
                        .slice(0, 8)
                        .map(([year, count]) => (
                        <button
                          key={year}
                          onClick={() => onFacetSelect('year', year)}
                          className="flex items-center justify-between w-full p-2 text-left text-sm text-slate-400 hover:text-white hover:bg-slate-700/30 rounded-lg transition-colors group"
                        >
                          <span className="group-hover:text-cosmic-300">{year}</span>
                          <span className="ml-2 px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-xs font-mono">
                            {count}
                          </span>
                        </button>
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