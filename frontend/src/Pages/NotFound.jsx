import React from "react";
import { Link } from "react-router-dom";
import { Brain, MoveLeft, RefreshCw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-500/10 rounded-full blur-[120px]" />
      </div>

      {/* 404 Iconography */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-slate-800/50 scale-150 opacity-20" />
        <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
          <Brain size={64} className="text-slate-400 animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-zinc-500 w-6 h-6 rounded-full border-4 border-slate-950" />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-8xl font-black text-slate-100 tracking-tighter">
        4<span className="text-zinc-500">0</span>4
      </h1>
      
      <h2 className="mt-4 text-2xl font-bold text-slate-200">
        Synapse Disconnected
      </h2>
      
      <p className="mt-4 text-slate-400 max-w-md leading-relaxed">
        It looks like the skill path you're looking for doesn't exist or has been 
        re-routed. Let's get your learning back on track.
      </p>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-950 rounded-2xl font-semibold hover:bg-white transition-all transform hover:-translate-y-1"
        >
          <MoveLeft size={18} />
          Return to Base
        </Link>
        
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl font-semibold hover:bg-slate-800 transition-all"
        >
          <RefreshCw size={18} />
          Retry Connection
        </button>
      </div>

      {/* Technical Footer for 404 */}
      <p className="mt-16 text-xs font-mono text-slate-500 uppercase tracking-widest">
        Error_Code: NEURAL_PATH_NOT_FOUND // SkillSynapse_v1.0
      </p>
    </div>
  );
}