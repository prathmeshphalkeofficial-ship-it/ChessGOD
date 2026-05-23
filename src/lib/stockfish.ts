import { Chess } from 'chess.js';

export class EngineWorker {
  private worker: Worker | null = null;
  private onMessage: ((message: string) => void) | null = null;
  private isReady = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.worker = new Worker("/stockfish/stockfish.js");
      this.worker.onmessage = (e) => {
        if (e.data === "readyok") {
          this.isReady = true;
        }
        if (this.onMessage) {
          this.onMessage(e.data);
        }
      };

      this.worker.postMessage("uci");
      this.worker.postMessage("isready");
      // Enable Multi-PV for predictions
      this.worker.postMessage("setoption name MultiPV value 3");
    }
  }

  public evaluatePosition(fen: string, depth: number = 14): Promise<{ bestMove: string; evaluation: number; lines: any[] }> {
    return new Promise((resolve) => {
      if (!this.worker) return resolve({ bestMove: "", evaluation: 0, lines: [] });

      const lines: any[] = [];
      let bestMove = "";
      let evaluation = 0;

      this.onMessage = (data) => {
        // Parse info for MultiPV
        if (data.startsWith("info depth") && data.includes("multipv")) {
          const depthMatch = data.match(/depth (\d+)/);
          const pvMatch = data.match(/multipv (\d+)/);
          const scoreMatch = data.match(/score cp (-?\d+)|score mate (-?\d+)/);
          const pvTextMatch = data.match(/ pv (.*)/);

          if (depthMatch && parseInt(depthMatch[1]) === depth && pvMatch && pvTextMatch && scoreMatch) {
            const multipv = parseInt(pvMatch[1]);
            const move = pvTextMatch[1].split(" ")[0];
            const isMate = !!scoreMatch[2];
            const score = isMate ? parseInt(scoreMatch[2]) * 1000 : parseInt(scoreMatch[1]);

            if (multipv === 1) {
             evaluation = score / 100; // in pawns
            }

            lines.push({
              rank: multipv,
              move,
              score: score / 100,
            });
          }
        } else if (data.startsWith("bestmove")) {
          bestMove = data.split(" ")[1];
          this.onMessage = null; // Clean up
          resolve({ bestMove, evaluation, lines });
        }
      };

      this.worker.postMessage("ucinewgame");
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
    }
  }
}
