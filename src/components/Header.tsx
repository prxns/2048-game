import React from 'react';
import { Button } from '@/components/ui/button';
import { ScorePanel } from './ScorePanel';
import { Volume2, VolumeX, Pause, Play, RotateCcw } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const Header: React.FC<{
  score: number;
  bestScore: number;
  scoreDelta: { id: number; value: number } | null;
  mode: 'NORMAL' | 'TIMED';
  setMode: (mode: 'NORMAL' | 'TIMED') => void;
  muted: boolean;
  toggleMute: () => void;
  isPaused: boolean;
  togglePause: () => void;
  onNewGame: () => void;
}> = ({ score, bestScore, scoreDelta, mode, setMode, muted, toggleMute, isPaused, togglePause, onNewGame }) => (
  <div className="w-full flex flex-col gap-6 mb-8 max-w-[500px] mx-auto">
    <div className="flex justify-between items-end">
      <h1 className="text-6xl font-bold text-primary text-glow tracking-tighter leading-none">2048</h1>
      <ScorePanel score={score} bestScore={bestScore} scoreDelta={scoreDelta} />
    </div>
    <div className="flex justify-between items-center bg-[#16213e] p-2 rounded-lg border border-border/50 shadow-md">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onNewGame} title="New Game" className="text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <ToggleGroup type="single" value={mode} onValueChange={(v) => { if (v) setMode(v as 'NORMAL' | 'TIMED'); }} size="sm">
          <ToggleGroupItem value="NORMAL" aria-label="Normal Mode" className="text-xs font-bold px-3">NORMAL</ToggleGroupItem>
          <ToggleGroupItem value="TIMED"  aria-label="Timed Mode"  className="text-xs font-bold px-3">TIMED</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={togglePause} title={isPaused ? "Resume" : "Pause"} className="text-muted-foreground hover:text-foreground">
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleMute} title={muted ? "Unmute" : "Mute"} className="text-muted-foreground hover:text-foreground">
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  </div>
);