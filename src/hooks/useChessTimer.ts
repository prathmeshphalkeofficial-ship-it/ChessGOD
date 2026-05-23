"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type TimerPlayer = "human" | "ai";
export type TimerStatus = "running" | "paused" | "expired" | "idle";

export interface ChessTimerState {
    humanTime: number;    // seconds remaining
    aiTime: number;       // seconds remaining
    activePlayer: TimerPlayer | null;
    status: TimerStatus;
    humanStatus: TimerStatus;
    aiStatus: TimerStatus;
}

export interface ChessTimerActions {
    start: () => void;
    pause: () => void;
    resume: () => void;
    switchTurn: () => void;
    reset: (initialSeconds?: number) => void;
    setHumanTime: (seconds: number) => void;
    setAiTime: (seconds: number) => void;
}

export function useChessTimer(initialSeconds: number = 600): [ChessTimerState, ChessTimerActions] {
    const [humanTime, setHumanTimeState] = useState(initialSeconds);
    const [aiTime, setAiTimeState] = useState(initialSeconds);
    const [activePlayer, setActivePlayer] = useState<TimerPlayer | null>(null);
    const [status, setStatus] = useState<TimerStatus>("idle");

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const activeRef = useRef<TimerPlayer | null>(null);
    const humanRef = useRef(initialSeconds);
    const aiRef = useRef(initialSeconds);

    // Keep refs in sync
    useEffect(() => { humanRef.current = humanTime; }, [humanTime]);
    useEffect(() => { aiRef.current = aiTime; }, [aiTime]);
    useEffect(() => { activeRef.current = activePlayer; }, [activePlayer]);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startInterval = useCallback(() => {
        clearTimer();
        intervalRef.current = setInterval(() => {
            if (activeRef.current === "human") {
                setHumanTimeState(prev => {
                    const next = prev - 1;
                    humanRef.current = next;
                    if (next <= 0) {
                        clearTimer();
                        setStatus("expired");
                        setActivePlayer(null);
                        activeRef.current = null;
                    }
                    return Math.max(0, next);
                });
            } else if (activeRef.current === "ai") {
                setAiTimeState(prev => {
                    const next = prev - 1;
                    aiRef.current = next;
                    if (next <= 0) {
                        clearTimer();
                        setStatus("expired");
                        setActivePlayer(null);
                        activeRef.current = null;
                    }
                    return Math.max(0, next);
                });
            }
        }, 1000);
    }, [clearTimer]);

    const start = useCallback(() => {
        setStatus("running");
        setActivePlayer("human");
        activeRef.current = "human";
        startInterval();
    }, [startInterval]);

    const pause = useCallback(() => {
        clearTimer();
        setStatus("paused");
    }, [clearTimer]);

    const resume = useCallback(() => {
        if (humanTime > 0 && aiTime > 0) {
            setStatus("running");
            startInterval();
        }
    }, [humanTime, aiTime, startInterval]);

    const switchTurn = useCallback(() => {
        setActivePlayer(prev => {
            const next = prev === "human" ? "ai" : "human";
            activeRef.current = next;
            return next;
        });
        // Restart interval with new active player
        if (status === "running") {
            clearTimer();
            startInterval();
        }
    }, [status, clearTimer, startInterval]);

    const reset = useCallback((seconds?: number) => {
        clearTimer();
        const s = seconds ?? initialSeconds;
        setHumanTimeState(s);
        setAiTimeState(s);
        setActivePlayer(null);
        activeRef.current = null;
        setStatus("idle");
        humanRef.current = s;
        aiRef.current = s;
    }, [clearTimer, initialSeconds]);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearTimer();
    }, [clearTimer]);

    const humanStatus: TimerStatus = timeStatus(humanTime, activePlayer === "human" ? status : humanTime <= 0 ? "expired" : "paused");
    const aiStatus: TimerStatus = timeStatus(aiTime, activePlayer === "ai" ? status : aiTime <= 0 ? "expired" : "paused");

    const state: ChessTimerState = {
        humanTime,
        aiTime,
        activePlayer,
        status,
        humanStatus: humanTime <= 0 ? "expired" : activePlayer === "human" ? status : "paused",
        aiStatus: aiTime <= 0 ? "expired" : activePlayer === "ai" ? status : "paused",
    };

    const actions: ChessTimerActions = {
        start,
        pause,
        resume,
        switchTurn,
        reset,
        setHumanTime: setHumanTimeState,
        setAiTime: setAiTimeState,
    };

    return [state, actions];
}

function timeStatus(time: number, currentStatus: TimerStatus): TimerStatus {
    if (time <= 0) return "expired";
    return currentStatus;
}