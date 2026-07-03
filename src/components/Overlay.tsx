import React from 'react';
import { Button } from '@/components/ui/button';

export const Overlay: React.FC<{
  type: 'WON' | 'LOST' | 'PAUSED';
  score?: number;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}> = ({ type, score, onPrimaryAction, onSecondaryAction }) => (
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
    <h2 className={`text-5xl font-bold mb-4 text-glow ${type === 'WON' ? 'text-primary' : 'text-foreground'}`}>
      {type === 'WON' ? 'You reached 2048!' : type === 'LOST' ? 'Game Over' : 'Paused'}
    </h2>
    {(type === 'WON' || type === 'LOST') && score !== undefined && (
      <p className="text-2xl mb-8 text-muted-foreground">
        Final Score: <span className="font-bold text-foreground">{score}</span>
      </p>
    )}
    <div className="flex gap-4">
      <Button onClick={onPrimaryAction} size="lg" className="font-bold text-lg px-8">
        {type === 'WON' ? 'Continue Playing' : type === 'LOST' ? 'Play Again' : 'Resume'}
      </Button>
      {onSecondaryAction && (
        <Button onClick={onSecondaryAction} size="lg" variant="secondary" className="font-bold text-lg px-8">
          New Game
        </Button>
      )}
    </div>
  </div>
);