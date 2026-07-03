import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardState, getInitialBoard, slideLeft, slideRight, slideUp, slideDown,
  addRandomTile, checkWin, checkLoss
} from '@/lib/gameLogic';

type GameMode = 'NORMAL' | 'TIMED';

export const use2048 = (
  onMove?: () => void,
  onMerge?: () => void,
  onWin?: () => void,
  onLose?: () => void
) => {
  const [board, setBoard] = useState<BoardState>(getInitialBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() =>
    parseInt(localStorage.getItem('2048-best') || '0', 10)
  );
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [hasContinued, setHasContinued] = useState(false);
  const [mode, setMode] = useState<GameMode>('NORMAL');
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [scoreDelta, setScoreDelta] = useState<{ id: number; value: number } | null>(null);
  const deltaId = useRef(0);

  const resetGame = useCallback(() => {
    setBoard(getInitialBoard());
    setScore(0);
    setGameState('PLAYING');
    setHasContinued(false);
    setHasStarted(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best', String(score));
    }
  }, [score, bestScore]);

  const move = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (gameState === 'LOST' || (gameState === 'WON' && !hasContinued) || isPaused) return;

    let result;
    switch (direction) {
      case 'UP':    result = slideUp(board);    break;
      case 'DOWN':  result = slideDown(board);  break;
      case 'LEFT':  result = slideLeft(board);  break;
      case 'RIGHT': result = slideRight(board); break;
    }

    if (result.moved) {
      setHasStarted(true);
      if (onMove) onMove();
      let nextBoard = addRandomTile(result.newBoard);
      setBoard(nextBoard);
      if (result.score > 0) {
        setScore(s => s + result.score);
        deltaId.current += 1;
        setScoreDelta({ id: deltaId.current, value: result.score });
        if (onMerge) onMerge();
      }
      if (!hasContinued && checkWin(nextBoard)) {
        setGameState('WON');
        if (onWin) onWin();
      } else if (checkLoss(nextBoard)) {
        setGameState('LOST');
        if (onLose) onLose();
      }
    }
  }, [board, gameState, hasContinued, isPaused, onMove, onMerge, onWin, onLose]);

  const continuePlaying = useCallback(() => {
    setHasContinued(true);
    setGameState('PLAYING');
  }, []);

  const togglePause = useCallback(() => setIsPaused(p => !p), []);

  return {
    board, score, bestScore, gameState, mode, setMode,
    isPaused, hasStarted, scoreDelta, move, resetGame,
    continuePlaying, togglePause, setGameState,
  };
};