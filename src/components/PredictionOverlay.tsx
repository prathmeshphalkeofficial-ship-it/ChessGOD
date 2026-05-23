"use client";

import { useEffect, useState } from "react";
import { PredictionResult } from "@/lib/prediction";

interface PredictionOverlayProps {
  predictions: PredictionResult[];
  showPrediction: boolean;
  actualMove?: string;
}

export default function PredictionOverlay({ predictions, showPrediction, actualMove }: PredictionOverlayProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (showPrediction) {
      setRevealed(false);
      const timer = setTimeout(() => {
        setRevealed(true);
      }, 1000); // 1s reveal delay for drama
      return () => clearTimeout(timer);
    }
  }, [showPrediction, predictions]);

  if (!showPrediction) return null;

  return (
    <div className="glass p-5 rounded-xl border-l-4 border-[var(--cg-blue)] mt-4 animate-fade-in-up w-full max-w-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--cg-blue)] blur-[40px] opacity-20" />
      
      <h3 className="text-xs uppercase tracking-widest text-[var(--cg-text-dim)] font-mono mb-3">
        Neural Prediction
      </h3>
      
      {!revealed ? (
         <div className="flex items-center space-x-3 text-[var(--cg-blue)] animate-pulse">
           <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
           <span className="font-mono text-sm">Calculating human trajectory...</span>
         </div>
      ) : (
        <div className="space-y-3 animate-prediction-reveal">
           {actualMove && (
             <div className="mb-4">
               {predictions.length > 0 && predictions[0].move === actualMove ? (
                  <div className="text-[var(--cg-cyan)] text-glow-blue font-bold font-mono">
                    Move perfectly predicted.
                  </div>
               ) : (
                  <div className="text-[var(--cg-gold)] font-mono">
                    Anomaly detected. Prediction bypassed.
                  </div>
               )}
             </div>
           )}
           {predictions.slice(0,3).map((p, i) => (
             <div key={i} className="flex flex-col space-y-1">
               <div className="flex justify-between text-sm font-mono">
                 <span>Move: <span className={actualMove === p.move ? "text-[var(--cg-cyan)]" : "text-white"}>{p.move}</span></span>
                 <span className="text-[var(--cg-blue)]">{p.probability}%</span>
               </div>
               <div className="w-full bg-[var(--cg-bg)] h-1 rounded overflow-hidden">
                 <div 
                   className="h-full bg-[var(--cg-blue)] transition-all duration-1000 ease-out glow-blue"
                   style={{ width: `${p.probability}%` }}
                 />
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
