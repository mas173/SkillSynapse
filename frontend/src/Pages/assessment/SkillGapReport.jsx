// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Brain,
//   CheckCircle,
//   AlertTriangle,
//   BarChart3,
//   ArrowRight,
// } from "lucide-react";

// export default function SkillGapReport() {
//   const navigate = useNavigate();

//   const [report, setReport] = useState(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("skillGapReport");

//     if (stored) {
//       setReport(JSON.parse(stored));
//     }
//   }, []);

//   function handleContinue() {
//     navigate("/dashboard");
//   }

//   if (!report) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-300">
//         Loading your skill report...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
//       <div className="max-w-4xl mx-auto">

//         {/*  HEADER  */}
//         <div className="flex items-center gap-3 mb-10">
//           <Brain className="w-9 h-9 text-gray-200" />
//           <div>
//             <h1 className="text-3xl font-bold text-slate-100">
//               Skill Gap Report
//             </h1>
//             <p className="text-sm text-gray-400">
//               Here is what SkillSynapse discovered about your current level.
//             </p>
//           </div>
//         </div>

//         {/*  CONFIDENCE SCORE  */}
//         <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md mb-10">
//           <div className="flex items-center justify-between flex-wrap gap-6">
//             <div>
//               <h2 className="text-xl font-semibold text-slate-100">
//                 Confidence Score
//               </h2>
//               <p className="text-sm text-gray-400 mt-2">
//                 A measure of how comfortable you are with the tested concepts.
//               </p>
//             </div>

//             <div className="text-4xl font-extrabold text-gray-200">
//               {report.confidenceScore || 0}%
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="w-full bg-black/30 border border-white/10 rounded-full h-3 overflow-hidden mt-6">
//             <div
//               className="h-3 bg-gray-200 transition-all"
//               style={{
//                 width: `${report.confidenceScore || 0}%`,
//               }}
//             />
//           </div>
//         </div>

//         {/*  STRENGTHS + WEAKNESS */}
//         <div className="grid md:grid-cols-2 gap-8 mb-10">

//           {/* Strengths */}
//           <div className="p-8 rounded-3xl bg-black/30 border border-white/10 shadow-lg">
//             <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
//               <CheckCircle className="text-gray-200" size={18} />
//               Strength Areas
//             </h2>

//             <p className="text-sm text-gray-400 mt-2">
//               Topics you are already doing well in.
//             </p>

//             <div className="mt-5 flex flex-wrap gap-3">
//               {(report.strengths || []).map((skill, index) => (
//                 <span
//                   key={index}
//                   className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-200"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Weak Skills */}
//           <div className="p-8 rounded-3xl bg-black/30 border border-white/10 shadow-lg">
//             <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
//               <AlertTriangle className="text-gray-200" size={18} />
//               Skill Gaps Detected
//             </h2>

//             <p className="text-sm text-gray-400 mt-2">
//               These areas need more practice and guidance.
//             </p>

//             <div className="mt-5 flex flex-wrap gap-3">
//               {(report.weakSkills || []).map((skill, index) => (
//                 <span
//                   key={index}
//                   className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-200"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* AI EXPLANATION */}
//         <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md mb-10">
//           <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
//             <BarChart3 className="text-gray-200" size={18} />
//             Explainable AI Feedback
//           </h2>

//           <p className="mt-4 text-gray-300 leading-relaxed">
//             {report.explanation ||
//               "SkillSynapse will now generate your adaptive roadmap based on your weak areas."}
//           </p>

//           <p className="mt-4 text-sm text-gray-500">
//             This feedback is designed to reduce confusion and boost confidence.
//           </p>
//         </div>

//         <button
//           onClick={handleContinue}
//           className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
//         >
//           Continue to Dashboard <ArrowRight size={18} />
//         </button>

//         {/* Footer */}
//         <p className="mt-6 text-xs text-gray-500 text-center">
//           Next, your AI Tutor will guide you step-by-step through these gaps.
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function SkillGapReport() {
  const navigate = useNavigate();

  const sampleReport = {
    confidenceScore: 72,
    strengths: [
      "JavaScript Fundamentals",
      "React Components",
      "HTML & CSS",
      "API Integration",
    ],
    weakSkills: [
      "Redux State Management",
      "React Performance Optimization",
      "TypeScript Basics",
      "Testing with Jest",
    ],
    explanation:
      "You have a strong foundation in core React concepts and frontend development. However, your responses indicate difficulty with advanced topics such as state management, performance tuning, and testing. Focusing on these areas will significantly improve your readiness for real-world projects.",
  };

  const [report, setReport] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("skillGapReport");

    if (stored) {
      setReport(JSON.parse(stored));
    } else {
      setReport(sampleReport);
    }
  }, []);

  function handleContinue() {
    navigate("/dashboard");
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-300">
        Loading your skill report...
      </div>
    );
  }

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
                A measure of how comfortable you are with the tested concepts.
              </p>
            </div>

            <div className="text-4xl font-extrabold text-gray-200">
              {report.confidenceScore || 0}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/30 border border-white/10 rounded-full h-3 overflow-hidden mt-6">
            <div
              className="h-3 bg-gray-200 transition-all"
              style={{
                width: `${report.confidenceScore || 0}%`,
              }}
            />
          </div>
        </div>

        {/*  STRENGTHS + WEAKNESS  */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Strengths */}
          <div className="p-8 rounded-3xl bg-black/30 border border-white/10 shadow-lg">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
              <CheckCircle className="text-gray-200" size={18} />
              Strength Areas
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Topics you are already doing well in.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {(report.strengths || []).map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Weak Skills */}
          <div className="p-8 rounded-3xl bg-black/30 border border-white/10 shadow-lg">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
              <AlertTriangle className="text-gray-200" size={18} />
              Skill Gaps Detected
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              These areas need more practice and guidance.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {(report.weakSkills || []).map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/*  AI EXPLANATION */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md mb-10">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
            <BarChart3 className="text-gray-200" size={18} />
            Explainable AI Feedback
          </h2>

          <p className="mt-4 text-gray-300 leading-relaxed">
            {report.explanation}
          </p>

          <p className="mt-4 text-sm text-gray-500">
            This feedback is designed to reduce confusion and boost confidence.
          </p>
        </div>

        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition"
        >
          Continue to Dashboard <ArrowRight size={18} />
        </button>

        <p className="mt-6 text-xs text-gray-500 text-center">
          Next, your AI Tutor will guide you step-by-step through these gaps.
        </p>
      </div>
    </div>
  );
}
