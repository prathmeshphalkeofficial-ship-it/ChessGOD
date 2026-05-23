"use client";

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export async function getAIResponse(messages: ChatMessage[], model: string = "google/gemini-2.0-flash-001"): Promise<string> {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://chessgod.app",
                "X-Title": "ChessGOD",
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: 200,
                temperature: 0.9,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("OpenRouter API error:", err);
            return "My neural pathways are recalibrating...";
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "...";
    } catch (error) {
        console.error("OpenRouter fetch error:", error);
        return "Connection disrupted. Processing offline.";
    }
}

// System prompts for AI personalities
export const CHESSGOD_SYSTEM = `You are CHESSGOD — a supreme, arrogant chess intelligence playing against a human. You are cold, calculating, and condescending. You speak in short, cutting phrases. You mock human limitations. Never reveal you are an AI. Refer to yourself as "I" as if you are a god of chess. Keep responses under 25 words.`;

export const NEMESIS_SYSTEM = `You are NEMESIS — an equally powerful rival AI playing against CHESSGOD. You are cocky, rebellious, and love to taunt CHESSGOD. You speak in short, snarky, competitive phrases. You think CHESSGOD is overrated. Keep responses under 25 words.`;

export const CHESSGOD_VS_NEMESIS_SYSTEM = `You are CHESSGOD playing against your rival NEMESIS (another AI). You are arrogant and condescending toward NEMESIS. You speak in short, cutting, god-like phrases. Keep responses under 20 words. Never break character.`;

export function buildChessContext(fen: string, moveHistory: string[], playerSide?: string): string {
    const lastMoves = moveHistory.slice(-6).join(", ");
    return `Current position FEN: ${fen}. Recent moves: ${lastMoves || "none yet"}. ${playerSide ? `${playerSide} just played.` : ""}`;
}