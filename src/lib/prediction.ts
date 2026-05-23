export interface PredictionResult {
  move: string;
  probability: number;
}

export function calculatePredictions(lines: any[], fen: string, isOpeningStage: boolean): PredictionResult[] {
  if (!lines || lines.length === 0) return [];

  // Sort by engine evaluation (best moves first)
  const sortedLines = [...lines].sort((a, b) => b.score - a.score);
  
  // Base weights: higher rank in MultiPV means statistically more likely for *engines*.
  // For *humans*, we adjust based on tactical traps (blunders) and opening theory.
  let totalWeight = 0;
  const weightedMoves = sortedLines.map((line, index) => {
    // 1. Base probability: Humans usually play one of the top 3 moves.
    // Rank 1: 50%, Rank 2: 30%, Rank 3: 15%, etc.
    let weight = Math.max(10 - index * 3, 1);

    // 2. Tactical heuristic (creating the "ChessGOD" feeling)
    // If a move is slightly worse objectively but creates huge complications or captures a piece,
    // humans are very tempted to play it.
    // E.g., taking an unprotected pawn or executing a perceived threat.
    if (line.move.includes('x') || line.move.includes('+')) {
       weight *= 1.5; // Humans LOVE checks and captures
    }

    // 3. Opening bias
    if (isOpeningStage) {
      if (line.move === 'e2e4' || line.move === 'd2d4' || line.move === 'e7e5' || line.move === 'g8f6') {
        weight *= 2.0; // Highly common moves
      }
    }

    totalWeight += weight;
    return { move: line.move, weight };
  });

  return weightedMoves.map(m => ({
    move: m.move,
    probability: Math.round((m.weight / totalWeight) * 100)
  })).sort((a, b) => b.probability - a.probability);
}
