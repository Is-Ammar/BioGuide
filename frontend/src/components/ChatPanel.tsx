import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { useTheme } from '../lib/theme';
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-[color:var(--color-surface-0)]/30 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-full max-w-2xl z-50 flex flex-col overflow-hidden
            bg-gradient-to-b from-semantic-surface-1/90 via-semantic-surface-1/80 to-semantic-surface-2/90
            backdrop-blur-xl border-r border-semantic-border-muted shadow-[0_0_0_1px_var(--color-border-muted),0_8px_40px_-10px_rgba(0,0,0,0.55)]"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-semantic-border-muted bg-semantic-surface-1/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border border-semantic-border-accent bg-gradient-to-br from-accent/30 via-accent-alt/20 to-accent/10 flex items-center justify-center shadow-inner">
                  <span className="text-[11px] font-semibold tracking-wide text-semantic-text-primary">AI</span>
                  <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/20 to-transparent mix-blend-overlay opacity-60" />
                </div>
                <div className="leading-tight">
                  <h3 className="text-sm font-semibold text-semantic-text-primary tracking-wide">BioGuide Assistant</h3>
                  <p className="text-[11px] font-medium text-semantic-text-dim flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${isLoading ? 'bg-warning animate-pulse' : 'bg-success'} shadow-[0_0_0_2px_var(--color-surface-1)]`} />
                    {isLoading ? 'Thinking…' : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClear}
                  className="text-xs px-2 py-1 rounded-lg border border-transparent text-semantic-text-secondary hover:text-semantic-text-primary hover:border-semantic-border-accent bg-semantic-surface-2/40 hover:bg-semantic-surface-2/70 transition-colors"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg border border-transparent text-semantic-text-secondary hover:text-semantic-text-primary hover:border-semantic-border-accent bg-semantic-surface-2/40 hover:bg-semantic-surface-2/70 transition-colors"
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
                    <div className="w-8 h-8 rounded-full border border-semantic-border-accent bg-gradient-to-br from-accent/35 via-accent-alt/25 to-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                      <span className="text-[10px] font-semibold text-semantic-text-primary">AI</span>
                    </div>
                  )}
                  <div className={`rounded-xl px-4 py-3 max-w-[70%] leading-relaxed text-sm shadow-sm border transition-colors ${
                    m.role === 'user'
                      ? 'bg-accent/25 text-semantic-text-primary border-semantic-border-accent'
                      : 'bg-semantic-surface-2/60 text-semantic-text-secondary border-semantic-border-muted'
                  }`}>
                    {m.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.12s' }} />
                          <div className="w-2 h-2 rounded-full bg-accent-alt animate-bounce" style={{ animationDelay: '0.24s' }} />
                        </div>
                        <span className="text-[11px] text-semantic-text-dim">Thinking…</span>
                      </div>
                    ) : (
                      m.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          className="prose prose-sm max-w-none prose-headings:text-semantic-text-primary prose-p:leading-relaxed prose-strong:text-semantic-text-primary prose-a:text-accent hover:prose-a:text-accent-alt prose-code:text-accent prose-li:marker:text-semantic-text-dim [&_*]:selection:bg-accent [&_*]:selection:text-white"
                          components={{
                            code({node, className, children, ...props}) {
                              return <code className={`px-1.5 py-0.5 rounded bg-semantic-surface-1/80 border border-semantic-border-muted text-accent text-[0.7rem] font-mono ${className || ''}`} {...props}>{children}</code>;
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
                <div className="text-[10px] text-danger opacity-80 break-words font-mono">{errorDetail}</div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 border-t border-semantic-border-muted bg-semantic-surface-1/70 backdrop-blur-sm">
              <form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="flex">
                <div className="flex w-full items-stretch rounded-2xl border border-semantic-border-muted bg-semantic-surface-2/60 focus-within:border-semantic-border-accent focus-within:shadow-[0_0_0_1px_var(--color-border-accent)] transition-colors">
                  <textarea
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder="Ask me anything about biology research..."
                    className="flex-1 resize-none h-12 max-h-40 w-full bg-transparent px-4 py-3 text-sm text-semantic-text-primary placeholder-semantic-text-dim focus:outline-none scrollbar-thin scrollbar-thumb-[color:var(--color-border-accent)]/40 disabled:opacity-60 disabled:cursor-not-allowed"
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
                    className={`relative group h-12 px-6 inline-flex items-center justify-center text-sm font-semibold tracking-wide border-l border-semantic-border-muted/60 disabled:cursor-not-allowed
                    bg-gradient-to-br from-accent via-accent-alt to-accent ${isDark ? 'text-white' : 'text-black'} hover:from-accent-alt hover:via-accent hover:to-accent-alt
                    transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring-accent)] rounded-r-2xl`}
                  >
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute -inset-px rounded-r-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 mix-blend-overlay pointer-events-none" />
                    <div className="relative flex items-center gap-2">
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isLoading ? 'Sending' : 'Send'}</span>
                    </div>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
