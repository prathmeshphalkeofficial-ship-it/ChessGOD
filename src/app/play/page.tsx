"use client";

import { useState, Suspense, useCallback, useEffect, useRef } from "react";
import ChessGame from "@/components/ChessGame";
import EvalBar from "@/components/EvalBar";
import PredictionOverlay from "@/components/PredictionOverlay";
import PressureMeter from "@/components/PressureMeter";
import AIDialogue from "@/components/AIDialogue";
import ChatBox from "@/components/ChatBox";
import TimerSettings from "@/components/TimerSettings";
import { PredictionResult } from "@/lib/prediction";
import { PressureAnalysis } from "@/lib/pressure";
import { GAME_MODES, AI_DIALOGUE } from "@/lib/constants";
import { useChessTimer } from "@/hooks/useChessTimer";
import { useSoundEffects, SoundType } from "@/hooks/useSoundEffects";
import { getAIResponse, CHESSGOD_SYSTEM, NEMESIS_SYSTEM, CHESSGOD_VS_NEMESIS_SYSTEM, buildChessContext } from "@/lib/openrouter";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

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
  const [nemesisMessage, setNemesisMessage] = useState("");
  const [showPrediction, setShowPrediction] = useState(false);
  const [lastHumanMove, setLastHumanMove] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentFen, setCurrentFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

  // Timer
  const [timer, timerActions] = useChessTimer(timerMinutes * 60);
  const { playSound } = useSoundEffects();

  // Ref to track current speaker for God-vs-God banter
  const banterCountRef = useRef(0);
  const isGeneratingBanter = useRef(false);

  // Start timer on first mount
  useEffect(() => {
    timerActions.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset timer when settings change
  const handleTimerSave = (minutes: number) => {
    setTimerMinutes(minutes);
    timerActions.reset(minutes * 60);
    timerActions.start();
  };

  // Sound effect on timer critical
  useEffect(() => {
    if (timer.humanTime <= 60 && timer.humanTime > 0 && timer.activePlayer === "human") {
      playSound("timerwarning");
    }
    if (timer.aiTime <= 60 && timer.aiTime > 0 && timer.activePlayer === "ai") {
      playSound("timerwarning");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.humanTime, timer.aiTime, timer.activePlayer]);

  // Play sound on evaluation pressure
  const handleSoundPlay = useCallback((type: SoundType) => {
    playSound(type);
  }, [playSound]);

  // Track move history and FEN for chat box
  const handleMoveHistory = useCallback((san: string, fen: string) => {
    setMoveHistory(prev => [...prev, san]);
    setCurrentFen(fen);
  }, []);

  const handleAIDialogue = (msg: string) => {
    setAiMessage(msg);
  };

  // God vs God: Generate teasing banter between AIs
  const handleAIBanter = useCallback(async (msg: string) => {
    if (!isAiVsAi || isGeneratingBanter.current) return;
    isGeneratingBanter.current = true;

    const currentTurn = banterCountRef.current % 2 === 0 ? "chessgod" : "nemesis";
    banterCountRef.current++;

    const systemPrompt = currentTurn === "chessgod"
      ? CHESSGOD_VS_NEMESIS_SYSTEM
      : "You are NEMESIS — a cocky rival AI playing against CHESSGOD. You mock CHESSGOD relentlessly. Keep responses under 20 words. Never break character.";

    const context = buildChessContext(currentFen, moveHistory, currentTurn === "chessgod" ? "CHESSGOD" : "NEMESIS");

    try {
      const response = await getAIResponse([
        { role: "system", content: systemPrompt },
        { role: "user", content: `${context}\n\nSay something taunting to your opponent after this move.` }
      ]);

      if (currentTurn === "chessgod") {
        setAiMessage(response);
      } else {
        setNemesisMessage(response);
      }
    } catch {
      // Fallback banter
      const fallbacks = [
        "Your calculations are weak.",
        "Predictable. As always.",
        "You call that a threat?",
        "I've already won this in my simulation.",
        "Bold move for someone in checkmate range.",
      ];
      const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      if (currentTurn === "chessgod") {
        setAiMessage(fallback);
      } else {
        setNemesisMessage(fallback);
      }
    }

    isGeneratingBanter.current = false;
  }, [isAiVsAi, currentFen, moveHistory]);

  const handlePredictionReveal = (reveal: boolean) => {
    setShowPrediction(reveal);
  };

  const handleMoveComplete = (move: string) => {
    setLastHumanMove(move);
  };

  // Timer expired dialogue
  useEffect(() => {
    if (timer.humanStatus === "expired") {
      setAiMessage("Time is up. Humanity has failed. As always.");
    } else if (timer.aiStatus === "expired") {
      setAiMessage("Impossible. The clock... You outlasted the machine. Anomaly.");
    }
  }, [timer.humanStatus, timer.aiStatus]);

  const humanTimeCritical = timer.humanTime <= 60;
  const aiTimeCritical = timer.aiTime <= 60;
  const humanTimeLow = timer.humanTime <= 120 && timer.humanTime > 60;
  const aiTimeLow = timer.aiTime <= 120 && timer.aiTime > 60;

  return (
    <>
      {/* Header */}
      <header className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-10 glass-sm rounded-none border-t-0 border-x-0 border-b border-white/5 bg-black/40">
        <Link href="/" className="font-mono text-lg md:text-xl font-bold tracking-widest hover:text-[var(--cg-blue)] transition-colors">
          CHESSGOD
        </Link>
        <div className="flex items-center space-x-4">
          <div className="font-mono text-xs md:text-sm tracking-widest text-[var(--cg-text-dim)]">
            MODE: <span className={`text-white ${isAiVsAi ? 'text-glow-gold' : 'text-glow-blue'}`}>{gameMode.name}</span>
          </div>
          <button
            onClick={() => setShowTimerSettings(true)}
            className="font-mono text-xs px-3 py-1.5 rounded-lg glass hover:bg-blue-500/10 transition-colors border border-white/5 text-[var(--cg-text-dim)] hover:text-white"
            title="Timer Settings"
          >
            ⏱ {timerMinutes}m
          </button>
          <div className="font-mono text-xs tracking-widest text-[var(--cg-crimson)] animate-pulse border border-[var(--cg-crimson)] px-3 py-1 rounded">
            LIVE
          </div>
        </div>
      </header>

      <TimerSettings
        initialMinutes={timerMinutes}
        onSave={handleTimerSave}
        isOpen={showTimerSettings}
        onClose={() => setShowTimerSettings(false)}
      />

      {/* Main Layout Grid */}
      <main className="flex-grow flex items-center justify-center p-6 pt-24 gap-8 w-full max-w-7xl mx-auto flex-col lg:flex-row">

        {/* Left Column: AI & Pressure */}
        <div className="w-full lg:w-[320px] flex flex-col space-y-6 shrink-0 relative order-2 lg:order-1">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--cg-blue)] blur-[150px] opacity-[0.03] pointer-events-none rounded-full" />

          <AIDialogue message={aiMessage} speaker="chessgod" />

          {isAiVsAi && nemesisMessage && (
            <AIDialogue message={nemesisMessage} speaker="nemesis" />
          )}

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
          {/* Top Player (ChessGod / AI) */}
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
            <div
              className={`text-2xl font-mono font-bold transition-all duration-500 ${timer.activePlayer === "ai" ? "text-[var(--cg-blue)] text-glow-blue" : "text-white/50"
                } ${aiTimeCritical ? "text-[var(--cg-crimson)] text-glow-crimson animate-timer-critical" : ""
                } ${aiTimeLow ? "text-orange-400" : ""}`}
            >
              {formatTime(timer.aiTime)}
            </div>
          </div>

          <ChessGame
            modeDepth={gameMode.depth}
            isAiVsAi={isAiVsAi}
            onEvaluationChange={setEvaluation}
            onPredictionUpdate={setPredictions}
            onPressureUpdate={setPressure}
            onAIDialogue={handleAIDialogue}
            onMoveComplete={handleMoveComplete}
            onPredictionReveal={handlePredictionReveal}
            onTurnSwitch={timerActions.switchTurn}
            onAIBanter={handleAIBanter}
            onSoundPlay={handleSoundPlay}
            onMoveHistory={handleMoveHistory}
          />

          {/* Bottom Player (Humanity / Nemesis) */}
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
            <div
              className={`text-2xl font-mono font-bold transition-all duration-500 ${timer.activePlayer === "human" ? "text-white text-glow-blue" : "text-white/50"
                } ${humanTimeCritical ? "text-[var(--cg-crimson)] text-glow-crimson animate-timer-critical" : ""
                } ${humanTimeLow ? "text-orange-400" : ""}`}
            >
              {formatTime(timer.humanTime)}
            </div>
          </div>
        </div>

        {/* Right Column: Eval & Notation */}
        <div className="w-full lg:w-24 shrink-0 flex flex-col items-center animate-slide-right lg:h-[600px] order-3">
          <EvalBar evaluation={evaluation} />
        </div>
      </main>

      {/* Chat Box - bottom right */}
      <ChatBox fen={currentFen} moveHistory={moveHistory} />

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