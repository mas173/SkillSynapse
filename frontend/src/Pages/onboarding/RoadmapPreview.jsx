import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../services/axios/axios";

export default function RoadmapPreview() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        setLoading(true);
        setError("");
        const res = await axiosInstance.post("/onboarding/roadmap");

        const aiData = res.data.data.json;

        setProfile({
          track: aiData.summary,
          level: aiData.estimatedCompletion,
          focusAreas: aiData.roadmap.map((item) => item.phase),
          planDuration: aiData.estimatedCompletion,
        });
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load roadmap.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, []);

  function handleStartAssessment() {
    navigate("/assessment");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-gray-300">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="animate-spin" size={22} />
          Generating your personalized roadmap...
        </div>
      </div>
    );
  }

  if (error) {
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

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Brain className="w-8 h-8 text-gray-100" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              Your Personalized Roadmap
            </h1>
            <p className="text-sm text-gray-400">
              Generated using your goal, experience level, and learning
              preferences.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Track + Level */}
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard
              icon={<Target className="w-6 h-6" />}
              title="Learning Track"
              value={profile.track}
            />

            <InfoCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Starting Level"
              value={profile.level}
            />
          </div>

          {/* Focus Areas */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-slate-100 px-1">
              Key Focus Areas
            </h2>
            <p className="text-sm text-gray-400 mt-2 px-1">
              Core competencies required for mastery.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {(profile.focusAreas || []).map((skill, index) => (
                <span
                  key={index}
                  className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-white/10">
            <h2 className="text-sm font-medium uppercase tracking-widest text-gray-400">
              Suggested Duration
            </h2>
            <p className="mt-2 text-2xl font-semibold text-white">
              {profile.planDuration}
            </p>
          </div>

          {/* Explainability */}
          <div className="mt-10 p-6 rounded-3xl bg-black/40 border border-white/5">
            <h3 className="text-md font-semibold flex items-center gap-2 text-slate-200">
              <CheckCircle className="text-gray-300" size={20} />
              Why this roadmap?
            </h3>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              This roadmap is structured based on prerequisite dependency
              mapping, estimated learning velocity, and your selected experience
              level. Topics are ordered to minimize cognitive overload and
              maximize retention.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleStartAssessment}
            className="mt-10 w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gray-200 text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          >
            Start Skill Assessment <ArrowRight size={20} />
          </button>

          <p className="mt-8 text-xs text-gray-500 text-center uppercase tracking-tight">
            Next step: Adaptive assessment (≈ 5 minutes)
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="p-6 rounded-3xl bg-black/20 border border-white/5  hover:border-white/20 transition-colors"> 
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-gray-100 shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-lg font-bold text-slate-100 mt-0.5 uppercase leading-tight">
            {title}
          </p>
        </div>
        </div>
      <div className="mt-4">
         <h3 className="text-sm font-medium text-gray-500 tracking-wide">
          {value}
        </h3>
      </div>
    </div>
  );
}
