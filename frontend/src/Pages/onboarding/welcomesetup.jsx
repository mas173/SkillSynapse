import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight } from "lucide-react";

export default function WelcomeSetup() {
  const navigate = useNavigate();

  const [goal, setGoal] = useState("");

  const suggestions = [
    "I want to transition from Marketing to Data Analysis...",
    "I'm a CS student struggling with System Design...",
    "Help me prepare for Senior Frontend interviews..."
  ];

  function handleNext() {
    if (goal.trim().length < 10) {
      alert("Please provide a bit more detail so the AI can help you better!");
      return;
    }
    navigate("/next", { state: { userGoal: goal } });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6">
      <div className="w-full max-w-xl p-10 rounded-3xl bg-white/5 border border-white/10 shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-7 h-7 text-gray-200" />
          <h1 className="text-xl font-bold text-slate-100">
            Welcome to SkillSynapse
          </h1>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed">
          Let’s personalize your learning journey. This will help the AI tutor
          adapt to your goals and confidence level.
        </p>

        {/* Goal Input */}
        <div className="mt-8">
          <label className="text-sm text-gray-300">Your Goal & Background : </label>
          <textarea
            rows={5}
            placeholder="Tell us about your background and what you want to achieve.The more specific you are, the better the AI can architect your path..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-2 w-full px-4 py-3 text-sm rounded-2xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
          />
        </div>
        {/* Prompt Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((hint, i) => (
            <button
              key={i}
              onClick={() => setGoal(hint)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              {hint.substring(0, 60)}...
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="mt-10 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
        >
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
