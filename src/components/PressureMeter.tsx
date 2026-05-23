"use client";

import { PressureAnalysis } from "@/lib/pressure";

interface PressureMeterProps {
  analysis: PressureAnalysis;
}

export default function PressureMeter({ analysis }: PressureMeterProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "LOW": return "text-[var(--cg-blue)] bg-[var(--cg-blue)]";
      case "MODERATE": return "text-[var(--cg-gold)] bg-[var(--cg-gold)]";
      case "HIGH": return "text-orange-500 bg-orange-500";
      case "CRITICAL": return "text-[var(--cg-crimson)] bg-[var(--cg-crimson)] animate-pulse";
      default: return "text-[var(--cg-blue)] bg-[var(--cg-blue)]";
    }
  };

  const colorClass = getLevelColor(analysis.pressureLevel);
  const textColor = colorClass.split(' ')[0];

  return (
    <div className={`glass p-4 rounded-xl border-l-4 border-transparent mt-4 transition-all duration-500 ${analysis.pressureLevel === 'CRITICAL' ? 'border-[var(--cg-crimson)] glow-crimson animate-pressure-critical' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--cg-text-dim)]">Psychological Pressure</span>
        <span className={`text-xs font-bold font-mono tracking-widest ${textColor}`}>{analysis.pressureLevel}</span>
      </div>
      
      {/* Bars representation of complexity */}
       <div className="flex space-x-1 h-2 mt-1 mb-3">
          {[...Array(10)].map((_, i) => {
            const isActive = i < Math.min(10, Math.max(1, Math.ceil(analysis.complexityIndex / 40)));
            return (
              <div 
                key={i} 
                className={`flex-1 rounded-sm transition-all duration-300 ${isActive ? colorClass.split(' ')[1] : 'bg-[rgba(255,255,255,0.1)]'}`}
              />
            )
          })}
       </div>

       {analysis.moveIntent && (
         <div className="text-sm font-mono text-white/80 border-t border-white/10 pt-2 italic">
           <span className="opacity-50">Analysis: </span>
           {analysis.moveIntent}
         </div>
       )}
    </div>
  );
}
