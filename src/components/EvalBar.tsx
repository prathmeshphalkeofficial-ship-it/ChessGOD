"use client";

import { useEffect, useState } from "react";

interface EvalBarProps {
  evaluation: number; // Positive is white (human), negative is black (AI)
}

export default function EvalBar({ evaluation }: EvalBarProps) {
  const [fillPercentage, setFillPercentage] = useState(50);

  useEffect(() => {
    // Eval is typically in centipawns or pawns. Using pawns.
    // Range is roughy -10 to +10, mapped to 0-100%
    const boundedEval = Math.max(-10, Math.min(10, evaluation));
    // At 0 eval, fill is 50%.
    // At +10 eval, fill is 0% (White fills from bottom to top, so "empty" means white is winning if bar is white at bottom)
    // Actually, usually White is bottom. Let's make it intuitive:
    // height % goes to black part.
    // +10 eval (white winning) => black part is 0%.
    // -10 eval (black winning) => black part is 100%.
    const percentage = 50 - (boundedEval * 5); 
    setFillPercentage(percentage);
  }, [evaluation]);

  const displayEval = evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1);

  return (
    <div className="flex flex-col items-center h-full max-h-[600px]">
      <span className="text-xs font-mono text-[var(--cg-text-dim)] mb-2">EVAL</span>
      <div 
        className="relative w-8 flex-grow rounded-full overflow-hidden bg-gray-200 glass"
        style={{
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)"
        }}
      >
        <div 
          className="absolute top-0 left-0 right-0 w-full transition-all duration-1000 ease-in-out"
          style={{ 
            height: `${fillPercentage}%`,
            background: "linear-gradient(to bottom, var(--cg-crimson), rgba(220, 38, 38, 0.5))",
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 w-full transition-all duration-1000 ease-in-out"
          style={{ 
            height: `${100 - fillPercentage}%`,
            background: "linear-gradient(to top, var(--cg-blue), rgba(59, 130, 246, 0.5))",
          }}
        />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30 z-10" />
      </div>
      <span className={`text-sm font-mono mt-2 ${evaluation > 0 ? 'text-[var(--cg-blue)] text-glow-blue' : 'text-[var(--cg-crimson)] text-glow-crimson'}`}>
        {displayEval}
      </span>
    </div>
  );
}
