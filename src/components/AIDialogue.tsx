"use client";

import { useEffect, useState } from "react";

interface AIDialogueProps {
  message: string;
}

export default function AIDialogue({ message }: AIDialogueProps) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    setDisplayedText("");
    if (!message) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(message.substring(0, i));
      i++;
      if (i > message.length) {
        clearInterval(interval);
      }
    }, 40); // Typewriter speed

    return () => clearInterval(interval);
  }, [message]);

  if (!message) return null;

  return (
    <div className="glass p-5 rounded-xl border-l-4 border-[var(--cg-gold)] relative overflow-hidden animate-slide-left min-h-[100px]">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--cg-gold)] blur-[50px] opacity-10 pointer-events-none" />
      <div className="flex items-start space-x-3">
        <div className="mt-1">
          <div className="w-2 h-2 rounded-full bg-[var(--cg-gold)] glow-gold animate-pulse-glow" />
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[var(--cg-text-dim)] font-mono mb-2">
            ChessGod
          </h4>
          <p className="font-mono text-sm md:text-base text-white/90 leading-relaxed">
            {displayedText}
            <span className="inline-block w-2.5 h-4 ml-1 bg-white/70 animate-pulse" />
          </p>
        </div>
      </div>
    </div>
  );
}
