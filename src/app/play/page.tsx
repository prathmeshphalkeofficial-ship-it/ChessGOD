"use client";

import { useState } from "react";
import ChessGame from "@/components/ChessGame";
import EvalBar from "@/components/EvalBar";
import PredictionOverlay from "@/components/PredictionOverlay";
import PressureMeter from "@/components/PressureMeter";
import AIDialogue from "@/components/AIDialogue";
import { PredictionResult } from "@/lib/prediction";
import { PressureAnalysis } from "@/lib/pressure";
import { GAME_MODES } from "@/lib/constants";
import Link from "next/link";

export default function PlayPage() {
  const [evaluation, setEvaluation] = useState(0);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [pressure, setPressure] = useState<PressureAnalysis>({
    complexityIndex: 0,
    pressureLevel: "LOW",
    moveIntent: ""
  });
  const [aiMessage, setAiMessage] = useState("");
  const [showPrediction, setShowPrediction] = useState(false);
  const [lastHumanMove, setLastHumanMove] = useState("");

  const handlePredictionReveal = (reveal: boolean) => {
    setShowPrediction(reveal);
  };

  const handleMoveComplete = (move: string) => {
    setLastHumanMove(move);
  };

  return (
    <div className="min-h-screen bg-[var(--cg-bg)] text-white overflow-hidden flex flex-col relative">
      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10 glass-sm rounded-none border-t-0 border-x-0 border-b border-white/5 bg-black/40">
        <Link href="/" className="font-mono text-xl font-bold tracking-widest hover:text-[var(--cg-blue)] transition-colors">
          CHESSGOD
        </Link>
        <div className="font-mono text-sm tracking-widest text-[var(--cg-text-dim)]">
          MODE: <span className="text-white text-glow-blue">{GAME_MODES.CHALLENGE_GOD.name}</span>
        </div>
        <div className="font-mono text-xs tracking-widest text-[var(--cg-crimson)] animate-pulse border border-[var(--cg-crimson)] px-3 py-1 rounded">
          LIVE
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-grow flex items-center justify-center p-6 pt-24 gap-8">
        
        {/* Left Column: AI & Pressure */}
        <div className="w-[320px] flex flex-col space-y-6 shrink-0 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--cg-blue)] blur-[150px] opacity-[0.03] pointer-events-none rounded-full" />
          
          <AIDialogue message={aiMessage} />
          
          <PressureMeter analysis={pressure} />
          
          <PredictionOverlay 
            predictions={predictions} 
            showPrediction={showPrediction}
            actualMove={lastHumanMove}
          />
        </div>

        {/* Center: Board */}
        <div className="shrink-0 animate-scale-in flex flex-col items-center z-10">
           {/* Top Player (ChessGod) */}
           <div className="w-full flex justify-between items-end mb-4 px-2">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded bg-[#101525] border border-blue-500/30 flex items-center justify-center glow-blue">
                 <span className="font-mono text-xs text-blue-400">AI</span>
               </div>
               <div>
                  <h3 className="font-mono font-bold tracking-widest text-lg">CHESSGOD</h3>
                  <p className="text-xs font-mono text-[var(--cg-text-muted)] tracking-widest uppercase">Depth: {GAME_MODES.CHALLENGE_GOD.depth}</p>
               </div>
             </div>
             <div className="text-2xl font-mono font-bold text-white/50">
               10:00
             </div>
           </div>

           <ChessGame 
             modeDepth={GAME_MODES.CHALLENGE_GOD.depth}
             onEvaluationChange={setEvaluation}
             onPredictionUpdate={setPredictions}
             onPressureUpdate={setPressure}
             onAIDialogue={setAiMessage}
             onMoveComplete={handleMoveComplete}
             onPredictionReveal={handlePredictionReveal}
           />

           {/* Bottom Player (Human) */}
           <div className="w-full flex justify-between items-start mt-4 px-2">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded bg-[#202535] border border-white/20 flex items-center justify-center">
                 <span className="font-mono text-xs text-white/50">HU</span>
               </div>
               <div>
                  <h3 className="font-mono font-bold tracking-widest text-lg">HUMANITY</h3>
                  <p className="text-xs font-mono text-[var(--cg-text-muted)] tracking-widest uppercase">Challenger</p>
               </div>
             </div>
             <div className="text-2xl font-mono font-bold">
               10:00
             </div>
           </div>
        </div>

        {/* Right Column: Eval & Notation */}
        <div className="w-24 shrink-0 flex flex-col items-center animate-slide-right h-[600px]">
           <EvalBar evaluation={evaluation} />
        </div>
      </main>

      {/* Decorative */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(15,20,35,0.8)_0%,var(--cg-bg)_100%)] -z-20" />
    </div>
  );
}
