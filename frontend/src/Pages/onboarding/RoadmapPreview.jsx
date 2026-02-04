// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Brain,
//   Target,
//   BarChart3,
//   ArrowRight,
//   CheckCircle,
// } from "lucide-react";

// export default function RoadmapPreview() {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     // Load AI-generated profile from localStorage
//     const stored = localStorage.getItem("skillSynapseProfile");

//     if (stored) {
//       setProfile(JSON.parse(stored));
//     }
//   }, []);

//   function handleStartAssessment() {
//     navigate("/assessment");
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-300">
//         Loading your roadmap...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
//       <div className="max-w-4xl mx-auto">

//         <div className="flex items-center gap-3 mb-8">
//           <Brain className="w-9 h-9 text-gray-200" />
//           <div>
//             <h1 className="text-3xl font-bold text-slate-100">
//               Your Personalized Roadmap
//             </h1>
//             <p className="text-sm text-gray-400">
//               SkillSynapse AI analyzed your goal and prepared this learning path.
//             </p>
//           </div>
//         </div>

//         <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">

//           {/* Track + Level */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <InfoCard
//               icon={<Target />}
//               title="Learning Track"
//               value={profile.track || "Custom Skill Path"}
//             />

//             <InfoCard
//               icon={<BarChart3 />}
//               title="Starting Level"
//               value={profile.level || "Beginner"}
//             />
//           </div>

//           {/* Focus Areas */}
//           <div className="mt-10">
//             <h2 className="text-xl font-semibold text-slate-100">
//               Key Focus Areas
//             </h2>

//             <p className="text-sm text-gray-400 mt-2">
//               These are the skills the AI believes will help you progress fastest.
//             </p>

//             <div className="mt-4 flex flex-wrap gap-3">
//               {(profile.focusAreas || []).map((skill, index) => (
//                 <span
//                   key={index}
//                   className="px-4 py-2 rounded-2xl bg-black/30 border border-white/10 text-sm text-gray-200"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Weekly Plan */}
//           <div className="mt-10">
//             <h2 className="text-xl font-semibold text-slate-100">
//               Suggested Plan Duration
//             </h2>

//             <p className="mt-2 text-gray-300">
//               📌 {profile.planDuration || "4–8 weeks roadmap"}
//             </p>
//           </div>

//           {/* Explainability Section */}
//           <div className="mt-10 p-6 rounded-3xl bg-black/30 border border-white/10">
//             <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
//               <CheckCircle className="text-gray-200" size={18} />
//               Why this roadmap?
//             </h3>

//             <p className="mt-3 text-sm text-gray-400 leading-relaxed">
//               SkillSynapse builds your roadmap based on your goal description,
//               preferred learning style, and time commitment.  
//               This ensures learning feels structured, supportive, and confidence-boosting.
//             </p>
//           </div>

//           <button
//             onClick={handleStartAssessment}
//             className="mt-10 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
//           >
//             Start Skill Assessment <ArrowRight size={18} />
//           </button>

//           {/* Footer Note */}
//           <p className="mt-6 text-xs text-gray-500 text-center">
//             Next, we’ll quickly assess your current level so SkillSynapse can adapt
//             perfectly to you.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoCard({ icon, title, value }) {
//   return (
//     <div className="p-6 rounded-3xl bg-black/30 border border-white/10 flex items-start gap-4">
//       <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-gray-200">
//         {icon}
//       </div>

//       <div>
//         <p className="text-sm text-gray-400">{title}</p>
//         <h3 className="text-lg font-semibold text-slate-100 mt-1">
//           {value}
//         </h3>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

// Mock Data for previewing the roadmap
const MOCK_PROFILE = {
  track: "Full-Stack Web Development (MERN)",
  level: "Intermediate",
  focusAreas: [
    "React Server Components",
    "Node.js Performance Tuning",
    "MongoDB Aggregation Pipelines",
    "System Design Patterns",
    "Redis Caching Strategies"
  ],
  planDuration: "12 Weeks (Accelerated Path)",
};

export default function RoadmapPreview() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // 1. Try to load from localStorage
    const stored = localStorage.getItem("skillSynapseProfile");

    if (stored) {
      setProfile(JSON.parse(stored));
    } else {
      // 2. Fallback to Mock Data for frontend development/preview
      console.log("No profile found in localStorage, using sample data.");
      setProfile(MOCK_PROFILE);
    }
  }, []);

  function handleStartAssessment() {
    navigate("/assessment");
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-300">
        <div className="animate-pulse">Loading your roadmap...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Brain className="w-8 h-8 text-gray-100" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              Your Personalized Roadmap
            </h1>
            <p className="text-sm text-gray-400">
              SkillSynapse AI analyzed your goal and prepared this learning path.
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
              These are the core competencies identified for your specific path.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {(profile.focusAreas || []).map((skill, index) => (
                <span
                  key={index}
                  className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Weekly Plan */}
          <div className="mt-12 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20">
            <h2 className="text-sm font-medium uppercase tracking-widest text-blue-400">
              Suggested Duration
            </h2>
            <p className="mt-2 text-2xl font-semibold text-white">
              {profile.planDuration}
            </p>
          </div>

          {/* Explainability Section */}
          <div className="mt-10 p-6 rounded-3xl bg-black/40 border border-white/5">
            <h3 className="text-md font-semibold flex items-center gap-2 text-slate-200">
              <CheckCircle className="text-emerald-400" size={20} />
              Why this roadmap?
            </h3>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              SkillSynapse generates this roadmap using our custom LLM logic. It prioritizes 
              **industry-standard prerequisites** before moving into specialized topics, 
              ensuring you don't face a "knowledge gap" halfway through your journey.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartAssessment}
            className="mt-10 w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-300 text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          >
            Start Skill Assessment <ArrowRight size={20} />
          </button>

          {/* Footer Note */}
          <p className="mt-8 text-xs text-gray-500 text-center uppercase tracking-tighter">
            Next step: Adaptive assessment (approx. 5 mins)
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="p-6 rounded-3xl bg-black/20 border border-white/5 flex items-center gap-5 hover:border-white/20 transition-colors">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 text-gray-100 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-lg font-bold text-slate-100 mt-0.5 leading-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}