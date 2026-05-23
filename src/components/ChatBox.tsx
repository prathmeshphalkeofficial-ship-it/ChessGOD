"use client";

import { useState, useRef, useEffect } from "react";
import { getAIResponse, ChatMessage, buildChessContext } from "@/lib/openrouter";

interface ChatBoxProps {
    fen: string;
    moveHistory: string[];
}

export default function ChatBox({ fen, moveHistory }: ChatBoxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "system",
            content: "You are a chess assistant helping a human understand the game. You give concise, insightful advice about positions, tactics, and strategy. You speak like a wise but slightly arrogant chess grandmaster. Keep responses under 40 words. Never reveal you are an AI — act like a living chess expert."
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: "user", content: input };
        const contextMsg: ChatMessage = {
            role: "user",
            content: `[Board position: ${fen}, Recent moves: ${moveHistory.slice(-4).join(", ") || "none"}]\n\nQuestion: ${input}`
        };

        const newMessages = [...messages, contextMsg, userMsg];
        setMessages(newMessages as ChatMessage[]);
        setInput("");
        setIsLoading(true);

        const response = await getAIResponse(newMessages as ChatMessage[]);

        setMessages(prev => [...prev, { role: "assistant", content: response }]);
        setIsLoading(false);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full glass hover:bg-blue-500/20 transition-all border border-blue-500/30 glow-blue flex items-center justify-center group"
                title="Ask ChessGod a question"
            >
                <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    )}
                </svg>
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-96 glass rounded-2xl border border-[var(--cg-glass-border)] flex flex-col overflow-hidden animate-fade-in-up shadow-2xl">
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--cg-blue)] glow-blue animate-pulse-glow" />
                        <div>
                            <h3 className="font-mono text-sm font-bold tracking-wider text-white">ChessGod Advisor</h3>
                            <p className="text-xs font-mono text-[var(--cg-text-muted)]">Ask anything about the position</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.filter(m => m.role !== "system").map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm font-mono leading-relaxed ${m.role === "user"
                                    ? "bg-blue-600/20 text-blue-200 border border-blue-500/20"
                                    : "bg-white/5 text-white/80 border border-white/10"
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-white/5 flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSend()}
                            placeholder="Ask about the position..."
                            className="flex-1 bg-black/30 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-[var(--cg-text-muted)] border border-white/5 focus:outline-none focus:border-blue-500/40 transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="px-4 py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 disabled:opacity-30 transition-all font-mono text-sm text-white border border-blue-500/30"
                        >
                            SEND
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}