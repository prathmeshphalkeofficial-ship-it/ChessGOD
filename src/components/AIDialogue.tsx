"use client";

import { useEffect, useState } from "react";

interface AIDialogueProps {
  message: string;
  speaker?: "chessgod" | "nemesis";
}

export default function AIDialogue({ message, speaker = "chessgod" }: AIDialogueProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    if (!message) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(message.substring(0, i));
      i++;
      if (i > message.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30); // Faster typewriter speed

    return () => clearInterval(interval);
  }, [message]);

  if (!message) return null;

  const isNemesis = speaker === "nemesis";
  
  // God-like styling
  const godGradient = isNemesis 
    ? "linear-gradient(135deg, rgba(212, 168, 67, 0.15), rgba(255, 215, 0, 0.05))"
    : "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.05))";
  
  const godBorder = isNemesis 
    ? "linear-gradient(135deg, rgba(212, 168, 67, 0.6), rgba(255, 215, 0, 0.3))"
    : "linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.3))";

  const godGlow = isNemesis
    ? "0 0 30px rgba(212, 168, 67, 0.2), 0 0 60px rgba(255, 215, 0, 0.1)"
    : "0 0 30px rgba(59, 130, 246, 0.2), 0 0 60px rgba(147, 51, 234, 0.1)";

  const iconGlow = isNemesis
    ? "0 0 10px rgba(212, 168, 67, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)"
    : "0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(147, 51, 234, 0.4)";

  return (
    <div
      className="relative overflow-hidden animate-slide-left transition-all duration-500"
      style={{
        background: godGradient,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "16px",
        padding: "1.25rem",
        minHeight: "100px",
        boxShadow: godGlow,
        border: "1px solid transparent",
        backgroundClip: "padding-box",
        position: "relative",
      }}
    >
      {/* Animated border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: godBorder,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Divine particle effect */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, ${isNemesis ? 'rgba(255, 215, 0, 0.15)' : 'rgba(59, 130, 246, 0.15)'} 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-start space-x-4">
        {/* Divine icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="relative">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                backgroundColor: isNemesis ? "var(--cg-gold)" : "var(--cg-blue)",
                boxShadow: iconGlow,
              }}
            />
            {/* Orbiting particle */}
            <div 
              className="absolute inset-0 animate-spin"
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "-8.5px",
                marginTop: "-8.5px",
              }}
            >
              <div 
                className="w-1 h-1 rounded-full absolute top-0 left-1/2"
                style={{
                  backgroundColor: isNemesis ? "rgba(255, 215, 0, 0.6)" : "rgba(59, 130, 246, 0.6)",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Speaker title with divine effect */}
          <div className="flex items-center space-x-2 mb-2">
            <h4 
              className="text-xs uppercase tracking-widest font-mono font-bold"
              style={{
                color: isNemesis ? "var(--cg-gold)" : "var(--cg-blue)",
                textShadow: isNemesis 
                  ? "0 0 10px rgba(255, 215, 0, 0.5)" 
                  : "0 0 10px rgba(59, 130, 246, 0.5)",
              }}
            >
              {isNemesis ? "⚡ NEMESIS" : "👁 CHESSGOD"}
            </h4>
            {isTyping && (
              <span className="text-xs text-[var(--cg-text-dim)] animate-pulse">
                speaking...
              </span>
            )}
          </div>

          {/* Message text with typewriter effect */}
          <p className="font-mono text-sm md:text-base text-white/90 leading-relaxed">
            {displayedText}
            {isTyping && (
              <span 
                className="inline-block w-2 h-4 ml-1 align-middle"
                style={{
                  background: `linear-gradient(to bottom, ${isNemesis ? 'var(--cg-gold)' : 'var(--cg-blue)'}, transparent)`,
                  animation: "pulse 0.8s ease-in-out infinite",
                }}
              />
            )}
          </p>
        </div>
      </div>

      {/* Bottom glow line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${isNemesis ? 'var(--cg-gold)' : 'var(--cg-blue)'}, transparent)`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}