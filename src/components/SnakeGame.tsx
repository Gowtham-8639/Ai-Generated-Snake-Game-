import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, RefreshCw, Play } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setStatus('PLAYING');
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      lastDirectionRef.current = direction;
      return newSnake;
    });
  }, [direction, food, generateFood]);

  useEffect(() => {
    if (status === 'PLAYING') {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const lastDir = lastDirectionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (lastDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (lastDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (lastDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (lastDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="border-4 border-[#00ffff] p-6 bg-black/90 glitch-border flex gap-16 mb-4 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ffff] text-black px-3 py-1 text-[8px] font-bold">DATA_BUFFER</div>
        <div className="text-center">
          <p className="text-[8px] text-[#ff00ff] uppercase tracking-widest font-mono mb-2">SCORE</p>
          <p className="text-4xl font-black text-[#00ffff] glitch-text">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] text-[#ff00ff] uppercase tracking-widest font-mono mb-2">MAX_VAL</p>
          <p className="text-4xl font-black text-[#00ffff] glitch-text">{highScore}</p>
        </div>
      </div>

      <div className="relative p-2 bg-[#ff00ff] glitch-border shadow-[0_0_50px_rgba(255,0,255,0.4)]">
        <div 
          className="grid bg-[#050505] border-2 border-[#00ffff]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(85vw, 450px)',
            height: 'min(85vw, 450px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeSegmentIndex = snake.findIndex(s => s.x === x && s.y === y);
            const isSnake = snakeSegmentIndex !== -1;
            const isHead = snakeSegmentIndex === 0;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className="relative border-[1px] border-[#00ffff]/10"
              >
                {isSnake && (
                  <motion.div 
                    layoutId={`snake-${x}-${y}`}
                    className={`absolute inset-0 ${isHead ? 'bg-[#00ffff] z-10' : 'bg-[#ff00ff]'}`}
                    style={{ 
                      opacity: isHead ? 1 : Math.max(0.3, 1 - (snakeSegmentIndex / snake.length)),
                      boxShadow: isHead 
                        ? '0 0 20px #00ffff, 0 0 40px #00ffff' 
                        : `0 0 ${Math.max(2, 15 - snakeSegmentIndex)}px #ff00ff`,
                    }}
                  />
                )}
                {isFood && (
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.4, 1], 
                      opacity: [0.6, 1, 0.6],
                      rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    className="absolute inset-0 bg-[#ffff00] shadow-[0_0_20px_#ffff00]"
                  />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {status !== 'PLAYING' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20"
            >
              {status === 'IDLE' && (
                <button 
                  onClick={() => setStatus('PLAYING')}
                  className="group flex flex-col items-center gap-6 text-[#00ffff] hover:text-[#ff00ff] transition-all"
                >
                  <div className="w-24 h-24 border-4 border-[#00ffff] flex items-center justify-center group-hover:scale-110 group-hover:border-[#ff00ff] transition-all glitch-border">
                    <Play size={48} fill="currentColor" className="ml-2" />
                  </div>
                  <span className="font-mono tracking-[0.4em] uppercase text-[10px] glitch-text">INIT_PROTOCOL</span>
                </button>
              )}

              {status === 'GAME_OVER' && (
                <div className="flex flex-col items-center gap-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-black text-[#ff00ff] mb-4 glitch-text uppercase tracking-tighter">CRITICAL_FAILURE</h2>
                    <p className="text-[#00ffff] font-mono text-[10px] tracking-widest uppercase">FINAL_YIELD: {score}</p>
                  </div>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-3 px-12 py-5 bg-[#00ffff] text-black font-black uppercase tracking-[0.2em] hover:bg-[#ff00ff] transition-all glitch-border text-[12px]"
                  >
                    <RefreshCw size={24} strokeWidth={4} />
                    REBOOT_SYSTEM
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-between items-center px-4">
        <span className="text-[#ff00ff] font-black tracking-widest text-sm glitch-text">HEBI_CORE_v1</span>
        <div className="flex gap-6 text-[#00ffff]/40 text-[8px] font-mono uppercase tracking-[0.3em]">
          <span>[INPUT: ARROWS]</span>
          <span>•</span>
          <span>[TARGET: ENERGY_NODES]</span>
        </div>
      </div>
    </div>
  );
};
