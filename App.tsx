import React, { useState } from 'react';
import Game from './components/Game';
import Menu from './components/Menu';
import Results from './components/Results';
import { GameState, GameStats } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [lastStats, setLastStats] = useState<GameStats | null>(null);
  
  // Initialize high score from localStorage
  const [highScore, setHighScore] = useState(() => {
    try {
      const savedScore = localStorage.getItem('6-7-tap-highscore');
      return savedScore ? parseInt(savedScore, 10) : 0;
    } catch (e) {
      console.warn('Failed to load high score:', e);
      return 0;
    }
  });

  const startGame = () => {
    setGameState(GameState.PLAYING);
  };

  const endGame = (stats: GameStats) => {
    setLastStats(stats);
    if (stats.score > highScore) {
      setHighScore(stats.score);
      try {
        localStorage.setItem('6-7-tap-highscore', stats.score.toString());
      } catch (e) {
        console.warn('Failed to save high score:', e);
      }
    }
    setGameState(GameState.GAME_OVER);
  };

  const goHome = () => {
    setGameState(GameState.MENU);
  };

  const restartGame = () => {
    setGameState(GameState.PLAYING);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      {gameState === GameState.MENU && (
        <Menu onStart={startGame} highScore={highScore} />
      )}
      {gameState === GameState.PLAYING && (
        <Game onGameOver={endGame} />
      )}
      {gameState === GameState.GAME_OVER && lastStats && (
        <Results 
          stats={lastStats} 
          onRestart={restartGame} 
          onHome={goHome} 
        />
      )}
    </div>
  );
};

export default App;