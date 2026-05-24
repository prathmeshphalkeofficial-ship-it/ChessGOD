"use client";

import { useState } from "react";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedChessGrid from "@/components/AnimatedChessGrid";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Backgrounds */}
      <ParticleBackground />
      <AnimatedChessGrid />

      {/* Divine light rays from top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 pointer-events-none z-0">
        <div 
          className="w-full h-full opacity-20"
          style={{
            background: "radial-gradient(ellipse at top, rgba(255, 215, 0, 0.3) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-5xl">
        <div className="stagger-children">
          {/* Divine Eye Symbol */}
          <div className="mb-6 animate-float">
            <div className="relative inline-block">
              <span className="text-6xl md:text-8xl filter drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                👁
              </span>
              <div className="absolute inset-0 animate-pulse">
                <div className="w-full h-full rounded-full" style={{
                  background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }} />
              </div>
            </div>
          </div>

          {/* Title with god-like golden effect */}
          <h1 className="font-mono text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 animate-float"
            style={{
              background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #ffd700 50%, #ffed4e 75%, #ffd700 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gold-shimmer 3s linear infinite",
              filter: "drop-shadow(0 0 40px rgba(255, 215, 0, 0.5))",
            }}>
            CHESSGOD
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl md:text-3xl font-light tracking-wide text-[var(--cg-text-dim)] mb-12">
            Can Humanity Defeat{" "}
            <span 
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
              }}
            >
              God
            </span>
            ?
          </h2>

          {/* Call to Action */}
          <div className="mb-16 flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Challenge God Button - Primary */}
            <Link
              href="/play"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-mono font-bold text-lg md:text-xl tracking-widest text-white uppercase overflow-hidden transition-all duration-300 touch-target"
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "16px",
                border: "1px solid rgba(59, 130, 246, 0.5)",
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.3), inset 0 0 40px rgba(59, 130, 246, 0.1)",
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4))",
                  filter: "blur(20px)",
                }} />
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
                padding: "1px",
                borderRadius: "16px",
              }} />
              
              <span className="relative flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Challenge God
              </span>
            </Link>
            
            {/* Watch God vs God Button - Secondary */}
            <Link
               href="/play?mode=god-vs-god"
               className="group relative inline-flex items-center justify-center px-6 py-3 font-mono font-bold text-sm md:text-base tracking-widest uppercase overflow-hidden transition-all duration-300 touch-target"
               style={{
                 background: "linear-gradient(135deg, rgba(212, 168, 67, 0.2), rgba(255, 215, 0, 0.1))",
                 backdropFilter: "blur(20px)",
                 WebkitBackdropFilter: "blur(20px)",
                 borderRadius: "16px",
                 border: "1px solid rgba(212, 168, 67, 0.4)",
                 boxShadow: "0 0 30px rgba(212, 168, 67, 0.2), inset 0 0 30px rgba(212, 168, 67, 0.05)",
               }}
            >
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(135deg, rgba(212, 168, 67, 0.3), rgba(255, 215, 0, 0.2))",
                  filter: "blur(20px)",
                }} />
              </div>
               
              <span className="relative flex items-center gap-2" style={{
                background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                <span>🎭</span>
                Watch God vs God
              </span>
            </Link>
          </div>

          {/* Global Statistics Panel - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-6 text-sm md:text-base relative">
            {/* Divine background glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(59, 130, 246, 0.05))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 215, 0, 0.1)",
            }} />
            
            {/* Stat 1 */}
            <div className="flex flex-col space-y-1 relative z-10 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-[var(--cg-text-muted)] uppercase tracking-wider font-mono text-xs">
                Total Challengers
              </span>
              <span className="font-bold text-white text-lg" style={{
                textShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
              }}>2,184,331</span>
            </div>
            
            {/* Stat 2 */}
            <div className="flex flex-col space-y-1 relative z-10 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-[var(--cg-text-muted)] uppercase tracking-wider font-mono text-xs">
                Humanity Win Rate
              </span>
              <span className="font-bold text-[var(--cg-crimson)] text-lg" style={{
                textShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
              }}>0.0008%</span>
            </div>
            
            {/* Stat 3 */}
            <div className="flex flex-col space-y-1 relative z-10 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-[var(--cg-text-muted)] uppercase tracking-wider font-mono text-xs">
                Longest Survival
              </span>
              <span className="font-bold text-[var(--cg-gold)] text-lg" style={{
                textShadow: "0 0 20px rgba(212, 168, 67, 0.5)",
              }}>47 Moves</span>
            </div>
            
            {/* Stat 4 */}
            <div className="flex flex-col space-y-1 relative z-10 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-[var(--cg-text-muted)] uppercase tracking-wider font-mono text-xs">
                Latest Godslayer
              </span>
              <span className="font-bold text-[var(--cg-cyan)] text-lg" style={{
                textShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
              }}>Unknown_17</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Overlays */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--cg-bg)] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--cg-bg)_100%)] pointer-events-none z-[5]" />
      
      {/* Side divine glows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none z-0" style={{
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none z-0" style={{
        background: "radial-gradient(circle, rgba(212, 168, 67, 0.1) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />
    </main>
  );
}
