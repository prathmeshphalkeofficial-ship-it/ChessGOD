"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState(0); // 0: logo, 1: tagline, 2: loading, 3: done

  useEffect(() => {
    // Phase 0: Show logo
    const timer1 = setTimeout(() => setPhase(1), 1500);
    
    // Phase 1: Show tagline
    const timer2 = setTimeout(() => setPhase(2), 2500);
    
    // Phase 2: Loading complete
    const timer3 = setTimeout(() => {
      setPhase(3);
      setTimeout(onFinish, 500);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  if (phase === 3) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508]">
      {/* Divine background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.08) 0%, transparent 70%)",
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              backgroundColor: Math.random() > 0.5 ? "rgba(255, 215, 0, 0.6)" : "rgba(59, 130, 246, 0.6)",
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + "s",
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div 
          className={`transition-all duration-1000 ${
            phase >= 1 ? "scale-110 opacity-80" : "scale-100"
          }`}
        >
          <div className="relative">
            {/* Glowing chessgod.png */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)",
                filter: "blur(40px)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <img 
              src="/chessgod.png" 
              alt="ChessGOD"
              className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10"
              style={{
                filter: "drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))",
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`mt-8 font-mono text-4xl md:text-6xl font-black tracking-tighter transition-all duration-1000 ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "gold-shimmer 3s linear infinite",
            filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))",
          }}
        >
          CHESSGOD
        </h1>

        {/* Tagline */}
        <p 
          className={`mt-4 font-mono text-sm md:text-base text-[var(--cg-text-dim)] tracking-widest transition-all duration-1000 ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Can Humanity Defeat God?
        </p>

        {/* Loading Bar */}
        <div 
          className={`mt-12 transition-all duration-1000 ${
            phase >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-64 md:w-80 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.8), transparent)",
                animation: "shimmer 1.5s ease-in-out infinite",
                backgroundSize: "200% 100%",
              }}
            />
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-gold-500 rounded-full transition-all duration-[2000ms] ease-out"
              style={{
                width: phase >= 2 ? "100%" : "0%",
                background: "linear-gradient(90deg, #3b82f6, #d4a843)",
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              }}
            />
          </div>
          <p className="mt-3 text-center font-mono text-xs text-[var(--cg-text-muted)] tracking-widest">
            {phase >= 2 ? "INITIALIZING NEURAL PATHWAYS..." : ""}
          </p>
        </div>
      </div>

      {/* Bottom text */}
      <div 
        className={`absolute bottom-12 transition-all duration-1000 ${
          phase >= 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="font-mono text-xs text-[var(--cg-text-muted)] tracking-widest">
          POWERED BY STOCKFISH 16 • DEPTH {20}
        </p>
      </div>
    </div>
  );
}