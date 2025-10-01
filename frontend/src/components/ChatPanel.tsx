import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatPanelProps {
  isOpen: boolean;
  messages: ChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
  onClear: () => void;
  isLoading: boolean;
  errorDetail: string | null;
  messagesRef: React.RefObject<HTMLDivElement>;
}

const PANEL_EASE = [0.22, 1, 0.36, 1] as const;
const backdropVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};
const panelVariants = {
  hidden: { x: -40, opacity: 0, filter: 'blur(6px)' },
  show: { x: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.45, ease: PANEL_EASE } },
  exit: { x: -32, opacity: 0, filter: 'blur(6px)', transition: { duration: 0.3, ease: PANEL_EASE } }
};

const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  messages,
  input,
  onInputChange,
  onSend,
  onClose,
  onClear,
  isLoading,
  errorDetail,
  messagesRef
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-full max-w-2xl glass-dark border-r border-slate-700/50 z-50 flex flex-col"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-cosmic-500 to-bio-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">BioGuide Assistant</h3>
                  <p className="text-slate-400 text-xs">{isLoading ? 'Thinking…' : 'Online'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClear}
                  className="text-slate-400 hover:text-white transition-colors text-xs px-2 py-1 rounded-lg hover:bg-slate-700/50"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'items-start gap-3'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 bg-gradient-to-br from-cosmic-500 to-bio-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  )}
                  <div className={`rounded-xl px-4 py-3 max-w-[70%] leading-relaxed text-sm shadow-sm ${
                    m.role === 'user' ? 'bg-cosmic-500/30 text-cosmic-50' : 'bg-slate-800/60 text-slate-200'
                  }`}>
                    {m.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce" style={{ animationDelay: '0.12s' }}></div>
                          <div className="w-2 h-2 bg-cosmic-400 rounded-full animate-bounce" style={{ animationDelay: '0.24s' }}></div>
                        </div>
                        <span className="text-xs text-slate-400">Thinking…</span>
                      </div>
                    ) : (
                      m.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:leading-relaxed prose-strong:text-white prose-a:text-cosmic-400 hover:prose-a:text-cosmic-300 prose-code:text-cosmic-300 prose-li:marker:text-slate-500"
                          components={{
                            code({node, className, children, ...props}) {
                              return <code className={`px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700 text-cosmic-300 text-[0.7rem] ${className || ''}`} {...props}>{children}</code>;
                            },
                            a({children, ...props}) {
                              return <a {...props} className="underline decoration-dotted underline-offset-2" target="_blank" rel="noopener noreferrer">{children}</a>;
                            }
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans break-words">{m.content}</pre>
                      )
                    )}
                  </div>
                </div>
              ))}
              {errorDetail && (
                <div className="text-[10px] text-red-400 opacity-70 break-words">Debug: {errorDetail}</div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 border-t border-slate-700/50 bg-slate-900/40">
              <form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Ask me anything about biology research..."
                  className="flex-1 resize-none h-12 max-h-40 bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm focus:border-cosmic-400 focus:ring-1 focus:ring-cosmic-400/30 transition-colors scrollbar-thin scrollbar-thumb-slate-700"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label={isLoading ? 'Sending message' : 'Send message'}
                  className="relative group bg-gradient-to-br from-cosmic-500 via-bio-500 to-cosmic-600 hover:from-cosmic-400 hover:via-bio-400 hover:to-cosmic-500 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md ring-1 ring-white/10 hover:ring-cosmic-300/40 disabled:ring-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-400/60 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute -inset-px rounded-lg bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 mix-blend-overlay pointer-events-none" />
                  <div className="relative flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 -translate-y-px" />
                    )}
                    <span className="tracking-wide">{isLoading ? 'Sending' : 'Send'}</span>
                  </div>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
