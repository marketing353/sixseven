import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStats, NumberItem } from '../types';
import { playSound } from '../utils/sound';

interface GameProps {
  onGameOver: (stats: GameStats) => void;
}

const GAME_DURATION = 30; // seconds
const INITIAL_INTERVAL = 1000;
const MIN_INTERVAL = 350; // Cap speed at 350ms

const Game: React.FC<GameProps> = ({ onGameOver }) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentNumber, setCurrentNumber] = useState<NumberItem | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; color: string; id: number } | null>(null);
  const [isShake, setIsShake] = useState(false);

  // Refs for mutable state inside interval/timeouts to avoid closure staleness
  const gameStateRef = useRef({
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    isPlaying: true,
    hasClickedCurrent: false,
    intervalMs: INITIAL_INTERVAL,
    targetProbability: 0.5 // Start with 50% chance of targets, decreases over time
  });

  // Generate a random number with dynamic probability
  const generateNumber = useCallback(() => {
    const state = gameStateRef.current;
    const isTarget = Math.random() < state.targetProbability;
    
    let val: number;
    
    if (isTarget) {
      val = Math.random() < 0.5 ? 6 : 7;
    } else {
      // Generate non-6/7 number (0-9)
      do {
        val = Math.floor(Math.random() * 10);
      } while (val === 6 || val === 7);
    }

    return {
      value: val,
      id: Date.now(),
      isTarget
    };
  }, []);

  const triggerFeedback = (text: string, color: string) => {
    setFeedback({ text, color, id: Date.now() });
    // Auto clear feedback after short time
    setTimeout(() => setFeedback(null), 500);
  };

  const handleTap = () => {
    const state = gameStateRef.current;
    if (!state.isPlaying || !currentNumber || state.hasClickedCurrent) return;

    state.hasClickedCurrent = true;

    if (currentNumber.isTarget) {
      // HIT
      playSound('hit');
      
      // Haptic feedback: Stronger vibration for hit
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(100);
      }

      const comboMultiplier = Math.min(Math.floor(state.combo / 5) + 1, 5); // Cap multiplier at 5x
      const points = 100 * comboMultiplier;
      
      state.score += points;
      state.combo += 1;
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      state.hits += 1;
      
      setScore(state.score);
      setCombo(state.combo);
      triggerFeedback(state.combo > 1 ? `${state.combo}x COMBO!` : 'PERFECT!', 'text-neon-yellow');
      
      // Speed up slightly on hit (rewarding speed)
      state.intervalMs = Math.max(MIN_INTERVAL, state.intervalMs - 15);

    } else {
      // MISS (Tapped wrong number)
      playSound('miss');

      // Haptic feedback: Short, sharp vibration for miss
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }

      state.score = Math.max(0, state.score - 50);
      state.combo = 0;
      state.misses += 1;
      
      setScore(state.score);
      setCombo(0);
      setIsShake(true);
      setTimeout(() => setIsShake(false), 300);
      triggerFeedback('OOPS!', 'text-red-500');
    }
  };

  // Game Loop
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    let gameLoopId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!gameStateRef.current.isPlaying) return;

      const state = gameStateRef.current;

      // Logic for previous number (if missed a target)
      if (currentNumber && currentNumber.isTarget && !state.hasClickedCurrent) {
        if (state.combo > 0) {
           triggerFeedback('MISSED!', 'text-gray-400');
           state.combo = 0;
           setCombo(0);
        }
      }

      // Progressive Difficulty:
      // 1. Gradually increase speed every tick (compounding)
      state.intervalMs = Math.max(MIN_INTERVAL, state.intervalMs * 0.98);

      // 2. Gradually decrease target probability (more noise numbers appear)
      // Decays from 0.5 down to 0.3 over time
      state.targetProbability = Math.max(0.3, state.targetProbability - 0.005);

      // Spawn new number
      const nextNum = generateNumber();
      setCurrentNumber(nextNum);
      state.hasClickedCurrent = false;

      // Schedule next tick
      gameLoopId = setTimeout(tick, state.intervalMs);
    };

    // Start Timer
    timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          gameStateRef.current.isPlaying = false;
          clearInterval(timerId);
          clearTimeout(gameLoopId);
          
          const totalActions = gameStateRef.current.hits + gameStateRef.current.misses;
          const accuracy = totalActions > 0 ? gameStateRef.current.hits / totalActions : 0;

          onGameOver({
            score: gameStateRef.current.score,
            maxCombo: gameStateRef.current.maxCombo,
            hits: gameStateRef.current.hits,
            misses: gameStateRef.current.misses,
            accuracy
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Initial tick
    tick();

    return () => {
      clearInterval(timerId);
      clearTimeout(gameLoopId);
    };
  }, [generateNumber, onGameOver]); // Minimal dependencies

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center justify-between bg-dark-bg p-6 touch-manipulation cursor-pointer select-none ${isShake ? 'animate-shake' : ''}`}
      onMouseDown={handleTap}
      onTouchStart={handleTap} // Better mobile response
    >
      {/* HUD */}
      <div className="w-full flex justify-between items-start z-10 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-bold tracking-widest">SCORE</span>
          <span className="text-3xl text-white font-black game-font">{score.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center">
             <div className="text-4xl font-black text-white">{timeLeft}</div>
             <div className="text-xs text-gray-500 uppercase">Seconds</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-sm font-bold tracking-widest">COMBO</span>
          <span className={`text-3xl font-black game-font ${combo > 5 ? 'text-neon-pink animate-pulse' : 'text-neon-cyan'}`}>
            x{combo}
          </span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex items-center justify-center relative w-full pointer-events-none">
        {/* Background pulses based on combo */}
        <div 
            className={`absolute rounded-full filter blur-3xl transition-all duration-300 opacity-20
            ${combo > 5 ? 'bg-neon-pink w-80 h-80' : 'bg-neon-cyan w-40 h-40'}`}
        />

        {currentNumber && (
            <div 
                key={currentNumber.id} // Key change forces animation reset
                className={`relative z-20 text-[12rem] md:text-[16rem] leading-none font-black game-font animate-pop
                ${currentNumber.value === 6 || currentNumber.value === 7 ? 'text-neon-yellow drop-shadow-[0_0_35px_rgba(235,255,0,0.5)]' : 'text-white/80'}`}
            >
                {currentNumber.value}
            </div>
        )}

        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-32 z-30 text-4xl font-black italic ${feedback.color} animate-pop`}>
            {feedback.text}
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="text-gray-500 text-sm uppercase tracking-widest pb-8 pointer-events-none">
        Tap screen for <span className="text-neon-yellow">6</span> or <span className="text-neon-yellow">7</span>
      </div>
    </div>
  );
};

export default Game;