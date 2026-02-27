import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Brain,
  Sparkles,
  SendHorizonal,
  Lightbulb,
  BookOpen,
  Target,
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Check,
  X,
} from "lucide-react";

import LoadingScreen from "../../Components/common/Loader";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function TutorChat() {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [mode, setMode] = useState("hint");

  const [loading, setLoading] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);

  // Session states
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Rename states
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const chatEndRef = useRef(null);
  const renameInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // Focus rename input when editing starts
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  // Load context + sessions on mount
  useEffect(() => {
    async function init() {
      try {
        await fetchSessions();

        const res = await fetch(`${API_BASE}/onboarding/data`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setProfile({ goal: data.data.goal });
            setProgress({
              weakSkills: data.data.resultAnalysis?.json?.weaknesses || [],
            });
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchSessions() {
    try {
      const res = await fetch(`${API_BASE}/tutor/sessions`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSessions(data.data);
        }
      }
    } catch (err) {
      console.error("Fetch sessions error:", err);
    }
  }

  async function loadSession(sessionId) {
    if (renamingId) return; // don't switch while renaming
    try {
      const res = await fetch(`${API_BASE}/tutor/history/${sessionId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setActiveSessionId(sessionId);
          setMessages(data.data.messages);
        }
      }
    } catch (err) {
      console.error("Load session error:", err);
    }
  }

  function startNewChat() {
    setActiveSessionId(null);
    setMessages([]);
  }

  async function handleDeleteSession(e, sessionId) {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/tutor/sessions/${sessionId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s._id !== sessionId));
        if (activeSessionId === sessionId) {
          startNewChat();
        }
      }
    } catch (err) {
      console.error("Delete session error:", err);
    }
  }

  function startRename(e, session) {
    e.stopPropagation();
    setRenamingId(session._id);
    setRenameValue(session.title);
  }

  function cancelRename() {
    setRenamingId(null);
    setRenameValue("");
  }

  async function confirmRename(e) {
    if (e) e.stopPropagation();
    if (!renameValue.trim()) {
      cancelRename();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tutor/sessions/${renamingId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: renameValue.trim() }),
      });
      if (res.ok) {
        setSessions((prev) =>
          prev.map((s) =>
            s._id === renamingId ? { ...s, title: renameValue.trim() } : s,
          ),
        );
      }
    } catch (err) {
      console.error("Rename error:", err);
    } finally {
      cancelRename();
    }
  }

  const goal = profile?.goal || "Personalized Learning";

  async function handleSend() {
    if (!input.trim() || aiTyping) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAiTyping(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`${API_BASE}/tutor/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          mode,
          sessionId: activeSessionId,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const newSessionId = res.headers.get("X-Session-Id");
      if (newSessionId && !activeSessionId) {
        setActiveSessionId(newSessionId);
        fetchSessions();
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.text) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.text,
                  };
                }
                return updated;
              });
            }
            if (parsed.error) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: `⚠️ ${parsed.error}`,
                  };
                }
                return updated;
              });
            }
          } catch (err) {
            console.error("Error parsing SSE payload:", err);
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          updated[updated.length - 1] = {
            ...last,
            content: "⚠️ Something went wrong. Please try again.",
          };
        }
        return updated;
      });
    } finally {
      setAiTyping(false);
    }
  }

  if (loading) {
    return (
      <LoadingScreen
        title="Launching AI Tutor..."
        subtitle="Preparing hints and guidance for your weak skills"
      />
    );
  }

  return (
    <div
      style={{ height: "calc(100vh - 4rem)" }}
      className="bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white flex overflow-hidden"
    >
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 overflow-hidden border-r border-white/10 bg-black/30 flex flex-col shrink-0`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300">Chat History</h2>
          <button
            onClick={startNewChat}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-gray-500 text-center mt-4">
              Every doubt is a step toward mastery. Ask away!✨
            </p>
          )}
          {sessions.map((s) => (
            <div
              key={s._id}
              onClick={() => loadSession(s._id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 group transition cursor-pointer ${
                activeSessionId === s._id
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              <MessageSquare size={14} className="shrink-0" />

              {renamingId === s._id ? (
                /* ── Inline rename input ── */
                <div
                  className="flex-1 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmRename();
                      if (e.key === "Escape") cancelRename();
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-0.5 text-sm text-white outline-none focus:border-gray-400"
                  />
                  <button
                    onClick={confirmRename}
                    className="p-1 rounded hover:bg-white/10 text-green-400"
                    title="Save"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelRename();
                    }}
                    className="p-1 rounded hover:bg-white/10 text-red-400"
                    title="Cancel"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="truncate flex-1">{s.title}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition">
                    <button
                      onClick={(e) => startRename(e, s)}
                      className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-blue-400"
                      title="Rename chat"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSession(e, s._id)}
                      className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-red-400"
                      title="Delete chat"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-white/5 transition text-gray-400 hover:text-white"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeftOpen size={20} />
              )}
            </button>
            <Brain className="w-8 h-8 text-gray-200" />
            <div>
              <h1 className="text-lg font-semibold text-slate-100">
                SkillSynapse Tutor
              </h1>
              <p className="text-xs text-gray-500">Goal: {goal}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <ModeButton
              active={mode === "hint"}
              icon={<Lightbulb size={16} />}
              label="Hint"
              onClick={() => setMode("hint")}
            />
            <ModeButton
              active={mode === "explain"}
              icon={<BookOpen size={16} />}
              label="Explain"
              onClick={() => setMode("explain")}
            />
            <ModeButton
              active={mode === "practice"}
              icon={<Target size={16} />}
              label="Practice"
              onClick={() => setMode("practice")}
            />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 thin-scrollbar">
          {messages.length === 0 && (
            <div className="flex justify-start">
              <div className="max-w-lg px-5 py-4 rounded-3xl text-sm leading-relaxed whitespace-pre-line bg-white/5 border border-white/10 text-gray-200">
                {`Hi 👋 I'm your SkillSynapse Tutor.\nAsk me anything — I will guide you step-by-step.`}
              </div>
            </div>
          )}
          {messages.map((msg, index) => {
            // Skip empty assistant message (placeholder while AI is typing)
            if (msg.role === "assistant" && msg.content === "" && aiTyping)
              return null;
            return (
              <ChatBubble key={index} role={msg.role} content={msg.content} />
            );
          })}

          {aiTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 px-5 py-4 rounded-3xl bg-white/5 border border-white/10">
                <Brain
                  size={20}
                  className="text-gray-300"
                  style={{ animation: "spin 2.5s linear infinite" }}
                />
                <span className="text-sm text-gray-400">Tutor is thinking</span>
                <span className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    style={{ animation: "pulse 1.4s ease-in-out infinite" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    style={{
                      animation: "pulse 1.4s ease-in-out 0.2s infinite",
                    }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    style={{
                      animation: "pulse 1.4s ease-in-out 0.4s infinite",
                    }}
                  />
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your doubt here..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gray-400 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={aiTyping}
              className="px-5 py-3 rounded-2xl flex gap-2 bg-gray-200 text-black font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed items-center"
            >
              Send <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ role, content }) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-lg px-5 py-4 rounded-3xl text-sm leading-relaxed whitespace-pre-line bg-gray-200 text-black">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-2xl px-5 py-4 rounded-3xl text-sm leading-relaxed bg-white/5 border border-white/10 text-gray-200 prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
            ),
            li: ({ children }) => <li className="text-gray-300">{children}</li>,
            strong: ({ children }) => (
              <strong className="text-white font-semibold">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="text-gray-300 italic">{children}</em>
            ),
            code: ({ inline, className, children, ...props }) => {
              if (inline) {
                return (
                  <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300 text-xs font-mono">
                    {children}
                  </code>
                );
              }
              return (
                <pre className="bg-black/40 border border-white/10 rounded-xl p-3 overflow-x-auto my-2">
                  <code
                    className="text-emerald-300 text-xs font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-lg font-bold text-white mb-2">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-bold text-white mb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-bold text-white mb-1">{children}</h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-gray-500 pl-3 my-2 text-gray-400 italic">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-2">
                <table className="w-full text-xs border-collapse">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-white/10 px-2 py-1 bg-white/5 text-left font-semibold text-white">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-white/10 px-2 py-1 text-gray-300">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function ModeButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-2xl text-sm flex items-center gap-2 border transition
        ${
          active
            ? "bg-gray-200 text-black border-gray-200"
            : "bg-white/5 text-gray-300 border-white/10 hover:border-gray-400"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
