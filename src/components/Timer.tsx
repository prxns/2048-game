import React, { useEffect, useState } from 'react';

const TOTAL_TIME = 180;

export const Timer: React.FC<{
  hasStarted: boolean;
  isPaused: boolean;
  onExpire: () => void;
  resetId: number;
}> = ({ hasStarted, isPaused, onExpire, resetId }) => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  useEffect(() => { setTimeLeft(TOTAL_TIME); }, [resetId]);

  useEffect(() => {
    if (!hasStarted || isPaused || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [hasStarted, isPaused, timeLeft, onExpire]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isWarning = timeLeft > 0 && timeLeft <= 30;

  return (
    <div className={`text-4xl font-mono font-bold tracking-widest text-center mt-4 ${isWarning ? 'pulse-red' : 'text-foreground'}`}>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
};