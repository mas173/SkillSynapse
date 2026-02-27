import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../services/axios/axios";
import useAuthStore from "../../store/useAuthStore";
import LoadingScreen from "../../Components/common/Loader";

export default function SkillGapReport() {
  const navigate = useNavigate();
  const { setUser, user } = useAuthStore();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function generateReport() {
      try {
        setLoading(true);
        setError("");
        const goalId = sessionStorage.getItem("currentGoalId");
        const res = await axiosInstance.post("/onboarding/result", {
          goalId: goalId || undefined,
        });

        if (res.data.success && res.data.data) {
          const analysis = res.data.data.resultAnalysis?.json || {};
          const roadmap = res.data.data.finalRoadmap?.json || {};
          const score = res.data.data.confidenceScore ?? 0;
          const correct = res.data.data.correctCount ?? 0;
          const total = res.data.data.totalCount ?? 0;

          // Store goalId if returned
          if (res.data.goalId) {
            sessionStorage.setItem("currentGoalId", res.data.goalId);
          }

          setReport({
            confidenceScore: score,
            correctCount: correct,
            totalCount: total,
            strengths: analysis.strengths || [],
            weaknesses: analysis.weaknesses || [],
            skillLevel: analysis.skillLevel || "Beginner",
            recommendation: analysis.recommendation || "",
            roadmapSummary: roadmap.summary || "",
            skillGapFocus: roadmap.skillGapFocus || [],
            roadmapPhases: roadmap.roadmap || [],
            finalAdvice: roadmap.finalAdvice || "",
          });
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message || "Failed to generate report.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    generateReport();
  }, []);

  function handleSaveAndContinue() {
    setSaving(true);
    if (user) {
      setUser({ ...user, isOnboarded: true });
    }
    // Clean up flow tracking
    sessionStorage.removeItem("goalFlow");
    navigate("/dashboard");
  }

  function handleRetake() {
    navigate("/assessment");
  }

  if (loading) {
    return (
      <LoadingScreen
        title="Analyzing Your Assessment..."
        subtitle="AI is generating your personalized skill gap report and roadmap"
      />
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-gray-300 px-6">
        <div className="p-8 rounded-3xl bg-white/5 border border-red-500/20 max-w-md text-center">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/*  HEADER  */}
        <div className="flex items-center gap-3 mb-10">
          <Brain className="w-9 h-9 text-gray-200" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              Skill Gap Report
            </h1>
            <p className="text-sm text-gray-400">
              Here is what SkillSynapse discovered about your current level.
            </p>
          </div>
        </div>

        {/*  CONFIDENCE SCORE  */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md mb-10">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                Confidence Score
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                You answered{" "}
                <span className="text-gray-200 font-medium">
                  {report.correctCount}/{report.totalCount}
                </span>{" "}
                questions correctly
              </p>
            </div>

            <div className="text-4xl font-extrabold text-gray-200">
              {report.confidenceScore}%
            </div>
          </div>

          <div className="w-full bg-black/30 border border-white/10 rounded-full h-3 overflow-hidden mt-6">
            <div
              className="h-3 bg-gray-200 transition-all"
              style={{ width: `${report.confidenceScore}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Skill Level: {report.skillLevel}
          </p>
        </div>

        {/*  STRENGTHS + WEAKNESS  */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="p-8 rounded-3xl bg-black/30 border border-white/10 shadow-lg">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
              <CheckCircle className="text-gray-200" size={18} />
              Strength Areas
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Topics you are already doing well in.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {report.strengths.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-200"
                >
                  {skill}
                </span>
              ))}
              {report.strengths.length === 0 && (
                <p className="text-sm text-gray-500">
                  No strengths detected yet
                </p>
              )}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-black/30 border border-white/10 shadow-lg">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
              <AlertTriangle className="text-gray-200" size={18} />
              Skill Gaps Detected
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              These areas need more practice and guidance.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {report.weaknesses.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-200"
                >
                  {skill}
                </span>
              ))}
              {report.weaknesses.length === 0 && (
                <p className="text-sm text-gray-500">
                  No skill gaps detected 🎉
                </p>
              )}
            </div>
          </div>
        </div>

        {/*  AI RECOMMENDATION */}
        {report.recommendation && (
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md mb-10">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
              <BarChart3 className="text-gray-200" size={18} />
              AI Recommendation
            </h2>
            <p className="mt-4 text-gray-300 leading-relaxed">
              {report.recommendation}
            </p>
          </div>
        )}

        {/*  GENERATED ROADMAP PREVIEW  */}
        {report.roadmapPhases.length > 0 && (
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md mb-10">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Your Personalized Roadmap
            </h2>
            {report.roadmapSummary && (
              <p className="text-sm text-gray-400 mb-6">
                {report.roadmapSummary}
              </p>
            )}

            {report.skillGapFocus.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Focus Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.skillGapFocus.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-gray-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {report.roadmapPhases.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-black/20 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-100">
                      {phase.phase}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {phase.duration}
                    </span>
                  </div>
                  {phase.focus && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {phase.focus.map((f, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {phase.projects && phase.projects.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Projects: {phase.projects.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {report.finalAdvice && (
              <p className="mt-6 text-sm text-gray-400 italic">
                💡 {report.finalAdvice}
              </p>
            )}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Saving...
              </>
            ) : (
              <>
                Continue to Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>

          <button
            onClick={handleRetake}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-gray-200 font-semibold hover:bg-white/10 transition disabled:opacity-60"
          >
            <RefreshCcw size={18} />
            Retake Assessment
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500 text-center">
          Not satisfied? Retake anytime. Your AI Tutor will guide you through
          these gaps.
        </p>
      </div>
    </div>
  );
}
