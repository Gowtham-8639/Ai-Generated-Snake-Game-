import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ffff] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans">
      {/* CRT Effects */}
      <div className="crt-overlay" />
      <div className="scanline" />
      
      <header className="mb-12 text-center relative z-10 w-full max-w-4xl">
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          className="h-16 w-full bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ff00ff] rounded-none mb-6 border-y-4 border-[#00ffff] glitch-border"
        />
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-6xl font-black tracking-tighter uppercase glitch-text mb-4"
        >
          SNAKE_PROTOCOL_v2.5
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] md:text-xs font-mono tracking-[0.8em] uppercase text-[#ff00ff] mt-2 animate-pulse"
        >
          [ACCESSING_NEURAL_INTERFACE...]
        </motion.p>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
        {/* Left Sidebar - Machine Status */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-10 order-2 lg:order-1">
          <div className="p-8 border-2 border-[#00ffff] bg-black/80 glitch-border relative">
            <div className="absolute -top-3 -left-3 bg-[#00ffff] text-black px-2 py-1 text-[8px] font-bold">STATUS_LOG</div>
            <h4 className="text-[10px] font-mono text-[#ff00ff] uppercase mb-6 tracking-widest">SYSTEM_DIAGNOSTICS</h4>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-[#00ffff]/60 uppercase">CORE_FREQ</span>
                <span className="text-[10px] text-[#00ffff]">12.4 GHZ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-[#00ffff]/60 uppercase">GRID_SYNC</span>
                <span className="text-[10px] text-[#00ffff]">LOCKED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-[#00ffff]/60 uppercase">AUDIO_DRV</span>
                <span className="text-[10px] text-[#00ff00] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00ff00] animate-ping" />
                  ONLINE
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-8 border-2 border-[#ff00ff] bg-black/80 glitch-border relative">
            <div className="absolute -top-3 -right-3 bg-[#ff00ff] text-black px-2 py-1 text-[8px] font-bold">COMMANDS</div>
            <h4 className="text-[10px] font-mono text-[#00ffff] uppercase mb-6 tracking-widest">OPERATIONAL_DATA</h4>
            <p className="text-[10px] text-[#ff00ff]/80 leading-relaxed font-mono">
              INITIATE_MOVEMENT: [ARROW_KEYS]<br/>
              OBJECTIVE: [CONSUME_ENERGY_NODES]<br/>
              WARNING: [CRITICAL_FAILURE_ON_SELF_COLLISION]
            </p>
          </div>
        </div>

        {/* Center - The Protocol */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <SnakeGame />
        </div>

        {/* Right Sidebar - Audio Stream */}
        <div className="lg:col-span-3 flex flex-col gap-10 order-3">
          <div className="flex flex-col items-center lg:items-end gap-3 mb-4">
            <span className="text-[10px] font-mono text-[#ff00ff] uppercase tracking-[0.4em] glitch-text">AUDIO_STREAM_01</span>
            <div className="h-1 w-24 bg-[#ff00ff]/50" />
          </div>
          <MusicPlayer />
          
          <div className="hidden lg:block p-8 border-2 border-[#00ffff] bg-black/80 glitch-border relative">
            <div className="absolute -bottom-3 -left-3 bg-[#00ffff] text-black px-2 py-1 text-[8px] font-bold">WAVE_FORM</div>
            <h4 className="text-[10px] font-mono text-[#ff00ff] uppercase mb-6 tracking-widest">SIGNAL_MONITOR</h4>
            <div className="flex items-end gap-2 h-16">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [10, Math.random() * 60 + 10, 10] }}
                  transition={{ repeat: Infinity, duration: 0.3 + Math.random() * 0.4, ease: "linear" }}
                  className="flex-1 bg-[#ff00ff] border-t-2 border-[#00ffff]"
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-[8px] font-mono text-[#00ffff]/30 uppercase tracking-[1em] relative z-10">
        [TERMINAL_ID: 0x7F4A9B] // [ENCRYPTION: AES-256] // [STATUS: SECURE]
      </footer>
    </div>
  );
}
