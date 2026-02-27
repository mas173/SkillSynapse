import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Brain,
  Calendar,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  Target,
} from "lucide-react";
import LoadingScreen from "../../Components/common/Loader";
import axiosInstance from "../../services/axios/axios";

export default function Roadmap() {
  const [searchParams] = useSearchParams();
  const [roadmap, setRoadmap] = useState(null);
  const [goalId, setGoalId] = useState(null);
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openPhase, setOpenPhase] = useState(null);
  const [completedItems, setCompletedItems] = useState([]);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  async function fetchRoadmap() {
    try {
      setLoading(true);
      setError("");

      const gId =
        searchParams.get("goalId") || sessionStorage.getItem("currentGoalId");
      const url = gId ? `/onboarding/data?goalId=${gId}` : "/onboarding/data";
      const res = await axiosInstance.get(url);

      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setGoal(data.goal || "Personalized Learning");
        setGoalId(data._id);
        setCompletedItems(data.completedItems || []);

        const finalRoadmap = data.finalRoadmap?.json;
        if (finalRoadmap) {
          setRoadmap(finalRoadmap);
        } else {
          setError("No roadmap generated yet. Complete your assessment first.");
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load roadmap.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleItem(itemKey) {
    if (!goalId) return;

    // Optimistic update
    setCompletedItems((prev) =>
      prev.includes(itemKey)
        ? prev.filter((k) => k !== itemKey)
        : [...prev, itemKey],
    );

    try {
      const res = await axiosInstance.patch(
        `/onboarding/goal/${goalId}/roadmap-item`,
        { itemKey },
      );
      if (res.data.success) {
        setCompletedItems(res.data.data.completedItems);
      }
    } catch (err) {
      // Revert on error
      setCompletedItems((prev) =>
        prev.includes(itemKey)
          ? prev.filter((k) => k !== itemKey)
          : [...prev, itemKey],
      );
      console.error("Failed to toggle item:", err);
    }
  }

  if (loading) {
    return (
      <LoadingScreen
        title="Loading Your Roadmap..."
        subtitle="Fetching your AI-generated learning path"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-gray-300 px-6">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 max-w-md text-center">
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  const phases = roadmap.roadmap || [];
  const summary = roadmap.summary || "";
  const skillGapFocus = roadmap.skillGapFocus || [];
  const finalAdvice = roadmap.finalAdvice || "";

  // Compute progress
  let totalItems = 0;
  let checkedItems = 0;
  phases.forEach((phase, pi) => {
    if (phase.projects) {
      phase.projects.forEach((_, ii) => {
        totalItems++;
        if (completedItems.includes(`p-${pi}-${ii}`)) checkedItems++;
      });
    }
    if (phase.resources) {
      phase.resources.forEach((_, ii) => {
        totalItems++;
        if (completedItems.includes(`r-${pi}-${ii}`)) checkedItems++;
      });
    }
  });
  const progressPercent =
    totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white">
      {/* HEADER */}
      <div className="px-8 py-10 border-b border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <Brain className="w-10 h-10 text-gray-200" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">
              AI Learning Roadmap
            </h1>
            <p className="text-gray-500 text-sm">Goal: {goal}</p>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-3xl">
            {summary}
          </p>
        )}

        {/* Skill Gap Focus */}
        {skillGapFocus.length > 0 && (
          <div className="mt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              Focus Areas
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGapFocus.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300"
                >
                  <Target size={10} className="inline mr-1" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Overall Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>
              {checkedItems} / {totalItems} items ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-200 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ROADMAP PHASES */}
      <div className="px-8 py-12 space-y-6 max-w-5xl mx-auto">
        {phases.map((phase, index) => {
          const isOpen = openPhase === index;

          return (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md transition hover:border-gray-400"
            >
              {/* Phase Header */}
              <div
                onClick={() => setOpenPhase(isOpen ? null : index)}
                className="flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/30 border border-white/10">
                    <Calendar className="text-gray-300" size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-100">
                      {phase.phase}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock size={12} /> {phase.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {isOpen ? (
                  <ChevronUp className="text-gray-400" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </div>

              {/* Expandable Content */}
              {isOpen && (
                <div className="mt-6 space-y-4">
                  {/* Focus Topics */}
                  {phase.focus && phase.focus.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        Topics to Learn
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {phase.focus.map((topic, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects — clickable checkboxes */}
                  {phase.projects && phase.projects.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        Projects
                      </p>
                      <div className="space-y-2">
                        {phase.projects.map((project, i) => {
                          const key = `p-${index}-${i}`;
                          const done = completedItems.includes(key);
                          return (
                            <button
                              key={i}
                              onClick={() => handleToggleItem(key)}
                              className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                                done
                                  ? "bg-white/10 border-green-500/30"
                                  : "bg-black/20 border-white/5 hover:border-gray-400"
                              }`}
                            >
                              {done ? (
                                <CheckCircle
                                  className="text-green-400 shrink-0"
                                  size={18}
                                />
                              ) : (
                                <Circle
                                  className="text-gray-500 shrink-0"
                                  size={18}
                                />
                              )}
                              <span
                                className={`text-sm ${done ? "text-gray-300 line-through" : "text-gray-300"}`}
                              >
                                {project}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Resources — clickable checkboxes */}
                  {phase.resources && phase.resources.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        Resources
                      </p>
                      <div className="space-y-2">
                        {phase.resources.map((resource, i) => {
                          const key = `r-${index}-${i}`;
                          const done = completedItems.includes(key);
                          return (
                            <button
                              key={i}
                              onClick={() => handleToggleItem(key)}
                              className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                                done
                                  ? "bg-white/10 border-green-500/30"
                                  : "bg-black/20 border-white/5 hover:border-gray-400"
                              }`}
                            >
                              {done ? (
                                <CheckCircle
                                  className="text-green-400 shrink-0"
                                  size={18}
                                />
                              ) : (
                                <Circle
                                  className="text-gray-500 shrink-0"
                                  size={18}
                                />
                              )}
                              <span
                                className={`text-sm ${done ? "text-gray-300 line-through" : "text-gray-300"}`}
                              >
                                {resource}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Advice */}
      {finalAdvice && (
        <div className="px-8 pb-16 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-slate-800 via-zinc-800 to-neutral-800 border border-white/10 rounded-3xl p-8 flex items-start gap-4">
            <Sparkles className="text-gray-300 shrink-0 mt-1" />
            <div>
              <h3 className="text-gray-100 font-semibold mb-2">
                AI Recommendation
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {finalAdvice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
