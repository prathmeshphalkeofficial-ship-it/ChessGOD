"use client";

import { useRef, useCallback } from "react";

export type SoundType = "move" | "capture" | "check" | "gameover" | "timerwarning" | "aiMove";

// Generate sounds using Web Audio API (no audio files needed)
export function useSoundEffects() {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const getContext = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioCtxRef.current;
    }, []);

    const playTone = useCallback((freq: number, duration: number, type: OscillatorType = "sine", volume: number = 0.15) => {
        try {
            const ctx = getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch {
            // Silently fail if audio not available
        }
    }, [getContext]);

    const playSound = useCallback((type: SoundType) => {
        switch (type) {
            case "move":
                playTone(600, 0.1, "sine", 0.1);
                break;
            case "capture":
                playTone(300, 0.15, "square", 0.1);
                break;
            case "check":
                playTone(800, 0.2, "sawtooth", 0.08);
                setTimeout(() => playTone(1000, 0.15, "sawtooth", 0.08), 200);
                break;
            case "gameover":
                playTone(400, 0.3, "sawtooth", 0.12);
                setTimeout(() => playTone(300, 0.3, "sawtooth", 0.12), 350);
                setTimeout(() => playTone(200, 0.5, "sawtooth", 0.12), 700);
                break;
            case "timerwarning":
                playTone(440, 0.08, "square", 0.06);
                break;
            case "aiMove":
                playTone(750, 0.08, "sine", 0.06);
                setTimeout(() => playTone(900, 0.06, "sine", 0.05), 100);
                break;
        }
    }, [playTone]);

    return { playSound };
}