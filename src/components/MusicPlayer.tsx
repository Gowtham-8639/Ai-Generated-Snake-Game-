import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const onEnded = () => {
    handleNext();
  };

  return (
    <div className="bg-black/90 border-4 border-[#ff00ff] p-8 w-full max-w-md shadow-[0_0_40px_rgba(255,0,255,0.3)] glitch-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] animate-pulse" />
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
      
      <div className="flex items-center gap-6 mb-8">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="relative w-24 h-24 border-2 border-[#00ffff] glitch-border"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover grayscale contrast-150"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-[#00ffff]/20 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Music className="text-[#ff00ff] w-8 h-8 drop-shadow-[0_0_10px_#ff00ff]" />
              </motion.div>
            </div>
          )}
        </motion.div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="text-[#00ffff] font-black text-sm truncate glitch-text uppercase tracking-tighter">
            {currentTrack.title}
          </h3>
          <p className="text-[#ff00ff] text-[8px] truncate uppercase tracking-[0.3em] font-mono mt-2">
            ID: {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative h-2 bg-[#00ffff]/10 border border-[#00ffff]/30 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#ff00ff] shadow-[0_0_15px_#ff00ff]"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={handlePrev}
            className="p-3 text-[#00ffff] hover:text-[#ff00ff] transition-colors border-2 border-transparent hover:border-[#ff00ff]"
          >
            <SkipBack size={28} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 border-4 border-[#00ffff] flex items-center justify-center text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all glitch-border"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 text-[#00ffff] hover:text-[#ff00ff] transition-colors border-2 border-transparent hover:border-[#ff00ff]"
          >
            <SkipForward size={28} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-[#ff00ff]/60">
          <Volume2 size={16} />
          <div className="h-1 flex-1 bg-[#00ffff]/10 border border-[#00ffff]/20">
            <div className="h-full w-2/3 bg-[#00ffff]/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
