import React, { useState, useEffect } from "react";
import { Brain } from "lucide-react";

const TIPS = [
  "AI is analyzing your learning patterns…",
  "Building your personalized roadmap…",
  "Calibrating difficulty to your level…",
  "Mapping skill gaps and strengths…",
  "Your AI tutor is getting ready…",
  "Syncing your progress data…",
];

export default function LoadingScreen({
  title = "Loading SkillSynapse…",
  subtitle = "Personalizing your learning experience",
}) {
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
        setTipVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{loaderCSS}</style>
      <div className="ls-screen">
        {/* Ambient floating particles */}
        <div className="ls-particles">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`ls-particle ls-p${i}`} />
          ))}
        </div>

        <div className="ls-content">
          {/* Animated brain orb */}
          <div className="ls-orb">
            <div className="ls-ring ls-ring1" />
            <div className="ls-ring ls-ring2" />
            <div className="ls-glow" />
            <div className="ls-brain">
              <Brain style={{ width: 40, height: 40 }} />
            </div>
            <div className="ls-orbit">
              <div className="ls-dot" />
            </div>
            <div className="ls-orbit ls-orbit2">
              <div className="ls-dot ls-dot2" />
            </div>
          </div>

          <h1 className="ls-title">{title}</h1>
          <p className="ls-sub">{subtitle}</p>

          {/* Progress bar */}
          <div className="ls-bar-track">
            <div className="ls-bar-fill" />
            <div className="ls-bar-shine" />
          </div>

          {/* Rotating tip */}
          <p className={`ls-tip ${tipVisible ? "ls-tip-show" : "ls-tip-hide"}`}>
            {TIPS[tipIndex]}
          </p>

          {/* Skeleton preview */}
          <div className="ls-skel-group">
            <div className="ls-skel-row">
              <div className="ls-skel ls-skel-sm" />
              <div className="ls-skel ls-skel-lg" />
            </div>
            <div className="ls-skel-row">
              <div className="ls-skel ls-skel-lg" />
              <div className="ls-skel ls-skel-sm" />
            </div>
            <div className="ls-skel-cards">
              <div className="ls-skel ls-skel-card" />
              <div className="ls-skel ls-skel-card" />
            </div>
          </div>

          <p className="ls-footer">SkillSynapse • AI-Powered Learning</p>
        </div>
      </div>
    </>
  );
}

// ── All styles embedded for zero-dependency rendering ──
const loaderCSS = `
.ls-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #020617 0%, #18181b 50%, #0a0a0a 100%);
  color: white;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.ls-content {
  width: 100%;
  max-width: 26rem;
  text-align: center;
  position: relative;
  z-index: 2;
  animation: lsFadeUp 0.8s ease-out;
}

@keyframes lsFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Particles ── */
.ls-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.ls-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
}

.ls-p0 { width:100px; height:100px; top:10%;  left:15%;  animation: lsFloat 8s ease-in-out infinite; }
.ls-p1 { width:60px;  height:60px;  top:65%;  right:10%; animation: lsFloat 10s ease-in-out infinite 1s; }
.ls-p2 { width:80px;  height:80px;  bottom:15%; left:8%; animation: lsFloat 9s ease-in-out infinite 2s; }
.ls-p3 { width:50px;  height:50px;  top:30%;  right:20%; animation: lsFloat 7s ease-in-out infinite 0.5s; }
.ls-p4 { width:40px;  height:40px;  top:80%;  left:40%;  animation: lsFloat 11s ease-in-out infinite 3s; }
.ls-p5 { width:70px;  height:70px;  top:5%;   right:35%; animation: lsFloat 8s ease-in-out infinite 1.5s; }

@keyframes lsFloat {
  0%,100% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-30px) scale(1.1); opacity: 0.6; }
}

/* ── Orb ── */
.ls-orb {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.ls-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid transparent;
}

.ls-ring1 {
  inset: -10px;
  border-top-color: rgba(255,255,255,0.15);
  border-right-color: rgba(255,255,255,0.05);
  animation: lsSpin 3s linear infinite;
}

.ls-ring2 {
  inset: 2px;
  border-bottom-color: rgba(255,255,255,0.12);
  border-left-color: rgba(255,255,255,0.04);
  animation: lsSpin 2.2s linear infinite reverse;
}

@keyframes lsSpin {
  to { transform: rotate(360deg); }
}

.ls-glow {
  position: absolute;
  inset: 15px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
  animation: lsPulse 2s ease-in-out infinite;
}

@keyframes lsPulse {
  0%,100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}

.ls-brain {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5e7eb;
  animation: lsBrainFloat 2.5s ease-in-out infinite;
}

@keyframes lsBrainFloat {
  0%,100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-3px) rotate(2deg); }
  75% { transform: translateY(3px) rotate(-2deg); }
}

.ls-orbit {
  position: absolute;
  inset: -18px;
  animation: lsSpin 4s linear infinite;
}

.ls-orbit2 {
  animation-duration: 5s;
  animation-direction: reverse;
}

.ls-dot {
  position: absolute;
  top: 50%;
  left: -3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  box-shadow: 0 0 8px rgba(255,255,255,0.2);
}

.ls-dot2 {
  left: auto;
  right: -3px;
  width: 4px;
  height: 4px;
  background: rgba(255,255,255,0.25);
}

/* ── Text ── */
.ls-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.ls-sub {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0 0 2rem;
}

/* ── Bar ── */
.ls-bar-track {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
  position: relative;
  margin-bottom: 1.5rem;
}

.ls-bar-fill {
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  border-radius: 2px;
  animation: lsBarSlide 1.8s ease-in-out infinite;
}

.ls-bar-shine {
  position: absolute;
  top: 0; left: 0;
  width: 20%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  animation: lsBarSlide 2.4s ease-in-out infinite 0.6s;
}

@keyframes lsBarSlide {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(350%); }
}

/* ── Tip ── */
.ls-tip {
  font-size: 0.8rem;
  color: #6b7280;
  min-height: 1.5rem;
  transition: opacity 0.4s ease, transform 0.4s ease;
  margin: 0 0 2rem;
}

.ls-tip-show {
  opacity: 1;
  transform: translateY(0);
}

.ls-tip-hide {
  opacity: 0;
  transform: translateY(6px);
}

/* ── Skeleton ── */
.ls-skel-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ls-skel-row {
  display: flex;
  gap: 0.6rem;
}

.ls-skel {
  height: 12px;
  border-radius: 6px;
  background: rgba(255,255,255,0.04);
  position: relative;
  overflow: hidden;
}

.ls-skel::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
  animation: lsShimmer 1.8s infinite;
}

@keyframes lsShimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

.ls-skel-sm { flex: 1; }
.ls-skel-lg { flex: 2.5; }

.ls-skel-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.ls-skel-card {
  height: 48px;
  border-radius: 12px;
}

.ls-footer {
  margin-top: 2.5rem;
  font-size: 0.7rem;
  color: #374151;
  letter-spacing: 0.05em;
}

@media (prefers-reduced-motion: reduce) {
  .ls-particle, .ls-ring, .ls-glow, .ls-brain,
  .ls-orbit, .ls-bar-fill, .ls-bar-shine, .ls-skel::after {
    animation: none !important;
  }
}
`;
