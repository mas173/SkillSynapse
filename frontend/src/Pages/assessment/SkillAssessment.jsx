import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ArrowRight,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function SkillAssessment() {
  const navigate = useNavigate();

  // Sample MVP Questions (Later: load dynamically from backend)
  const questions = [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "High Transfer Machine Language",
        "Hyper Trainer Marking Language",
        "Home Tool Markup Language",
      ],
      answer: 0,
    },
    {
      id: 2,
      question: "Which of these is a JavaScript framework?",
      options: ["Django", "React", "Laravel", "Flask"],
      answer: 1,
    },
    {
      id: 3,
      question: "What is the purpose of a database index?",
      options: [
        "To slow down queries",
        "To store images",
        "To improve query performance",
        "To delete unused data",
      ],
      answer: 2,
    },
    {
      id: 4,
      question: "Which data structure works on FIFO?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: 1,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = Math.round(((current + 1) / questions.length) * 100);

  function handleNext() {
    if (selected === null) {
      setError("Please select an option before continuing.");
      return;
    }

    setError("");

    const updatedAnswers = [
      ...answers,
      {
        questionId: questions[current].id,
        selectedOption: selected,
      },
    ];

    setAnswers(updatedAnswers);
    setSelected(null);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      handleSubmit(updatedAnswers);
    }
  }

  async function handleSubmit(finalAnswers) {
    setLoading(true);

    try {
      // Submit assessment answers to backend
      const res = await fetch(
        process.env.BACKEND_URL + "/assessment/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: finalAnswers,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Assessment submission failed.");
      }

      const data = await res.json();

      console.log("Assessment Result:", data);

      // Save skill gap report temporarily
      localStorage.setItem("skillGapReport", JSON.stringify(data));

      // Navigate to Skill Gap Report screen
      navigate("/assessment/report");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <Brain className="w-9 h-9 text-gray-200" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              Skill Gap Assessment
            </h1>
            <p className="text-sm text-gray-400">
              Answer a few questions so SkillSynapse can detect your weak areas.
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-black/30 border border-white/10 rounded-full h-3 overflow-hidden mb-10">
          <div
            className="h-3 bg-gray-200 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* QUESTION CARD */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">

          {/* Question */}
          <h2 className="text-xl font-semibold text-slate-100">
            Question {current + 1} of {questions.length}
          </h2>

          <p className="mt-4 text-gray-300 text-lg leading-relaxed">
            {questions[current].question}
          </p>

          {/* Options */}
          <div className="mt-8 space-y-3">
            {questions[current].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelected(index)}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition ${
                  selected === index
                    ? "bg-white/10 border-gray-300 text-white"
                    : "bg-black/20 border-white/10 text-gray-400 hover:text-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="mt-6 text-sm text-rose-300 bg-stone-900/40 border border-stone-700 px-4 py-3 rounded-2xl">
              {error}
            </p>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={loading}
            className="mt-10 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-200 text-black font-semibold hover:bg-gray-300 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Submitting...
              </>
            ) : current === questions.length - 1 ? (
              <>
                Finish Assessment <CheckCircle size={18} />
              </>
            ) : (
              <>
                Next Question <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="mt-6 text-xs text-gray-500 text-center">
            This assessment helps SkillSynapse provide explainable, adaptive
            tutoring.
          </p>
        </div>
      </div>
    </div>
  );
}
