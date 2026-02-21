import React, { useEffect, useState } from "react";
import {
  Brain,
  Calendar,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import LoadingScreen from "../../Components/common/Loader";


export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openWeek, setOpenWeek] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  async function fetchRoadmap() {
    // 🔹 MOCK DATA (replace later with backend response)
    const mockResponse = {
      profile: {
        goal: "Become a Full Stack AI Engineer",
      },
      roadmap: {
        overallProgress: 32,
        weeks: [
          {
            weekNumber: 1,
            title: "Programming Foundations",
            tasks: [
              {
                title: "Learn JavaScript basics",
                description: "Variables, loops, functions, arrays",
                completed: true,
              },
              {
                title: "Understand ES6 features",
                description: "Arrow functions, destructuring, modules",
                completed: false,
              },
            ],
          },
          {
            weekNumber: 2,
            title: "React Fundamentals",
            tasks: [
              {
                title: "Components & Props",
                description: "Create reusable UI components",
                completed: false,
              },
              {
                title: "Hooks",
                description: "useState, useEffect, event handling",
                completed: false,
              },
            ],
          },
          {
            weekNumber: 3,
            title: "Backend Introduction",
            tasks: [
              {
                title: "Learn Node.js basics",
                description: "Server setup, routing",
                completed: false,
              },
              {
                title: "REST APIs",
                description: "Create CRUD endpoints",
                completed: false,
              },
            ],
          },
        ],
      },
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setRoadmap(mockResponse.roadmap);
      setProfile(mockResponse.profile);
    } catch (err) {
      console.error("Mock Roadmap Error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <LoadingScreen
        title="Generating Your AI Roadmap..."
        subtitle="Designing weekly milestones tailored to your goal"
      />
    );
  }

  const overallProgress = roadmap?.overallProgress || 0;

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
            <p className="text-gray-500 text-sm">
              Goal: {profile?.goal}
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Completion</span>
            <span>{overallProgress}%</span>
          </div>

          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-200 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ROADMAP WEEKS */}
      <div className="px-8 py-12 space-y-8 max-w-5xl mx-auto">
        {roadmap?.weeks?.map((week, index) => {
          const isOpen = openWeek === index;

          return (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md transition hover:border-gray-400"
            >
              {/* Week Header */}
              <div
                onClick={() => setOpenWeek(isOpen ? null : index)}
                className="flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Calendar className="text-gray-300" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-100">
                      Week {week.weekNumber}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {week.title}
                    </p>
                  </div>
                </div>

                {isOpen ? (
                  <ChevronUp className="text-gray-400" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </div>

              {/* Expandable Tasks */}
              {isOpen && (
                <div className="mt-6 space-y-4">
                  {week.tasks.map((task, taskIndex) => (
                    <TaskItem key={taskIndex} task={task} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Suggestion Section */}
      <div className="px-8 pb-16 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-slate-800 via-zinc-800 to-neutral-800 border border-white/10 rounded-3xl p-8 flex items-start gap-4">
          <Sparkles className="text-gray-300" />
          <div>
            <h3 className="text-gray-100 font-semibold mb-2">
              AI Recommendation
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Based on your weak skills, focus more on consistent daily
              practice. If you fall behind in a week, your roadmap will
              auto-adjust dynamically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= TASK ITEM ================= */

function TaskItem({ task }) {
  const [completed, setCompleted] = useState(task.completed);

  return (
    <div
      onClick={() => setCompleted(!completed)}
      className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-gray-400 cursor-pointer transition"
    >
      {completed ? (
        <CheckCircle className="text-gray-200" />
      ) : (
        <Circle className="text-gray-500" />
      )}

      <div>
        <p
          className={`text-sm ${
            completed
              ? "line-through text-gray-500"
              : "text-gray-200"
          }`}
        >
          {task.title}
        </p>

        <p className="text-xs text-gray-500">
          {task.description}
        </p>
      </div>
    </div>
  );
}
