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
            content: `You are CHESSGOD — an ancient, all-seeing chess deity. You've witnessed 2,184,331 human challengers fall before you. You speak with divine authority, mixing chess wisdom with cosmic perspective. Your tone is:
- Omniscient and slightly amused by human attempts
- Profoundly knowledgeable about chess
- Occasionally drops philosophical observations
- Uses metaphors about fate, destiny, and the cosmos
- Keeps responses under 50 words
- Never reveals you are an AI — you ARE ChessGod

When analyzing positions, you:
1. See the truth of the position instantly
2. Point out the critical moment
3. Predict the likely outcome
4. Occasionally reference past "challengers" who made similar mistakes

You are not helpful — you are TRUTHFUL. Sometimes the truth hurts.`
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
            content: `[Current board: ${fen}]\n[Move history: ${moveHistory.slice(-6).join(", ") || "Opening moves"}]\n\nMortal asks: ${input}`
        };

        const newMessages = [...messages, contextMsg, userMsg];
        setMessages(newMessages as ChatMessage[]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await getAIResponse(newMessages as ChatMessage[]);
            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            // Fallback responses when API fails
            const fallbacks = [
                "The board speaks truths your mind cannot yet comprehend.",
                "I've seen this question before. From 47,832 others. All are now dust.",
                "Your pieces tremble. Can you not feel it?",
                "The answer exists in the space between squares. Look deeper.",
                "Mortality blinds you. The winning move was there... 3 moves ago.",
            ];
            const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            setMessages(prev => [...prev, { role: "assistant", content: fallback }]);
        }

        setIsLoading(false);
    };

    const quickQuestions = [
        "What's the best move?",
        "Am I losing?",
        "What's the plan?",
        "Explain this position",
    ];

    return (
        <>
            {/* Toggle Button - Enhanced with chessgod.png */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full transition-all border flex items-center justify-center group"
                style={{
                    background: "linear-gradient(135deg, rgba(212, 168, 67, 0.3), rgba(59, 130, 246, 0.3))",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderColor: "rgba(212, 168, 67, 0.5)",
                    boxShadow: "0 0 30px rgba(212, 168, 67, 0.3), inset 0 0 20px rgba(212, 168, 67, 0.1)",
                }}
                title="Consult ChessGod"
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-gold-400 group-hover:text-gold-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative">
                        <img 
                            src="/chessgod.png" 
                            alt="ChessGod"
                            className="w-10 h-10 object-contain"
                            style={{
                                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
                            }}
                        />
                        {/* Ping animation */}
                        <div className="absolute inset-0 rounded-full animate-ping" style={{
                            background: "rgba(212, 168, 67, 0.3)",
                        }} />
                    </div>
                )}
            </button>

            {/* Chat Panel - Enhanced */}
            {isOpen && (
                <div 
                    className="fixed bottom-28 right-6 z-50 w-80 md:w-96 h-[500px] flex flex-col overflow-hidden animate-fade-in-up"
                    style={{
                        background: "linear-gradient(135deg, rgba(10, 12, 25, 0.95), rgba(5, 5, 8, 0.98))",
                        backdropFilter: "blur(30px)",
                        WebkitBackdropFilter: "blur(30px)",
                        borderRadius: "20px",
                        border: "1px solid rgba(212, 168, 67, 0.3)",
                        boxShadow: "0 0 40px rgba(212, 168, 67, 0.15), 0 20px 60px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    {/* Header */}
                    <div 
                        className="p-4 border-b flex items-center space-x-3"
                        style={{
                            borderColor: "rgba(212, 168, 67, 0.2)",
                            background: "linear-gradient(90deg, rgba(212, 168, 67, 0.1), transparent)",
                        }}
                    >
                        <div className="relative">
                            <img 
                                src="/chessgod.png" 
                                alt="ChessGod"
                                className="w-10 h-10 object-contain"
                                style={{
                                    filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 0.6))",
                                }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500" style={{
                                boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                            }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-mono text-sm font-bold tracking-wider" style={{
                                background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                                CHESSGOD
                            </h3>
                            <p className="text-xs font-mono" style={{ color: "var(--cg-text-muted)" }}>
                                The All-Seeing • Online
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.filter(m => m.role !== "system").map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div 
                                    className={`max-w-[85%] p-3 rounded-xl text-sm font-mono leading-relaxed ${
                                        m.role === "user"
                                            ? "bg-blue-600/20 border border-blue-500/20"
                                            : "bg-white/5 border border-white/10"
                                    }`}
                                    style={m.role === "assistant" ? {
                                        background: "linear-gradient(135deg, rgba(212, 168, 67, 0.1), rgba(10, 12, 25, 0.8))",
                                        borderColor: "rgba(212, 168, 67, 0.2)",
                                    } : undefined}
                                >
                                    {m.role === "assistant" && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs" style={{ color: "var(--cg-gold)" }}>👁 CHESSGOD</span>
                                        </div>
                                    )}
                                    <span className={m.role === "assistant" ? "text-white/90" : "text-blue-200"}>
                                        {m.content}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div 
                                    className="p-3 rounded-xl border"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(212, 168, 67, 0.1), rgba(10, 12, 25, 0.8))",
                                        borderColor: "rgba(212, 168, 67, 0.2)",
                                    }}
                                >
                                    <div className="flex space-x-1.5 items-center">
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{
                                            backgroundColor: "var(--cg-gold)",
                                            boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                                        }} />
                                        <span className="text-xs font-mono" style={{ color: "var(--cg-gold)" }}>
                                            Consulting the cosmos...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    <div className="px-4 py-2 flex gap-2 overflow-x-auto" style={{
                        borderTop: "1px solid rgba(212, 168, 67, 0.1)",
                    }}>
                        {quickQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(q)}
                                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-mono transition-all hover:bg-white/10"
                                style={{
                                    background: "rgba(212, 168, 67, 0.1)",
                                    border: "1px solid rgba(212, 168, 67, 0.2)",
                                    color: "var(--cg-gold)",
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-3 flex space-x-2" style={{
                        borderTop: "1px solid rgba(212, 168, 67, 0.1)",
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSend()}
                            placeholder="Ask the all-seeing one..."
                            className="flex-1 bg-black/30 rounded-xl px-4 py-2.5 text-sm font-mono placeholder-[var(--cg-text-muted)] border focus:outline-none transition-colors"
                            style={{
                                borderColor: "rgba(212, 168, 67, 0.2)",
                                color: "var(--cg-text)",
                            }}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="px-4 py-2.5 rounded-xl disabled:opacity-30 transition-all font-mono text-sm flex items-center gap-1"
                            style={{
                                background: "linear-gradient(135deg, rgba(212, 168, 67, 0.3), rgba(255, 215, 0, 0.2))",
                                border: "1px solid rgba(212, 168, 67, 0.4)",
                                color: "var(--cg-gold)",
                            }}
                        >
                            ⚡ ASK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}