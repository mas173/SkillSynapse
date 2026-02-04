import React from "react";
import { Brain } from "lucide-react";

export default function LoadingScreen({
  title = "Loading SkillSynapse...",
  subtitle = "Personalizing your learning experience",
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white px-6">

      <div className="w-full max-w-md text-center">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md animate-pulse">
            <Brain className="w-10 h-10 text-gray-200 animate-spin-slow" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-100">
          {title}
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          {subtitle}
        </p>

        <div className="mt-8 w-full h-3 rounded-full bg-black/30 border border-white/10 overflow-hidden">
          <div className="h-3 w-1/2 bg-gray-200 animate-loading-bar" />
        </div>

        <div className="mt-10 space-y-4 text-left">

          <SkeletonLine width="80%" />
          <SkeletonLine width="95%" />
          <SkeletonLine width="70%" />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>

        <p className="mt-10 text-xs text-gray-600 text-center">
          © 2026 SkillSynapse. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// Helper functions

function SkeletonLine({ width }) {
  return (
    <div
      className="h-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative"
      style={{ width }}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
