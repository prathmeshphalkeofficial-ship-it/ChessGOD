"use client";

import { useState, Suspense } from "react";
import ChessGame from "@/components/ChessGame";
import EvalBar from "@/components/EvalBar";
import PredictionOverlay from "@/components/PredictionOverlay";
import PressureMeter from "@/components/PressureMeter";
import AIDialogue from "@/components/AIDialogue";
import { PredictionResult } from "@/lib/prediction";
import { PressureAnalysis } from "@/lib/pressure";
import { GAME_MODES } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PlayGameContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  
  const modeKey = modeParam === "god-vs-god" ? "GOD_VS_GOD" : "CHALLENGE_GOD";
  const gameMode = GAME_MODES[modeKey];
  const isAiVsAi = modeKey === "GOD_VS_GOD";

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
    <>
      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10 glass-sm rounded-none border-t-0 border-x-0 border-b border-white/5 bg-black/40">
        <Link href="/" className="font-mono text-xl font-bold tracking-widest hover:text-[var(--cg-blue)] transition-colors">
          CHESSGOD
        </Link>
        <div className="font-mono text-sm tracking-widest text-[var(--cg-text-dim)]">
          MODE: <span className={`text-white ${isAiVsAi ? 'text-glow-gold' : 'text-glow-blue'}`}>{gameMode.name}</span>
        </div>
        <div className="font-mono text-xs tracking-widest text-[var(--cg-crimson)] animate-pulse border border-[var(--cg-crimson)] px-3 py-1 rounded">
          LIVE
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-grow flex items-center justify-center p-6 pt-24 gap-8 w-full max-w-7xl mx-auto flex-col lg:flex-row">
        
        {/* Left Column: AI & Pressure */}
        <div className="w-full lg:w-[320px] flex flex-col space-y-6 shrink-0 relative order-2 lg:order-1">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--cg-blue)] blur-[150px] opacity-[0.03] pointer-events-none rounded-full" />
          
          <AIDialogue message={aiMessage} />
          
          <PressureMeter analysis={pressure} />
          
          {!isAiVsAi && (
            <PredictionOverlay 
              predictions={predictions} 
              showPrediction={showPrediction}
              actualMove={lastHumanMove}
            />
          )}
        </div>

        {/* Center: Board */}
        <div className="shrink-0 animate-scale-in flex flex-col items-center z-10 order-1 lg:order-2 w-full max-w-2xl">
           {/* Top Player (ChessGod) */}
           <div className="w-full flex justify-between items-end mb-4 px-2">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded bg-[#101525] border border-blue-500/30 flex items-center justify-center glow-blue">
                 <span className="font-mono text-xs text-blue-400">AI</span>
               </div>
               <div>
                  <h3 className="font-mono font-bold tracking-widest text-lg">CHESSGOD</h3>
                  <p className="text-xs font-mono text-[var(--cg-text-muted)] tracking-widest uppercase">Depth: {gameMode.depth}</p>
               </div>
             </div>
             <div className="text-2xl font-mono font-bold text-white/50">
               10:00
             </div>
           </div>

           <ChessGame 
             modeDepth={gameMode.depth}
             isAiVsAi={isAiVsAi}
             onEvaluationChange={setEvaluation}
             onPredictionUpdate={setPredictions}
             onPressureUpdate={setPressure}
             onAIDialogue={setAiMessage}
             onMoveComplete={handleMoveComplete}
             onPredictionReveal={handlePredictionReveal}
           />

           {/* Bottom Player */}
           <div className="w-full flex justify-between items-start mt-4 px-2">
             <div className="flex items-center space-x-3">
               <div className={isAiVsAi ? "w-10 h-10 rounded bg-[#201505] border border-yellow-500/30 flex items-center justify-center glow-gold" : "w-10 h-10 rounded bg-[#202535] border border-white/20 flex items-center justify-center"}>
                 <span className={`font-mono text-xs ${isAiVsAi ? 'text-yellow-400' : 'text-white/50'}`}>{isAiVsAi ? 'AI' : 'HU'}</span>
               </div>
               <div>
                  <h3 className="font-mono font-bold tracking-widest text-lg">{isAiVsAi ? 'NEMESIS' : 'HUMANITY'}</h3>
                  <p className="text-xs font-mono text-[var(--cg-text-muted)] tracking-widest uppercase">Challenger</p>
               </div>
             </div>
             <div className="text-2xl font-mono font-bold">
               10:00
             </div>
           </div>
        </div>

        {/* Right Column: Eval & Notation */}
        <div className="w-full lg:w-24 shrink-0 flex flex-col items-center animate-slide-right lg:h-[600px] order-3">
           <EvalBar evaluation={evaluation} />
        </div>
      </main>

      {/* Decorative */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(15,20,35,0.8)_0%,var(--cg-bg)_100%)] -z-20" />
    </>
  );
}

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-[var(--cg-bg)] text-white overflow-hidden flex flex-col relative">
      <Suspense fallback={<div className="h-screen flex items-center justify-center font-mono">LOADING NEURAL PATHWAYS...</div>}>
        <PlayGameContent />
      </Suspense>
    </div>
  );
}
