import React from 'react';
import { playSound } from '../utils/sound';

interface MenuProps {
  onStart: () => void;
  highScore: number;
}

const Menu: React.FC<MenuProps> = ({ onStart, highScore }) => {
  const handleStart = () => {
    playSound('start');
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-dark-bg text-white p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-neon-pink opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-neon-cyan opacity-20 blur-3xl rounded-full animate-pulse delay-700"></div>

      <div className="z-10 text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black game-font tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow via-neon-pink to-neon-cyan animate-pulse">
            6-7 TAP!
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium tracking-wide">
            SEE 6 OR 7? <span className="text-neon-yellow font-bold">TAP IT.</span>
            <br />
            SEE ANYTHING ELSE? <span className="text-red-500 font-bold">DON'T.</span>
          </p>
        </div>

        <div className="py-4">
          <div className="inline-block px-6 py-3 border-2 border-gray-800 rounded-xl bg-gray-900/50 backdrop-blur-sm">
            <p className="text-gray-400 text-sm uppercase tracking-wider">High Score</p>
            <p className="text-3xl font-bold text-white">{highScore.toLocaleString()}</p>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="group relative px-10 py-5 bg-white text-black font-black text-2xl md:text-3xl rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.6)]"
        >
          <span className="relative z-10">PLAY NOW</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-md -z-10"></div>
        </button>
      </div>

      <div className="absolute bottom-6 text-gray-600 text-xs text-center max-w-md">
        Powered by Gemini AI for post-game analysis. Enable sound for best experience.
      </div>
    </div>
  );
};

export default Menu;