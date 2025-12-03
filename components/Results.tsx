import React, { useEffect, useState } from 'react';
import { GameStats, AICommentary } from '../types';
import { generateGameFeedback } from '../services/geminiService';
import { playSound } from '../utils/sound';

interface ResultsProps {
  stats: GameStats;
  onRestart: () => void;
  onHome: () => void;
}

const Results: React.FC<ResultsProps> = ({ stats, onRestart, onHome }) => {
  const [commentary, setCommentary] = useState<AICommentary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playSound('gameover');
    
    const fetchFeedback = async () => {
      const data = await generateGameFeedback(stats);
      setCommentary(data);
      setLoading(false);
    };

    fetchFeedback();
  }, [stats]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-dark-bg p-6 text-white overflow-y-auto">
      <div className="w-full max-w-md space-y-8 animate-pop">
        
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black game-font text-white">GAME OVER</h2>
          <p className="text-gray-400 uppercase tracking-widest">Time's Up</p>
        </div>

        {/* Score Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink to-neon-cyan"></div>
            
            <div className="grid grid-cols-2 gap-6 text-center mb-6">
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Final Score</p>
                    <p className="text-4xl font-black text-neon-yellow">{stats.score.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Best Combo</p>
                    <p className="text-4xl font-black text-neon-cyan">{stats.maxCombo}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-sm border-t border-gray-800 pt-4">
                <div>
                    <p className="text-gray-500">Hits</p>
                    <p className="font-bold">{stats.hits}</p>
                </div>
                <div>
                    <p className="text-gray-500">Misses</p>
                    <p className="font-bold text-red-400">{stats.misses}</p>
                </div>
                <div>
                    <p className="text-gray-500">Acc</p>
                    <p className="font-bold">{Math.round(stats.accuracy * 100)}%</p>
                </div>
            </div>
        </div>

        {/* Feedback Section */}
        <div className="min-h-[140px] flex items-center justify-center">
            {loading ? (
                <div className="flex flex-col items-center space-y-3">
                     <div className="w-6 h-6 border-2 border-neon-pink border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-xs text-gray-500 animate-pulse">Analyzing performance...</p>
                </div>
            ) : (
                <div className="text-center space-y-2 w-full bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-neon-pink font-bold uppercase tracking-wider text-sm">
                        {commentary?.title || "Rank Unknown"}
                    </p>
                    <p className="text-gray-200 italic font-medium leading-relaxed">
                        "{commentary?.message}"
                    </p>
                </div>
            )}
        </div>

        <div className="flex gap-4 w-full">
            <button 
                onClick={onHome}
                className="flex-1 py-4 rounded-xl font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
                MENU
            </button>
            <button 
                onClick={onRestart}
                className="flex-1 py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
            >
                PLAY AGAIN
            </button>
        </div>

      </div>
    </div>
  );
};

export default Results;