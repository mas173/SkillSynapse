import React, { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Sparkles,
  SendHorizonal,
  Lightbulb,
  BookOpen,
  Target,
} from "lucide-react";

/* ==============================
   MOCK LOADING SCREEN
============================== */
function LoadingScreen({ title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}

export default function TutorChat() {
  // ==============================
  // STATES
  // ==============================
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [mode, setMode] = useState("hint");

  const [loading, setLoading] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);

  // ==============================
  // LOAD MOCK USER CONTEXT
  // ==============================
  async function loadTutorContext() {
    setTimeout(() => {
      // ✅ Fake Profile + Progress Data
      setProfile({
        goal: "Crack Full Stack Development",
      });

      setProgress({
        weakSkills: ["React Hooks", "Node APIs", "MongoDB Queries"],
      });

      // Initial Welcome Message
      setMessages([
        {
          role: "assistant",
          content: `Hi 👋 I'm your SkillSynapse Tutor.\nAsk me anything — I will guide you step-by-step.`,
        },
      ]);

      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    loadTutorContext();
  }, []);

  // USER LEARNING CONTEXT
  const goal = profile?.goal || "Personalized Learning";
  const weakSkills = progress?.weakSkills || [];

  const tutorContext = useMemo(() => {
    return {
      goal,
      weakSkills,
      mode,
    };
  }, [goal, weakSkills, mode]);

  // MOCK AI RESPONSE
  async function handleSend() {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAiTyping(true);

    // Fake AI delay
    setTimeout(() => {
      let replyText = "";

      if (mode === "hint") {
        replyText = `💡 Hint: Think about the core concept behind "${userMsg.content}".`;
      }

      if (mode === "explain") {
        replyText = `📘 Explanation: "${userMsg.content}" means ... (detailed explanation will appear here).`;
      }

      if (mode === "practice") {
        replyText = `🎯 Practice: Try solving this question related to "${userMsg.content}".`;
      }

      const aiMsg = {
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setAiTyping(false);
    }, 1200);
  }

  // LOADING SCREEN
  if (loading) {
    return (
      <LoadingScreen
        title="Launching AI Tutor..."
        subtitle="Preparing hints and guidance for your weak skills"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white flex flex-col">
      {/*  HEADER  */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-gray-200" />
          <div>
            <h1 className="text-lg font-semibold text-slate-100">
              SkillSynapse Tutor
            </h1>
            <p className="text-xs text-gray-500">Goal: {goal}</p>
          </div>
        </div>

        {/* MODE SWITCH */}
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

      {/*  CHAT AREA  */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.map((msg, index) => (
          <ChatBubble key={index} role={msg.role} content={msg.content} />
        ))}

        {/* AI Typing Indicator */}
        {aiTyping && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Sparkles className="animate-pulse" size={16} />
            Tutor is thinking...
          </div>
        )}
      </div>

      {/*  INPUT BOX  */}
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
      className="px-5 py-3 rounded-2xl flex gap-2 bg-gray-200 text-black font-semibold hover:bg-gray-300 transition flex items-center gap-2"
    >
       Send <SendHorizonal size={18} />
    </button>
  </div>
</div>

    </div>
  );
}

/*  COMPONENTS  */

function ChatBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-lg px-5 py-4 rounded-3xl text-sm leading-relaxed whitespace-pre-line
        ${
          isUser
            ? "bg-gray-200 text-black"
            : "bg-white/5 border border-white/10 text-gray-200"
        }`}
      >
        {content}
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
