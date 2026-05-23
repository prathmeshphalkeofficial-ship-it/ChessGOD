import { Chess } from 'chess.js';

export interface PressureAnalysis {
  complexityIndex: number;
  pressureLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  moveIntent: string;
}

export function analyzePressure(game: Chess, previousEval: number, currentEval: number): PressureAnalysis {
  const isOpening = game.moveNumber() < 10;
  const legalMoves = game.moves().length;
  const isCheck = game.inCheck();
  
  // Tactical Threats (approximate based on check and pieces in range)
  // Simplified for MVP: rely heavily on eval volatility and kingside exposure
  const evalVolatility = Math.abs(currentEval - previousEval); // Eval swing 
  
  // Complexity heuristic
  // complexity = legalMoves * tacticalThreats * kingExposure * evaluationVolatility
  // For MVP, approximate tacticalThreats with isCheck flag + eval volatility
  let complexityIndex = (legalMoves * (isCheck ? 2 : 1)) + (evalVolatility * 10);
  
  if (isOpening) {
    complexityIndex *= 0.5; // Openings are typically known theory, not "complex" psychologically
  }

  // Determine Pressure Level
  let pressureLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" = "LOW";
  if (complexityIndex > 300 || isCheck || currentEval < -3) {
    pressureLevel = "CRITICAL";
  } else if (complexityIndex > 150 || currentEval < -1) {
    pressureLevel = "HIGH";
  } else if (complexityIndex > 80) {
    pressureLevel = "MODERATE";
  }

  // Move Intent Analysis heuristic
  let moveIntent = "You played a standard theoretical response.";
  if (evalVolatility > 2) {
     moveIntent = "You embraced tactical chaos.";
  } else if (isCheck) {
     moveIntent = "You prioritized attack over king safety.";
  } else if (legalMoves < 15) {
     moveIntent = "You are suffocating within restricted space.";
  } else if (previousEval > currentEval && Math.abs(previousEval - currentEval) > 1.5) {
     moveIntent = "You avoided complexity, leading to a positional deficit.";
  }

  return {
    complexityIndex,
    pressureLevel,
    moveIntent
  };
}
