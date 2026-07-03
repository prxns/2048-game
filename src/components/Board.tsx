import React from 'react';
import { TileData } from '@/lib/gameLogic';
import { Tile } from './Tile';

export const Board: React.FC<{ board: (TileData | null)[] }> = ({ board }) => {
  const emptyCells = Array(16).fill(null).map((_, i) => (
    <div key={`empty-${i}`} className="bg-[rgba(255,255,255,0.05)] rounded-md w-full h-full" />
  ));
  const activeTiles = board.filter((t): t is TileData => t !== null);

  return (
    <div className="relative w-full max-w-[500px] aspect-square bg-[#16213e] rounded-xl p-2 shadow-2xl mx-auto">
      <div className="grid grid-cols-4 grid-rows-4 gap-4 w-full h-full p-2 relative">
        {emptyCells}
      </div>
      <div className="absolute inset-0 p-2">
        {activeTiles.map(tile => <Tile key={tile.id} tile={tile} />)}
      </div>
    </div>
  );
};