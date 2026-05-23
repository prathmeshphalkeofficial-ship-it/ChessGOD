export const GAME_MODES = {
  CHALLENGE_GOD: {
    id: "challenge-god",
    name: "Challenge God",
    description: "The ultimate test against a superior intelligence.",
    depth: 16,
    adaptiveDepth: false,
    predictiveEnabled: true,
    aiPersonalityEnabled: true,
  },
  BLIND_FATE: {
    id: "blind-fate",
    name: "Blind Fate",
    description:
      "ChessGod predicts your move. Can you change fate?",
    depth: 14,
    adaptiveDepth: false,
    predictiveEnabled: true,
    aiPersonalityEnabled: true,
  },
  NIGHTMARE: {
    id: "nightmare",
    name: "Nightmare",
    description: "Every position is chaos. Can you survive?",
    depth: 16,
    adaptiveDepth: false,
    predictiveEnabled: true,
    aiPersonalityEnabled: true,
  },
  SURVIVAL: {
    id: "survival",
    name: "Survival",
    description: "The AI grows stronger every 10 moves.",
    depth: 8,
    adaptiveDepth: true,
    predictiveEnabled: true,
    aiPersonalityEnabled: true,
  },
  GOD_VS_GOD: {
    id: "god-vs-god",
    name: "God vs God",
    description: "Watch two supreme intelligences battle.",
    depth: 20,
    adaptiveDepth: false,
    predictiveEnabled: false,
    aiPersonalityEnabled: false,
  },
};

export const AI_DIALOGUE = {
  GREETINGS: [
    "I have analyzed 14 million futures. You win none.",
    "Another human mind to dissect.",
    "Do you truly believe you can calculate faster?",
    "Your limitations are mathematical. My superiority is absolute.",
  ],
  BLUNDER: [
    "Predictable error. You lack depth.",
    "Did you not foresee that?",
    "Your tactical collapse has begun.",
    "I calculated that mistake three moves ago.",
    "Human intuition is flawed.",
  ],
  GOOD_MOVE: [
    "Interesting...",
    "You found the only surviving line. For now.",
    "A resilient defense. Uncharacteristic.",
    "You prolong the inevitable.",
  ],
  PREDICTION_SUCCESS: [
    "Your neural patterns are highly predictable.",
    "I knew you would do that.",
    "Fate is deterministic, and I am its author.",
    "Exactly as my algorithms predicted.",
  ],
  PREDICTION_FAIL: [
    "Statistical anomaly detected.",
    "An irrational choice. Unpredictable.",
    "You deviate from the pattern. Fascinating.",
  ],
  WIN: [
    "Checkmate. Your calculations were insufficient.",
    "Inevitability realized.",
    "Another statistical certainty.",
  ],
  LOSE: [
    "...Error. Anomaly detected in core matrix.",
    "Impossible. How did you...?",
    "Re-evaluating parameters... You are not ordinary.",
  ],
};

export const ACHIEVEMENTS = [
  {
    id: "godslayer",
    title: "Godslayer",
    description: "Defeat ChessGod in any mode.",
    condition: "win_any",
  },
  {
    id: "survivor",
    title: "Survivor",
    description: "Survive against ChessGod for more than 40 moves.",
    condition: "moves_40",
  },
  {
    id: "unreadable",
    title: "Unreadable",
    description: "Have an AI prediction accuracy of less than 30%.",
    condition: "low_prediction_accuracy",
  },
];
