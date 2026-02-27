import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import axiosInstance from "../../services/axios/axios";

export default function GoalPersonalization() {
  const navigate = useNavigate();

  const [goal, setGoal] = useState("");
  const [style, setStyle] = useState("Step-by-step");
  const [timePerDay, setTimePerDay] = useState("30 min/day");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [preferredLanguage, setPreferredLanguage] = useState("English");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const learningStyles = [
    "Step-by-step",
    "Fast Revision",
    "More Practice",
    "Concept Deep Dive",
  ];

  const timeOptions = ["15 min/day", "30 min/day", "1 hr/day", "2 hr/day"];
  const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
  const languageOptions = ["English", "Hindi", "Spanish", "French"];

  async function handlePersonalize() {
    if (!goal.trim()) {
      setError("Please write your learning goal or description.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/onboarding/goal", {
        goal,
        preferredStyle: style,
        timeline: timePerDay,
        experienceLevel,
        preferredLanguage,
      });

      const data = res.data;

      // Store goalId for the rest of the onboarding flow
      if (data.goalId) {
        sessionStorage.setItem("currentGoalId", data.goalId);
      }

      console.log("AI Personalization Result:", data);
      navigate("/onboarding/roadmap");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "AI personalization failed. Try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6">
      <div className="w-full mt-12 mb-12 max-w-2xl p-10 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-gray-200" />
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Welcome to SkillSynapse
            </h1>
            <p className="text-sm text-gray-400">
              Let’s personalize your AI learning journey.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-300 leading-relaxed">
            Tell us your goal, current level, or what you struggle with.
            SkillSynapse will use AI to build your personalized roadmap.
          </p>
        </div>

        {/* GOAL */}
        <div>
          <label className="text-sm text-gray-300 font-medium">
            Your Learning Goal / Description
          </label>

          <textarea
            rows={5}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Example: I want to master React in 2 months. I struggle with hooks and state management..."
            className="mt-3 w-full px-4 py-3 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 resize-none"
          />
        </div>

        <div className="flex gap-10">
          {/* EXPERIENCE LEVEL */}
          <div className="mt-8">
            <label className="text-sm text-gray-300 font-medium">
              Experience Level
            </label>

            <div className="mt-3 flex flex-wrap gap-3">
              {experienceOptions.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setExperienceLevel(lvl)}
                  className={`px-4 py-2 rounded-2xl border text-sm transition ${
                    experienceLevel === lvl
                      ? "bg-white/10 border-gray-300 text-white"
                      : "bg-black/20 border-white/10 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* PREFERRED LANGUAGE */}
          <div className="mt-8">
            <label className="text-sm text-gray-300 font-medium block">
              Preferred Language
            </label>

            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="mt-3 w-full px-4 py-2 rounded-2xl border bg-black/20 border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {languageOptions.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  className="bg-gray-900 text-white"
                >
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* EXISTING STYLE */}
        <div className="mt-8">
          <label className="text-sm text-gray-300 font-medium">
            Preferred Learning Style
          </label>

          <div className="mt-3 flex flex-wrap gap-3">
            {learningStyles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-2 rounded-2xl border text-sm transition ${
                  style === s
                    ? "bg-white/10 border-gray-300 text-white"
                    : "bg-black/20 border-white/10 text-gray-400 hover:text-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* TIME */}
        <div className="mt-8">
          <label className="text-sm text-gray-300 font-medium">
            Daily Time Commitment
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {timeOptions.map((t) => (
              <button
                key={t}
                onClick={() => setTimePerDay(t)}
                className={`px-4 py-2 rounded-2xl border text-sm transition ${
                  timePerDay === t
                    ? "bg-white/10 border-gray-300 text-white"
                    : "bg-black/20 border-white/10 text-gray-400 hover:text-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-6 text-sm text-stone-300 bg-stone-900/40 border border-stone-700 px-4 py-3 rounded-2xl">
            {error}
          </p>
        )}

        <button
          onClick={handlePersonalize}
          disabled={loading}
          className="mt-10 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Personalizing...
            </>
          ) : (
            <>
              Generate My Roadmap <Sparkles size={18} />
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-gray-500 text-center">
          Your answers help SkillSynapse provide explainable,
          confidence-boosting AI tutoring.
        </p>
      </div>
    </div>
  );
}
