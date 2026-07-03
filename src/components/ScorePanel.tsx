import React, { useEffect, useState } from 'react';

export const ScorePanel: React.FC<{
  score: number;
  bestScore: number;
  scoreDelta: { id: number; value: number } | null;
}> = ({ score, bestScore, scoreDelta }) => {
  const [deltas, setDeltas] = useState<{ id: number; value: number }[]>([]);

  useEffect(() => {
    if (scoreDelta) {
      setDeltas(prev => [...prev, scoreDelta]);
      const t = setTimeout(() => {
        setDeltas(prev => prev.filter(d => d.id !== scoreDelta.id));
      }, 600);
      return () => clearTimeout(t);
    }
  }, [scoreDelta]);

  return (
    <div className="flex gap-3">
      <div className="bg-[#16213e] rounded-lg px-4 py-2 flex flex-col items-center min-w-[80px] relative">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Score</span>
        <span className="text-xl font-bold text-white">{score}</span>
        {deltas.map(d => (
          <div key={d.id} className="absolute text-primary font-bold text-lg score-pop pointer-events-none top-0">
            +{d.value}
          </div>
        ))}
      </div>
      <div className="bg-[#16213e] rounded-lg px-4 py-2 flex flex-col items-center min-w-[80px]">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Best</span>
        <span className="text-xl font-bold text-white">{bestScore}</span>
      </div>
    </div>
  );
};