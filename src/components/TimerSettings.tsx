"use client";

import { useState } from "react";

interface TimerSettingsProps {
    initialMinutes: number;
    onSave: (minutes: number) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function TimerSettings({ initialMinutes, onSave, isOpen, onClose }: TimerSettingsProps) {
    const [minutes, setMinutes] = useState(initialMinutes);

    if (!isOpen) return null;

    const presets = [1, 3, 5, 10, 15, 30, 60];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="glass p-8 rounded-2xl max-w-md w-full mx-4 border border-[var(--cg-glass-border)]" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-mono font-bold tracking-widest text-white mb-6">TIMER SETTINGS</h2>

                <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-xs font-mono tracking-widest text-[var(--cg-text-dim)] uppercase">Minutes per player</label>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setMinutes(Math.max(1, minutes - 1))}
                                className="w-10 h-10 rounded-lg glass hover:bg-blue-500/20 transition-colors flex items-center justify-center font-mono text-lg"
                            >
                                -
                            </button>
                            <span className="text-3xl font-mono font-bold text-white w-20 text-center">{minutes}</span>
                            <button
                                onClick={() => setMinutes(Math.min(120, minutes + 1))}
                                className="w-10 h-10 rounded-lg glass hover:bg-blue-500/20 transition-colors flex items-center justify-center font-mono text-lg"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {presets.map(p => (
                            <button
                                key={p}
                                onClick={() => setMinutes(p)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all ${minutes === p
                                    ? "bg-blue-500/30 text-white border border-blue-500/50"
                                    : "glass text-[var(--cg-text-dim)] border border-transparent hover:border-blue-500/30"
                                    }`}
                            >
                                {p < 60 ? `${p}m` : `${p / 60}h`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex space-x-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl glass font-mono text-sm text-[var(--cg-text-dim)] hover:text-white transition-colors border border-[var(--cg-glass-border)]"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={() => { onSave(minutes); onClose(); }}
                        className="flex-1 py-2.5 rounded-xl font-mono text-sm font-bold text-white bg-blue-600/30 hover:bg-blue-600/50 transition-colors border border-blue-500/40 glow-blue"
                    >
                        APPLY
                    </button>
                </div>
            </div>
        </div>
    );
}