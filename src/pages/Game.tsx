import React, { useEffect, useState } from 'react';
import { use2048 } from '@/hooks/use2048';
import { useSound } from '@/hooks/useSound';
import { useSwipe } from '@/hooks/useSwipe';
import { Board } from '@/components/Board';
import { Header } from '@/components/Header';
import { Overlay } from '@/components/Overlay';
import { Timer } from '@/components/Timer';

export default function Game() {
  const { muted, toggleMute, playMerge, playMove, playWin, playLose, playClick, initSound } = useSound();

  const {
    board, score, bestScore, gameState, mode, setMode, isPaused, hasStarted,
    scoreDelta, move, resetGame, continuePlaying, togglePause, setGameState
  } = use2048(
    () => { playMove(); initSound(); },
    playMerge, playWin, playLose
  );

  const [resetId, setResetId] = useState(0);

  const handleNewGame = () => { playClick(); resetGame(); setResetId(r => r + 1); };
  const handlePauseToggle = () => { playClick(); togglePause(); };
  const handleTimerExpire = () => { setGameState('LOST'); playLose(); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': move('UP');    break;
        case 'ArrowDown':  case 's': case 'S': move('DOWN');  break;
        case 'ArrowLeft':  case 'a': case 'A': move('LEFT');  break;
        case 'ArrowRight': case 'd': case 'D': move('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  useSwipe((direction) => { initSound(); move(direction); });

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 selection:bg-primary/30 touch-none">
      <div className="w-full max-w-md flex flex-col">
        <Header
          score={score} bestScore={bestScore} scoreDelta={scoreDelta}
          mode={mode} setMode={(m) => { playClick(); setMode(m); handleNewGame(); }}
          muted={muted} toggleMute={toggleMute}
          isPaused={isPaused} togglePause={handlePauseToggle}
          onNewGame={handleNewGame}
        />
        <div className="relative">
          <Board board={board} />
          {gameState === 'WON' && (
            <Overlay type="WON" score={score}
              onPrimaryAction={() => { playClick(); continuePlaying(); }}
              onSecondaryAction={handleNewGame} />
          )}
          {gameState === 'LOST' && (
            <Overlay type="LOST" score={score} onPrimaryAction={handleNewGame} />
          )}
          {isPaused && gameState === 'PLAYING' && (
            <Overlay type="PAUSED" onPrimaryAction={handlePauseToggle} />
          )}
        </div>
        {mode === 'TIMED' && (
          <Timer hasStarted={hasStarted} isPaused={isPaused || gameState !== 'PLAYING'}
            onExpire={handleTimerExpire} resetId={resetId} />
        )}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Join the numbers and get to the <strong>2048 tile!</strong><br />
          Use <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-xs">W</kbd>{' '}
          <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-xs">A</kbd>{' '}
          <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-xs">S</kbd>{' '}
          <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-xs">D</kbd>{' '}
          or arrow keys to move tiles.
        </p>
      </div>
    </div>
  );
}