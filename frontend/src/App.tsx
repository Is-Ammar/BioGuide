import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './lib/auth';
import LoadingSpinner from './components/LoadingSpinner';
import ChatPanel from './components/ChatPanel';
import ChatButton from './components/ChatButton';
import RequireAuth from './components/RequireAuth';
import ToastViewport from './components/ToastViewport';

const Landing = React.lazy(() => import('./pages/Landing'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PublicationDetail = React.lazy(() => import('./pages/PublicationDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/Login'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function InnerApp() {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
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
  const [conversationId, setConversationId] = useState(() => (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)));
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatErrorDetail, setChatErrorDetail] = useState<string | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatRequestControllerRef = useRef<AbortController | null>(null);
  const loadingMessageIdRef = useRef<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';

  // Restore chat history
  useEffect(() => {
    try {
      const raw = localStorage.getItem('BioGuide_chat_history');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.messages && Array.isArray(parsed.messages)) {
          const restored = parsed.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
          if (restored.length) setChatMessages(restored);
        }
        if (parsed?.conversationId) setConversationId(parsed.conversationId);
      }
    } catch (_) {}
  }, []);

  // Persist chat history (skip loading placeholders)
  useEffect(() => {
    try {
      const storable = chatMessages
        .filter(m => !(m as any).isLoading)
        .map(m => ({ id: m.id, role: m.role, content: m.content, timestamp: m.timestamp.toISOString() }));
      localStorage.setItem('BioGuide_chat_history', JSON.stringify({ conversationId, messages: storable }));
    } catch (_) {}
  }, [chatMessages, conversationId]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading) return;
    setChatErrorDetail(null);

    if (chatRequestControllerRef.current) {
      chatRequestControllerRef.current.abort();
    }
    const controller = new AbortController();
    chatRequestControllerRef.current = controller;

    const userMessage = {
      id: Date.now().toString(),
      content: chatInput.trim(),
      role: 'user' as const,
      timestamp: new Date()
    };
    const loadingId = `loading-${Date.now()}`;
    loadingMessageIdRef.current = loadingId;

    setChatMessages(prev => [...prev, userMessage, { id: loadingId, content: '', role: 'assistant', timestamp: new Date(), isLoading: true }]);
    setChatInput('');
    setIsChatLoading(true);

    const historyMessages = [...chatMessages, userMessage].filter(m => !(m as any).isLoading);
    const DELIMITER = '<|BIOGUIDE_DIALOG_DELIM|>';
    
    let questionWithHistory = '';
    if (historyMessages.length > 1) {
      const previousMessages = historyMessages.slice(0, -1);
      const historyParts: string[] = [];
      
      for (let i = 0; i < previousMessages.length; i++) {
        const msg = previousMessages[i];
        const rolePrefix = msg.role === 'user' ? 'USER' : 'ASSISTANT';
        historyParts.push(`${rolePrefix}: ${msg.content}`);
      }
      
      questionWithHistory = historyParts.join('\n') + `\n${DELIMITER}\n${userMessage.content}`;
    } else {
      questionWithHistory = userMessage.content;
    }
    
    const timeoutMs = 100000;
    const timeoutPromise = new Promise<never>((_, reject) => { const t = setTimeout(() => { clearTimeout(t); reject(new Error('Request timed out')); }, timeoutMs); });

    try {
      const token = localStorage.getItem('FF_BioGuide_token');
      const response = await Promise.race([
        fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            question: questionWithHistory
          }),
          signal: controller.signal,
          mode: 'cors'
        }),
        timeoutPromise
      ]);
      if (!(response instanceof Response)) throw new Error('Unexpected response type');
      if (response.status === 401) {
        throw new Error('HTTP 401 Unauthorized');
      }
      if (!response.ok) { const text = await response.text().catch(() => ''); throw new Error(`HTTP ${response.status} ${response.statusText} ${text}`); }
      const data = await response.json().catch(() => ({ answer: '' }));
      const answer = data.answer || data.message || 'Sorry, I encountered an error processing your request.';
      setChatMessages(prev => prev.map(m => m.id === loadingId ? { id: Date.now().toString(), content: answer, role: 'assistant', timestamp: new Date() } : m));
    } catch (error: any) {
      let userFacing = 'Connection issue. Please try again.';
      if (error?.name === 'AbortError') userFacing = 'Request cancelled.';
      else if (error?.message?.includes('timed out')) userFacing = 'The model is taking too long. Try rephrasing or resubmitting.';
  else if (error?.message?.includes('Failed to fetch')) userFacing = 'Network/CORS error. Check server CORS headers.';
  else if (error?.message?.includes('401')) userFacing = 'You must be logged in to use the AI assistant.';
      setChatErrorDetail(error?.message || String(error));
      setChatMessages(prev => prev.map(m => m.id === loadingId ? { id: Date.now().toString(), content: userFacing, role: 'assistant', timestamp: new Date() } : m));
    } finally {
      setIsChatLoading(false);
      loadingMessageIdRef.current = null;
      chatRequestControllerRef.current = null;
    }
  }, [chatInput, isChatLoading, chatMessages, conversationId]);

  const clearChatHistory = useCallback(() => {
    setChatMessages([{ id: '1', content: "Hello! I'm your BioGuide assistant. I can help you search publications, explain research concepts, and analyze data. What would you like to know?", role: 'assistant', timestamp: new Date() }]);
    localStorage.removeItem('BioGuide_chat_history');
    setConversationId(crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
  }, []);

  return (
      <div className="min-h-screen bg-slate-950">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <PageWrapper>
                  <Landing />
                </PageWrapper>
              } />
              <Route path="/dashboard" element={
                <PageWrapper>
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                </PageWrapper>
              } />
              <Route path="/publication/:id" element={
                <PageWrapper>
                  <PublicationDetail />
                </PageWrapper>
              } />
              <Route path="/profile" element={
                <PageWrapper>
                  <Profile />
                </PageWrapper>
              } />
              <Route path="/login" element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              } />
              <Route path="/auth/callback" element={
                <PageWrapper>
                  <AuthCallback />
                </PageWrapper>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
        <ChatPanel
          isOpen={isChatOpen}
          messages={chatMessages}
          input={chatInput}
          onInputChange={setChatInput}
          onSend={sendChatMessage}
          onClose={() => setIsChatOpen(false)}
          onClear={clearChatHistory}
          isLoading={isChatLoading}
          errorDetail={chatErrorDetail}
          messagesRef={chatMessagesRef}
        />
        {!isChatOpen && (
          <ChatButton onClick={() => {
            if (!user) {
              window.location.href = '/login';
              return;
            }
            setIsChatOpen(true);
          }} />
        )}
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      {/* Toasts */}
      <ToastViewport />
      <InnerApp />
    </AuthProvider>
  );
}

export default App;