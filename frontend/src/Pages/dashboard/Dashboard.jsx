import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  BarChart3,
  ArrowRight,
  Plus,
  Target,
  Trophy,
  Flame,
  ClipboardCheck,
  TrendingUp,
  CheckCircle2,
  Clock,
  BrainCircuit,
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDashboard() {
    try {
      setLoading(true);
      setError("");
      const [goalsRes, statsRes] = await Promise.all([
        axiosInstance.get("/onboarding/goals"),
        axiosInstance.get("/onboarding/stats"),
      ]);

      if (goalsRes.data.success) setGoals(goalsRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  const userName = user?.name || "Learner";
  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  // Format combined history for graph
  const chartData = useMemo(() => {
    if (!stats?.combinedHistory) return [];
    return stats.combinedHistory.map((entry) => ({
      score: entry.score,
      goal: entry.goal,
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
  }, [stats]);

  function handleAddGoal() {
    sessionStorage.setItem("goalFlow", "dashboard");
    sessionStorage.removeItem("currentGoalId");
    navigate("/onboarding/goal");
  }

  function handleGoalClick(goalId) {
    navigate(`/dashboard/goal/${goalId}`);
  }

  if (loading) {
    return (
      <LoadingScreen
        title="Loading Dashboard"
        subtitle="Fetching your goals and progress"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6">
        <p className="text-lg font-semibold text-red-400">{error}</p>
        <button
          onClick={fetchDashboard}
          className="mt-6 px-6 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-white/10 rounded-xl px-4 py-3 shadow-lg">
          <p className="text-xs text-gray-400">{payload[0].payload.goal}</p>
          <p className="text-sm text-gray-200 font-medium">
            {payload[0].payload.fullDate}
          </p>
          <p className="text-lg font-bold text-white">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  }

  // Streak flame icons
  function renderStreak(count) {
    if (count === 0)
      return <span className="text-gray-500 text-sm">No streak yet</span>;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(count, 7) }).map((_, i) => (
          <Flame
            key={i}
            size={16}
            className="text-orange-400"
            fill="currentColor"
          />
        ))}
        {count > 7 && (
          <span className="text-xs text-gray-400 ml-1">+{count - 7}</span>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between flex-wrap gap-6 mb-10">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-gray-200" />
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Learner Dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Welcome back, <span className="text-gray-200">{userName}</span>{" "}
                👋
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/tutor")}
              className="px-5 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition flex items-center gap-2"
            >
              <BrainCircuit size={18} /> AI Tutor
            </button>
            <button
              onClick={handleAddGoal}
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-gray-400 transition text-sm flex items-center gap-2"
            >
              <Plus size={18} /> Add New Goal
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            <StatCard
              icon={<Target size={20} />}
              label="Total Goals"
              value={stats.totalGoals}
            />
            <StatCard
              icon={<Clock size={20} />}
              label="Active"
              value={stats.activeGoals}
            />
            <StatCard
              icon={<Trophy size={20} />}
              label="Completed"
              value={stats.completedGoals}
            />
            <StatCard
              icon={<ClipboardCheck size={20} />}
              label="Assessments"
              value={stats.totalAssessments}
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="Avg Score"
              value={`${stats.averageScore}%`}
            />
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} className="text-orange-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Streak
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-100">
                {stats.activeStreak}{" "}
                <span className="text-sm font-normal text-gray-500">days</span>
              </div>
              <div className="mt-2">{renderStreak(stats.activeStreak)}</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT — GRAPH + GOALS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Progress Graph */}
            <Card>
              <CardHeader
                icon={<BarChart3 size={18} />}
                title="Overall Progress"
                subtitle="Combined confidence scores across all goals"
              />
              {chartData.length > 0 ? (
                <div className="mt-6 h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="scoreGradient"
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
                        fill="url(#scoreGradient)"
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
                    Complete an assessment to see your progress graph
                  </p>
                </div>
              )}
            </Card>

            {/* Active Goals */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <CardHeader
                  icon={<Target size={18} />}
                  title="Active Goals"
                  subtitle={`${activeGoals.length} ongoing goal${activeGoals.length !== 1 ? "s" : ""}`}
                />
                <button
                  onClick={handleAddGoal}
                  className="px-4 py-2 rounded-2xl bg-gray-200 text-black text-sm font-semibold hover:bg-gray-300 transition flex items-center gap-1"
                >
                  <Plus size={14} /> New Goal
                </button>
              </div>

              {activeGoals.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {activeGoals.map((goal) => (
                    <GoalCard
                      key={goal._id}
                      goal={goal}
                      onClick={() => handleGoalClick(goal._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-black/20 border border-white/5 text-center">
                  <p className="text-gray-500 mb-4">No active goals yet</p>
                  <button
                    onClick={handleAddGoal}
                    className="px-5 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
                  >
                    Create Your First Goal
                  </button>
                </div>
              )}
            </Card>

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <Card>
                <CardHeader
                  icon={<CheckCircle2 size={18} />}
                  title="Completed Goals"
                  subtitle={`${completedGoals.length} goal${completedGoals.length !== 1 ? "s" : ""} achieved`}
                />
                <div className="mt-6 space-y-3">
                  {completedGoals.map((goal) => (
                    <button
                      key={goal._id}
                      onClick={() => handleGoalClick(goal._id)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-gray-400 transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          size={18}
                          className="text-green-400 shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {goal.goal}
                          </p>
                          <p className="text-xs text-gray-500">
                            Score: {goal.confidenceScore}% •{" "}
                            {goal.completedAt
                              ? `Completed ${new Date(goal.completedAt).toLocaleDateString()}`
                              : "Completed"}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-500" />
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader
                icon={<BrainCircuit size={18} />}
                title="Quick Actions"
                subtitle="Jump back into learning"
              />
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/tutor")}
                  className="w-full px-5 py-3 rounded-2xl flex items-center gap-2 bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
                >
                  <BrainCircuit size={18} /> Start Tutor Session
                </button>
                <button
                  onClick={handleAddGoal}
                  className="w-full px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-gray-400 transition flex items-center gap-2 text-sm"
                >
                  <Plus size={18} /> Add New Learning Goal
                </button>
              </div>
            </Card>

            {/* Streak Card */}
            {stats && (
              <Card>
                <CardHeader
                  icon={<Flame size={18} className="text-orange-400" />}
                  title="Active Streak"
                  subtitle="Consecutive days of learning"
                />
                <div className="mt-6 text-center">
                  <div className="text-5xl font-extrabold text-gray-100">
                    {stats.activeStreak}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    day{stats.activeStreak !== 1 ? "s" : ""} in a row
                  </p>
                  <div className="mt-4 flex justify-center">
                    {renderStreak(stats.activeStreak)}
                  </div>
                </div>
              </Card>
            )}

            {/* At a Glance */}
            {stats && (
              <Card>
                <CardHeader
                  icon={<BarChart3 size={18} />}
                  title="At a Glance"
                  subtitle="Your learning stats"
                />
                <div className="mt-6 space-y-4">
                  <GlanceStat
                    label="Total Assessments"
                    value={stats.totalAssessments}
                  />
                  <GlanceStat
                    label="Average Score"
                    value={`${stats.averageScore}%`}
                  />
                  <GlanceStat label="Goals Created" value={stats.totalGoals} />
                  <GlanceStat
                    label="Goals Completed"
                    value={stats.completedGoals}
                  />
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

function StatCard({ icon, label, value }) {
  return (
    <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-100">{value}</div>
    </div>
  );
}

function GoalCard({ goal, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-6 rounded-3xl bg-black/30 border border-white/10 hover:border-gray-400 transition w-full"
    >
      <h3 className="font-semibold text-slate-100 text-base mb-2 line-clamp-2">
        {goal.goal}
      </h3>
      <div className="flex items-center justify-between mt-3">
        <div>
          <span className="text-xs text-gray-500 uppercase">
            {goal.experienceLevel}
          </span>
          <div className="mt-1">
            <span className="text-xl font-bold text-gray-200">
              {goal.confidenceScore}%
            </span>
            <span className="text-xs text-gray-500 ml-1">confidence</span>
          </div>
        </div>
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          <ArrowRight size={18} className="text-gray-400" />
        </div>
      </div>
      {/* Mini progress bar */}
      <div className="mt-3 w-full h-2 bg-black/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-300 transition-all"
          style={{ width: `${goal.confidenceScore}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Created {new Date(goal.createdAt).toLocaleDateString()}
      </p>
    </button>
  );
}

function GlanceStat({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-200">{value}</span>
    </div>
  );
}
