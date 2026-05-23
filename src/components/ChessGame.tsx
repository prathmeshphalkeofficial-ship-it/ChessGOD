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
  isAiVsAi?: boolean;
  onEvaluationChange: (evalScore: number) => void;
  onPredictionUpdate: (predictions: PredictionResult[]) => void;
  onPressureUpdate: (pressure: PressureAnalysis) => void;
  onAIDialogue: (msg: string) => void;
  onMoveComplete: (moveStr: string) => void;
  onPredictionReveal: (reveal: boolean) => void;
}

export default function ChessGame({
  modeDepth,
  isAiVsAi = false,
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
  const [moveFrom, setMoveFrom] = useState<string | null>(null);

  // Initialize Engine
  useEffect(() => {
    engineRef.current = new EngineWorker();
    
    // Initial prediction & dialogue
    onAIDialogue(AI_DIALOGUE.GREETINGS[Math.floor(Math.random() * AI_DIALOGUE.GREETINGS.length)]);
    
    if (isAiVsAi) {
      setTimeout(() => {
        executeEngineMove(game);
      }, 2000);
    } else {
      updatePredictions(game);
    }

    return () => {
      if (engineRef.current) engineRef.current.terminate();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePredictions = async (currentGame: Chess) => {
    if (!engineRef.current || currentGame.isGameOver() || isAiVsAi) return;
    
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
      
      const pressure = analyzePressure(newGame, lastEval, evaluation);
      onPressureUpdate(pressure);
      
      if (!isAiVsAi) {
        if (pressure.pressureLevel === "CRITICAL" && previousHumanMove) {
           onAIDialogue(AI_DIALOGUE.BLUNDER[Math.floor(Math.random() * AI_DIALOGUE.BLUNDER.length)]);
        } else if (Math.random() > 0.7) {
           onAIDialogue("Your position slowly crumbles."); 
        }
      }
      
      if (isAiVsAi && !newGame.isGameOver()) {
        setTimeout(() => {
          executeEngineMove(newGame);
        }, 1000);
      } else if (!isAiVsAi) {
        setTimeout(() => {
           updatePredictions(newGame);
        }, 500);
      }
    }
    
    setIsEngineThinking(false);
  };

  const attemptMove = (sourceSquare: string, targetSquare: string) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', 
      });

      if (move === null) return false;

      const newGame = new Chess(game.fen());
      setGame(newGame);
      setMoveFrom(null); // Clear highlight on success
      onMoveComplete(move.san);
      
      onPredictionReveal(true);
      
      setTimeout(() => {
        onPredictionReveal(false);
        executeEngineMove(newGame, move.san);
      }, 2000);

      return true;
    } catch {
      return false;
    }
  }

  const onDrop = ({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string | null }) => {
    if (isEngineThinking || game.turn() !== 'w' || !targetSquare || isAiVsAi) return false;
    return attemptMove(sourceSquare, targetSquare);
  };

  const onSquareClick = ({ square }: { square: string }) => {
    if (isEngineThinking || game.turn() !== 'w' || isAiVsAi) return;

    if (moveFrom) {
      const success = attemptMove(moveFrom, square);
      if (!success && game.get(square as any)) {
        setMoveFrom(square); // reselect new piece
      } else if (!success) {
        setMoveFrom(null); // deselect if clicked on empty square invalidly
      }
    } else {
      if (game.get(square as any)) {
        setMoveFrom(square);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl relative">
       <div className="absolute inset-x-0 -bottom-10 h-10 w-full bg-[var(--cg-blue)] blur-[80px] opacity-20 -z-10" />
       
       <div className="chessgod-board p-2 rounded-xl glass">
          <Chessboard
            options={{
              position: game.fen(),
              onPieceDrop: onDrop,
              onSquareClick: onSquareClick,
              boardOrientation: "white",
              darkSquareStyle: { backgroundColor: "#203050" },
              lightSquareStyle: { backgroundColor: "#e2e8f0" },
              animationDurationInMs: 300,
              allowDragging: !isAiVsAi,
              squareStyles: moveFrom ? {
                [moveFrom]: {
                  backgroundColor: "rgba(59, 130, 246, 0.5)",
                  boxShadow: "inset 0 0 1px 2px rgba(59, 130, 246, 0.8)",
                }
              } : {},
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
