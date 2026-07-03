import React, { useEffect, useState } from 'react';
import { TileData } from '@/lib/gameLogic';

const getTileColor = (value: number) => {
  switch (value) {
    case 2:    return 'bg-[#eee4da] text-[#1a1a2e]';
    case 4:    return 'bg-[#e2d5c3] text-[#1a1a2e]';
    case 8:    return 'bg-[#f2b179] text-white';
    case 16:   return 'bg-[#f59563] text-white';
    case 32:   return 'bg-[#f67c5f] text-white';
    case 64:   return 'bg-[#f65e3b] text-white';
    case 128:  return 'bg-[#4ca1af] text-white text-glow';
    case 256:  return 'bg-[#2b5876] text-white text-glow';
    case 512:  return 'bg-[#1e3c72] text-white text-glow';
    case 1024: return 'bg-[#8e2de2] text-white text-glow';
    case 2048: return 'bg-[#4a00e0] text-white text-glow';
    default:   return 'bg-gradient-to-br from-[#ff0844] to-[#ffb199] text-white text-glow';
  }
};

const getFontSize = (value: number) => {
  if (value < 100)  return 'text-[clamp(2rem,8vw,3rem)]';
  if (value < 1000) return 'text-[clamp(1.75rem,6vw,2.5rem)]';
  return 'text-[clamp(1.25rem,4vw,2rem)]';
};

export const Tile: React.FC<{ tile: TileData }> = ({ tile }) => {
  const { value, row, col, isNew, isMerging } = tile;
  const [animClass, setAnimClass] = useState('');

  useEffect(() => {
    if (isNew) setAnimClass('tile-pop');
    else if (isMerging) setAnimClass('tile-merge');
    else setAnimClass('');
  }, [isNew, isMerging]);

  return (
    <div
      className={`absolute flex items-center justify-center rounded-md font-bold transition-transform duration-100 ease-out z-10 shadow-lg ${getTileColor(value)} ${getFontSize(value)}`}
      style={{
        width: 'calc(25% - 0.75rem)',
        height: 'calc(25% - 0.75rem)',
        transform: `translate(calc(${col * 100}% + ${col}rem), calc(${row * 100}% + ${row}rem))`,
        top: '0.5rem',
        left: '0.5rem',
      }}
    >
      <div className={`w-full h-full flex items-center justify-center ${animClass}`}>
        {value}
      </div>
    </div>
  );
};