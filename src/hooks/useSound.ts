import { useState, useEffect, useCallback } from 'react';
import { soundEngine } from '@/lib/soundEngine';

export const useSound = () => {
  const [muted, setMuted] = useState(() => localStorage.getItem('2048-muted') === 'true');

  useEffect(() => {
    localStorage.setItem('2048-muted', String(muted));
    soundEngine.setMuted(muted);
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
    soundEngine.init();
  }, []);

  const initSound = useCallback(() => soundEngine.init(), []);

  return {
    muted, toggleMute, initSound,
    playMerge: () => soundEngine.playMerge(),
    playMove:  () => soundEngine.playMove(),
    playWin:   () => soundEngine.playWin(),
    playLose:  () => soundEngine.playLose(),
    playClick: () => soundEngine.playClick(),
  };
};