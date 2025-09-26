import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, X } from 'lucide-react';
import Navigation from '../components/Navigation';
import ResultCard from '../components/ResultCard';
import Inspector from '../components/Inspector';
import Sidebar from '../components/Sidebar';
import { loadPublications, searchPublications, parseAdvancedQuery, type Publication, type SearchQuery, type SearchResult } from '../lib/searchEngine';

const Dashboard = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [parsedQuery, setParsedQuery] = useState<SearchQuery>({});
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [savedViews, setSavedViews] = useState<Record<string, SearchQuery>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Chatbot state
  // Start with chatbot closed on initial dashboard load
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isLoading?: boolean;
  }>>([
    {
      id: '1',
      content: "Hello! I'm your BioGuide assistant. I can help you search publications, explain research concepts, and analyze data. What would you like to know?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Load publications on mount
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await loadPublications();
        setPublications(data);
        
        // Initial search with empty query to show all results
        const results = searchPublications(data, {}, 1, resultsPerPage);
        setSearchResults(results);
      } catch (error) {
        console.error('Failed to load publications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublications();
  }, [resultsPerPage]);

  // Update search results when query or pagination changes
  useEffect(() => {
    if (publications.length > 0) {
      const results = searchPublications(publications, parsedQuery, currentPage, resultsPerPage);
      setSearchResults(results);
      setSelectedIndex(0); // Reset selection when search changes
    }
  }, [publications, parsedQuery, currentPage, resultsPerPage]);

  // Parse search query
  useEffect(() => {
    const parsed = parseAdvancedQuery(searchQuery);
    setParsedQuery(parsed);
    setCurrentPage(1); // Reset to first page when query changes
  }, [searchQuery]);

  // Load saved views from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('FF BioGuide_saved_views');
    if (saved) {
      setSavedViews(JSON.parse(saved));
    }
  }, []);

  // Chatbot functions
  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: chatInput.trim(),
      role: 'user' as const,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    // Add loading message
    const loadingMessage = {
      id: `loading-${Date.now()}`,
      content: '',
      role: 'assistant' as const,
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: {
            currentQuery: parsedQuery,
            selectedPublication: selectedPublication?.id,
            searchResults: searchResults?.total
          }
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // Remove loading message and add response
      setChatMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: Date.now().toString(),
          content: data.message || 'Sorry, I encountered an error processing your request.',
          role: 'assistant' as const,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove loading message and add error response
      setChatMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: Date.now().toString(),
          content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
          role: 'assistant' as const,
          timestamp: new Date()
        }];
      });
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, isChatLoading, parsedQuery, selectedPublication, searchResults]);

  const clearChatHistory = useCallback(() => {
    setChatMessages([{
      id: '1',
      content: "Hello! I'm your BioGuide assistant. I can help you search publications, explain research concepts, and analyze data. What would you like to know?",
      role: 'assistant',
      timestamp: new Date()
    }]);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Don't interfere with chat input
      if (e.target instanceof HTMLInputElement && e.target.placeholder?.includes('Ask me')) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendChatMessage();
        }
        return;
      }

      if (!searchResults?.publications.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            Math.min(prev + 1, searchResults.publications.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          if (e.target === searchInputRef.current) return;
          e.preventDefault();
          const selected = searchResults.publications[selectedIndex];
          if (selected) {
            setSelectedPublication(selected);
            setIsInspectorOpen(true);
          }
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'Escape':
          if (isInspectorOpen) {
            setIsInspectorOpen(false);
          } else {
            searchInputRef.current?.blur();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [searchResults, selectedIndex, isInspectorOpen, sendChatMessage]);

  const saveView = useCallback((name: string) => {
    const newSavedViews = { ...savedViews, [name]: parsedQuery };
    setSavedViews(newSavedViews);
    localStorage.setItem('FF BioGuide_saved_views', JSON.stringify(newSavedViews));
  }, [savedViews, parsedQuery]);

  const loadView = useCallback((query: SearchQuery) => {
    // Convert query back to search string
    const queryParts: string[] = [];
    
    if (query.text) queryParts.push(query.text);
    if (query.organism) queryParts.push(`organism:"${query.organism}"`);
    if (query.assay) queryParts.push(`assay:"${query.assay}"`);
    if (query.mission) queryParts.push(`mission:"${query.mission}"`);
    if (query.source) queryParts.push(`source:"${query.source}"`);
    if (query.yearFrom) queryParts.push(`year>=${query.yearFrom}`);
    if (query.yearTo) queryParts.push(`year<=${query.yearTo}`);

    setSearchQuery(queryParts.join(' '));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cosmic-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading publications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          searchResults={searchResults}
          onFacetSelect={(facetType, value) => {
            const queryParts = [searchQuery];
            queryParts.push(`${facetType}:"${value}"`);
            setSearchQuery(queryParts.join(' ').trim());
          }}
          savedViews={savedViews}
          onLoadView={loadView}
          onSaveView={(name) => {
            if (name.trim()) {
              saveView(name.trim());
            }
          }}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Header */}
          <div className="glass-dark border-b border-slate-700/50 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search publications... Try: organism:mice assay:proteomics year>=2020"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cosmic-400 focus:ring-2 focus:ring-cosmic-400/20 text-lg transition-colors"
                />
              </div>

              {/* Query Visualization */}
              {Object.keys(parsedQuery).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {parsedQuery.text && (
                    <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                      Text: "{parsedQuery.text}"
                    </span>
                  )}
                  {parsedQuery.organism && (
                    <span className="px-3 py-1 bg-bio-500/20 text-bio-300 rounded-lg text-sm">
                      Organism: {parsedQuery.organism}
                    </span>
                  )}
                  {parsedQuery.assay && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm">
                      Assay: {parsedQuery.assay}
                    </span>
                  )}
                  {parsedQuery.mission && (
                    <span className="px-3 py-1 bg-cosmic-500/20 text-cosmic-300 rounded-lg text-sm">
                      Mission: {parsedQuery.mission}
                    </span>
                  )}
                  {parsedQuery.source && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm">
                      Source: {parsedQuery.source}
                    </span>
                  )}
                  {(parsedQuery.yearFrom || parsedQuery.yearTo) && (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg text-sm">
                      Year: {parsedQuery.yearFrom ? `${parsedQuery.yearFrom}+` : ''} 
                      {parsedQuery.yearTo ? `≤${parsedQuery.yearTo}` : ''}
                    </span>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm">
                    {searchResults?.total || 0} results
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-cosmic-500 text-white' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-cosmic-500 text-white' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">Show:</span>
                    <select
                      value={resultsPerPage}
                      onChange={(e) => setResultsPerPage(parseInt(e.target.value))}
                      className="bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto p-6">
              {searchResults?.publications.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">No results found</h3>
                  <p className="text-slate-500">Try adjusting your search criteria</p>
                </div>
              ) : (
                <>
                  <motion.div
                    className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {searchResults?.publications.map((publication, index) => (
                      <ResultCard
                        key={publication.id}
                        publication={publication}
                        isSelected={index === selectedIndex}
                        viewMode={viewMode}
                        onSelect={() => {
                          setSelectedIndex(index);
                          setSelectedPublication(publication);
                          setIsInspectorOpen(true);
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {searchResults && searchResults.total > resultsPerPage && (
                    <div className="mt-8 flex justify-center">
                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: Math.ceil(searchResults.total / resultsPerPage) },
                          (_, i) => i + 1
                        ).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-cosmic-500 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Inspector Panel */}
        <Inspector
          isOpen={isInspectorOpen}
          publication={selectedPublication}
          onClose={() => setIsInspectorOpen(false)}
        />
      </div>

      {/* AI Chatbot */}
      {isChatbotOpen && (
        <div className="fixed bottom-4 right-4 w-80">
          <div className="glass-dark rounded-lg border border-slate-700/50 shadow-2xl">
            {/* Chatbot Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cosmic-500 to-bio-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">BioGuide Assistant</h3>
                  <p className="text-slate-400 text-xs">
                    {isChatLoading ? 'Thinking...' : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChatHistory}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                  title="Clear chat"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsChatbotOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              ref={chatMessagesRef}
              className="h-64 p-4 overflow-y-auto space-y-3"
            >
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'items-start gap-3'}`}>
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 bg-gradient-to-br from-cosmic-500 to-bio-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  )}
                  <div className={`rounded-lg p-3 max-w-[220px] ${
                    message.role === 'user' 
                      ? 'bg-cosmic-500/20' 
                      : 'bg-slate-800/50'
                  }`}>
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask me anything about biology research..."
                  className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 text-sm focus:border-cosmic-400 focus:ring-1 focus:ring-cosmic-400/20 transition-colors"
                  disabled={isChatLoading}
                />
                <button 
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-cosmic-500 hover:bg-cosmic-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Toggle Button */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-cosmic-500 to-bio-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          title="Open AI Assistant"
        >
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Dashboard;