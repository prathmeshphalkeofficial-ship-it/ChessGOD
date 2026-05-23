"use client";

import { useEffect, useState } from "react";

export default function AnimatedChessGrid() {
  const [activeSquares, setActiveSquares] = useState<number[]>([]);

  useEffect(() => {
    // Periodically activate random squares
    const interval = setInterval(() => {
      const numToActivate = Math.floor(Math.random() * 3) + 1; // 1 to 3 squares
      const newActive = [];
      for (let i = 0; i < numToActivate; i++) {
        newActive.push(Math.floor(Math.random() * 64));
      }
      setActiveSquares(newActive);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none perspective-[1000px]">
      <div
        className="grid grid-cols-8 grid-rows-8 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px]"
        style={{
          transform: "rotateX(60deg) rotateZ(-45deg) scale(1.5)",
          transformStyle: "preserve-3d",
        }}
      >
        {Array.from({ length: 64 }).map((_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isDark = (row + col) % 2 === 1;
          const isActive = activeSquares.includes(i);

          return (
            <div
              key={i}
              className={`border border-[rgba(59,130,246,0.1)] transition-all duration-1000 ease-in-out ${
                isDark ? "bg-[rgba(10,10,15,0.8)]" : "bg-[rgba(20,20,30,0.5)]"
              } ${isActive ? "shadow-[0_0_30px_rgba(59,130,246,0.6)] bg-[rgba(59,130,246,0.2)]" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
}
