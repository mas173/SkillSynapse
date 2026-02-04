import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Sparkles,
  BarChart3,
  Target,
  ArrowRight,
  BookOpen,
  MessageSquareText,
  RefreshCcw,
  BrainCircuit,
  FileText,
  ListCheck,
  LocateFixed,
} from "lucide-react";
import LoadingScreen from "../../Components/common/Loader";

export default function Dashboard() {
  const navigate = useNavigate();

  //  Mock Data (Later: fetch from backend) 
  const mockData = {
    profile: {
      name: "Ayaan",
      track: "Full Stack Development",
      level: "Intermediate",
      focusAreas: ["React Advanced", "Node.js APIs", "MongoDB"],
    },
    progress: {
      confidenceScore: 74,
      strengths: [
        "JavaScript Fundamentals",
        "React Components",
        "HTML & CSS",
        "API Integration",
      ],
      weakSkills: [
        "Redux Toolkit",
        "React Performance Optimization",
        "Testing with Jest",
        "TypeScript Basics",
      ],
    },
  };

  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError("");

      //Simulate API delay
      setTimeout(() => {
        setProfile(mockData.profile);
        setProgress(mockData.progress);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError("Unable to load dashboard preview.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  //  USER VALUES 
  const userName = useMemo(() => {
    return profile?.name || "Learner";
  }, [profile]);

  const confidenceScore = progress?.confidenceScore ?? 0;
  const strengths = progress?.strengths ?? [];
  const weakSkills = progress?.weakSkills ?? [];

  const track = profile?.track ?? "Personalized Track";
  const level = profile?.level ?? "Beginner";
  const focusAreas = profile?.focusAreas ?? [];

  //  NEXT STEPS
  const nextSteps = useMemo(() => {
    const steps = [];

    if (weakSkills.length > 0) {
      steps.push({
        title: `Fix weak area: ${weakSkills[0]}`,
        desc: "Start guided learning with hints.",
        action: () => navigate("/tutor"),
        cta: "Open AI Tutor",
      });
    }

    if (focusAreas.length > 0) {
      steps.push({
        title: `Continue roadmap: ${focusAreas[0]}`,
        desc: "Follow your AI-generated roadmap.",
        action: () => navigate("/roadmap"),
        cta: "View Roadmap",
      });
    }

    steps.push({
      title: "Take a revision quiz",
      desc: "Boost your confidence score.",
      action: () => navigate("/assessment"),
      cta: "Start Quiz",
    });

    return steps.slice(0, 3);
  }, [weakSkills, focusAreas, navigate]);

  // HANDLERS
  function handleGoTutor() {
    navigate("/tutor");
  }

  function handleGoAssessment() {
    navigate("/assessment");
  }

  function handleGoRoadmap() {
    navigate("/roadmap");
  }


  if (loading) {
    return (
      <LoadingScreen title="Loading Dashboard" subtitle="Fetching your progress from SkillSynapse AI"/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6">
        <p className="text-lg font-semibold text-red-400">{error}</p>

        <button
          onClick={fetchDashboardData}
          className="mt-6 px-6 py-3 rounded-2xl bg-gray-200 text-black font-semibold flex items-center gap-2 hover:bg-gray-300 transition"
        >
          <RefreshCcw size={18} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-6 mb-10">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-gray-200" />
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                Learner Dashboard
              </h1>
              <p className="text-sm text-gray-400">
                Welcome back,{" "}
                <span className="text-gray-200">{userName}</span> 👋
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Track: {track} • Level: {level}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGoTutor}
              className="px-5 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition flex items-center gap-2"
            >
              <BrainCircuit size={18} />
              AI Tutor
            </button>

            <button
              onClick={handleGoAssessment}
              className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-gray-400 transition text-sm flex items-center gap-2"
            >
              <BarChart3 size={18} />
              Re-Assessment
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Confidence + Skill Gap */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Confidence */}
              <Card>
                <CardHeader
                  icon={<BarChart3 size={18} />}
                  title="Confidence Score"
                  subtitle="Updated from your latest assessment"
                />

                <div className="mt-6 text-4xl font-extrabold text-gray-100">
                  {confidenceScore}%
                </div>

                <div className="w-full bg-black/30 border border-white/10 rounded-full h-3 mt-5 overflow-hidden">
                  <div
                    className="h-3 bg-gray-200"
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
              </Card>

              {/* Skill Gap */}
              <Card>
                <CardHeader
                  icon={<LocateFixed size={18} />}
                  title="Skill Gaps"
                  subtitle="Areas needing improvement"
                />

                <div className="mt-6 flex flex-wrap gap-3">
                  {weakSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-2xl bg-black/30 border border-white/10 text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Strength Areas */}
            <Card>
              <CardHeader
                icon={<Brain size={18} />}
                title="Strength Areas"
                subtitle="Skills you already mastered"
              />

              <div className="mt-6 flex flex-wrap gap-3">
                {strengths.map((s, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>

            {/* Continue Learning */}
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
                onClick={handleGoTutor}
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

              <button
                onClick={handleGoRoadmap}
                className="mt-6 w-full px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:border-gray-400 transition flex gap-2"
              >
                <FileText size={18} />View Roadmap
              </button>
            </Card>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-gray-600">
          SkillSynapse • Persistent Progress • Explainable AI
        </p>
      </div>
    </div>
  );
}

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
