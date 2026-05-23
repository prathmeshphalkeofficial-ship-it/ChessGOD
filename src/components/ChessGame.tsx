"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import { EngineWorker } from "@/lib/stockfish";
import { PredictionResult, calculatePredictions } from "@/lib/prediction";
import { PressureAnalysis, analyzePressure } from "@/lib/pressure";
import { AI_DIALOGUE } from "@/lib/constants";

interface ChessGameProps {
  modeDepth: number;
  onEvaluationChange: (evalScore: number) => void;
  onPredictionUpdate: (predictions: PredictionResult[]) => void;
  onPressureUpdate: (pressure: PressureAnalysis) => void;
  onAIDialogue: (msg: string) => void;
  onMoveComplete: (moveStr: string) => void;
  onPredictionReveal: (reveal: boolean) => void;
}

export default function ChessGame({
  modeDepth,
  onEvaluationChange,
  onPredictionUpdate,
  onPressureUpdate,
  onAIDialogue,
  onMoveComplete,
  onPredictionReveal,
}: ChessGameProps) {
  const [game, setGame] = useState(new Chess());
  const engineRef = useRef<EngineWorker | null>(null);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [lastEval, setLastEval] = useState(0);

  // Initialize Engine
  useEffect(() => {
    engineRef.current = new EngineWorker();
    
    // Initial prediction & dialogue
    onAIDialogue(AI_DIALOGUE.GREETINGS[Math.floor(Math.random() * AI_DIALOGUE.GREETINGS.length)]);
    updatePredictions(game);

    return () => {
      if (engineRef.current) engineRef.current.terminate();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePredictions = async (currentGame: Chess) => {
    if (!engineRef.current || currentGame.isGameOver()) return;
    
    // Analyze from Human's point of view to see what they might do
    // We only predict when it's white's turn (assuming human is always white for MVP)
    if (currentGame.turn() === 'w') {
      const { lines } = await engineRef.current.evaluatePosition(currentGame.fen(), 10);
      const isOpening = currentGame.moveNumber() < 10;
      const predictions = calculatePredictions(lines, currentGame.fen(), isOpening);
      onPredictionUpdate(predictions);
    }
  };

  const executeEngineMove = async (currentGame: Chess, previousHumanMove?: string) => {
    if (!engineRef.current || currentGame.isGameOver()) return;
    
    setIsEngineThinking(true);
    
    const { bestMove, evaluation } = await engineRef.current.evaluatePosition(currentGame.fen(), modeDepth);
    
    if (bestMove) {
      const move = currentGame.move(bestMove);
      const newGame = new Chess(currentGame.fen());
      setGame(newGame);
      setLastEval(evaluation);
      onEvaluationChange(evaluation);
      
      // Analyze pressure after AI move
      const pressure = analyzePressure(newGame, lastEval, evaluation);
      onPressureUpdate(pressure);
      
      // Trigger Dialogue heuristics
      if (pressure.pressureLevel === "CRITICAL" && previousHumanMove) {
         onAIDialogue(AI_DIALOGUE.BLUNDER[Math.floor(Math.random() * AI_DIALOGUE.BLUNDER.length)]);
      } else if (Math.random() > 0.7) {
         // Random occasional taunt
         onAIDialogue("Your position slowly crumbles."); 
      }
      
      // Then prepare predictions for human's next move
      setTimeout(() => {
         updatePredictions(newGame);
      }, 500);
    }
    
    setIsEngineThinking(false);
  };

  const onDrop = ({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string | null }) => {
    if (isEngineThinking || game.turn() !== 'w' || !targetSquare) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', 
      });

      if (move === null) return false;

      const newGame = new Chess(game.fen());
      setGame(newGame);
      onMoveComplete(move.san);
      
      // Reveal predictions right as human moves
      onPredictionReveal(true);
      
      setTimeout(() => {
        onPredictionReveal(false);
        executeEngineMove(newGame, move.san);
      }, 2000); // 2 second delay for drama before AI moves

      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="w-full max-w-2xl relative">
       {/* Decorative glow behind board */}
       <div className="absolute inset-x-0 -bottom-10 h-10 w-full bg-[var(--cg-blue)] blur-[80px] opacity-20 -z-10" />
       
       <div className="chessgod-board p-2 rounded-xl glass">
          <Chessboard
            options={{
              position: game.fen(),
              onPieceDrop: onDrop,
              boardOrientation: "white",
              darkSquareStyle: { backgroundColor: "#203050" },
              lightSquareStyle: { backgroundColor: "#e2e8f0" },
              animationDurationInMs: 300,
              boardStyle: {
                borderRadius: "4px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }
            }}
          />
       </div>
    </div>
  );
}
