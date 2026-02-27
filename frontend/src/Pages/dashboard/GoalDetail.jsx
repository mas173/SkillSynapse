import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Brain,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  MessageSquareText,
  RefreshCcw,
  BrainCircuit,
  FileText,
  ListCheck,
  LocateFixed,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import LoadingScreen from "../../Components/common/Loader";
import axiosInstance from "../../services/axios/axios";
import useAuthStore from "../../store/useAuthStore";

export default function GoalDetail() {
  const navigate = useNavigate();
  const { goalId } = useParams();
  const { user } = useAuthStore();

  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState("");

  async function fetchGoalData() {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get(`/onboarding/data?goalId=${goalId}`);
      if (res.data.success && res.data.data) {
        setOnboardingData(res.data.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load goal details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGoalData();
  }, [goalId]);

  async function handleToggleComplete() {
    try {
      setToggling(true);
      const res = await axiosInstance.patch(
        `/onboarding/goal/${goalId}/complete`,
      );
      if (res.data.success) {
        setOnboardingData((prev) => ({
          ...prev,
          status: res.data.data.status,
          completedAt: res.data.data.completedAt,
        }));
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setToggling(false);
    }
  }

  // Derived data
  const analysis = onboardingData?.resultAnalysis?.json || {};
  const roadmap = onboardingData?.finalRoadmap?.json || {};
  const goal = onboardingData?.goal || "Personalized Learning";
  const level =
    analysis.skillLevel || onboardingData?.experienceLevel || "Beginner";
  const confidenceScore = onboardingData?.confidenceScore ?? 0;
  const strengths = analysis.strengths || [];
  const weakSkills = analysis.weaknesses || [];
  const skillGapFocus = roadmap.skillGapFocus || [];
  const roadmapPhases = roadmap.roadmap || [];
  const isCompleted = onboardingData?.status === "completed";

  // Confidence history for graph
  const confidenceHistory = useMemo(() => {
    const history = onboardingData?.confidenceHistory || [];
    return history.map((entry) => ({
      score: entry.score,
      date: new Date(entry.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      fullDate: new Date(entry.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, [onboardingData]);

  // Next Steps
  const nextSteps = useMemo(() => {
    const steps = [];
    if (weakSkills.length > 0) {
      steps.push({
        title: `Fix: ${weakSkills[0]}`,
        desc: "Start guided learning with hints.",
        action: () => navigate("/tutor"),
        cta: "Open AI Tutor",
      });
    }
    if (skillGapFocus.length > 0) {
      steps.push({
        title: `Focus: ${skillGapFocus[0]}`,
        desc: "Follow your AI-generated roadmap.",
        action: () => navigate(`/roadmap?goalId=${goalId}`),
        cta: "View Roadmap",
      });
    }
    steps.push({
      title: "Take a revision quiz",
      desc: "Boost your confidence score.",
      action: () => {
        sessionStorage.setItem("currentGoalId", goalId);
        navigate("/assessment");
      },
      cta: "Start Quiz",
    });
    return steps.slice(0, 3);
  }, [weakSkills, skillGapFocus, navigate, goalId]);

  if (loading) {
    return (
      <LoadingScreen
        title="Loading Goal Details"
        subtitle="Fetching your progress from SkillSynapse AI"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6">
        <p className="text-lg font-semibold text-red-400">{error}</p>
        <button
          onClick={fetchGoalData}
          className="mt-6 px-6 py-3 rounded-2xl bg-gray-200 text-black font-semibold flex items-center gap-2 hover:bg-gray-300 transition"
        >
          <RefreshCcw size={18} /> Retry
        </button>
      </div>
    );
  }

  function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 shadow-lg">
          <p className="text-sm text-gray-200 font-medium">
            {payload[0].payload.fullDate}
          </p>
          <p className="text-lg font-bold text-white">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between flex-wrap gap-6 mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-gray-400 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-100 line-clamp-1">
                {goal}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-gray-400">Level: {level}</p>
                {isCompleted && (
                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-400">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleToggleComplete}
              disabled={toggling}
              className={`px-5 py-3 rounded-2xl font-semibold transition flex items-center gap-2 text-sm ${
                isCompleted
                  ? "border border-white/10 bg-white/5 hover:border-gray-400 text-gray-200"
                  : "bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30"
              }`}
            >
              {toggling ? (
                <Loader2 className="animate-spin" size={16} />
              ) : isCompleted ? (
                <RotateCcw size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              {isCompleted ? "Mark Active" : "Mark Complete"}
            </button>
            <button
              onClick={() => navigate("/tutor")}
              className="px-5 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition flex items-center gap-2"
            >
              <BrainCircuit size={18} /> AI Tutor
            </button>
            <button
              onClick={() => {
                sessionStorage.setItem("currentGoalId", goalId);
                navigate("/assessment");
              }}
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-gray-400 transition text-sm flex items-center gap-2"
            >
              <BarChart3 size={18} /> Re-Assessment
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Confidence Score with Graph */}
            <Card>
              <CardHeader
                icon={<BarChart3 size={18} />}
                title="Confidence Score"
                subtitle="Track your progress across assessments"
              />

              <div className="flex items-end justify-between mt-4 mb-2">
                <div>
                  <div className="text-4xl font-extrabold text-gray-100">
                    {confidenceScore}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {confidenceHistory.length} assessment
                    {confidenceHistory.length !== 1 ? "s" : ""} taken
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  Level: <span className="text-gray-300">{level}</span>
                </div>
              </div>

              {confidenceHistory.length > 0 ? (
                <div className="mt-4 h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={confidenceHistory}>
                      <defs>
                        <linearGradient
                          id="goalScoreGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#e5e7eb"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#e5e7eb"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                        tickLine={false}
                        width={35}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#e5e7eb"
                        strokeWidth={2}
                        fill="url(#goalScoreGradient)"
                        dot={{ fill: "#e5e7eb", strokeWidth: 0, r: 4 }}
                        activeDot={{
                          r: 6,
                          fill: "#fff",
                          stroke: "#e5e7eb",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-6 p-6 rounded-2xl bg-black/20 border border-white/5 text-center">
                  <p className="text-sm text-gray-500">
                    Take your first assessment to see your progress graph
                  </p>
                </div>
              )}
            </Card>

            {/* Strength + Skill Gap side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader
                  icon={<Brain size={18} />}
                  title="Strengths"
                  subtitle="Skills you already mastered"
                />
                <div className="mt-5 flex flex-wrap gap-3">
                  {strengths.length > 0 ? (
                    strengths.map((s, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Complete an assessment to see strengths
                    </p>
                  )}
                </div>
              </Card>

              <Card>
                <CardHeader
                  icon={<LocateFixed size={18} />}
                  title="Skill Gaps"
                  subtitle="Areas needing improvement"
                />
                <div className="mt-5 flex flex-wrap gap-3">
                  {weakSkills.length > 0 ? (
                    weakSkills.map((s, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-2xl bg-black/30 border border-white/10 text-sm"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skill gaps detected 🎉
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* AI Recommendation */}
            {analysis.recommendation && (
              <Card>
                <CardHeader
                  icon={<BarChart3 size={18} />}
                  title="AI Recommendation"
                  subtitle="Personalized advice from SkillSynapse"
                />
                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  {analysis.recommendation}
                </p>
              </Card>
            )}

            {/* Continue Learning */}
            {!isCompleted && (
              <Card>
                <CardHeader
                  icon={<BookOpen size={18} />}
                  title="Continue Learning"
                  subtitle="Recommended next steps"
                />
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  {nextSteps.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={step.action}
                      className="p-5 rounded-3xl text-left bg-black/30 border border-white/10 hover:border-gray-400 transition"
                    >
                      <h3 className="font-semibold text-slate-100">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-400">{step.desc}</p>
                      <div className="mt-4 text-sm text-gray-200 flex items-center gap-2">
                        {step.cta} <ArrowRight size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            {/* Tutor Card */}
            <Card>
              <CardHeader
                icon={<BrainCircuit size={18} />}
                title="AI Tutor"
                subtitle="Explainable step-by-step help"
              />
              <p className="mt-6 text-sm text-gray-400">
                Your tutor adapts to your weak skills and learning goal.
              </p>
              <button
                onClick={() => navigate("/tutor")}
                className="mt-6 w-full px-5 py-3 rounded-2xl flex gap-2 bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
              >
                <MessageSquareText size={18} /> Start Tutor Session
              </button>
            </Card>

            {/* Roadmap Card */}
            <Card>
              <CardHeader
                icon={<ListCheck size={18} />}
                title="Your Roadmap"
                subtitle="AI-generated personalized path"
              />
              {roadmapPhases.length > 0 && (
                <div className="mt-4 space-y-2">
                  {roadmapPhases.slice(0, 3).map((phase, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5"
                    >
                      <span className="text-sm text-gray-200 truncate mr-2">
                        {phase.phase}
                      </span>
                      <span className="text-xs text-gray-500 shrink-0">
                        {phase.duration}
                      </span>
                    </div>
                  ))}
                  {roadmapPhases.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{roadmapPhases.length - 3} more phases
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={() => navigate(`/roadmap?goalId=${goalId}`)}
                className="mt-6 w-full px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-gray-400 transition flex gap-2"
              >
                <FileText size={18} /> View Full Roadmap
              </button>
            </Card>

            {/* Focus Areas */}
            {skillGapFocus.length > 0 && (
              <Card>
                <CardHeader
                  icon={<LocateFixed size={18} />}
                  title="Focus Areas"
                  subtitle="Prioritized by AI analysis"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {skillGapFocus.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-gray-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-gray-600">
          SkillSynapse • Persistent Progress • Explainable AI
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function Card({ children }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
      {children}
    </div>
  );
}

function CardHeader({ icon, title, subtitle }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-black/30 border border-white/10">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
