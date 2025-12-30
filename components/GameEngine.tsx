
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SongMetadata, Note, GameScore, Character } from '../types';
import { COLORS, GAME_CONFIG } from '../constants';
import { audioService } from '../services/audioService';

interface GameEngineProps {
  song: SongMetadata;
  character: Character | null;
  onFinish: (score: GameScore) => void;
  onExit: () => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ song, character, onFinish, onExit }) => {
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [stats, setStats] = useState({ perfect: 0, great: 0, miss: 0 });
  const [notes, setNotes] = useState<Note[]>(song.notes);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [activeLanes, setActiveLanes] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  
  const [charAnim, setCharAnim] = useState<'idle' | 'hit' | 'miss'>('idle');

  const multiplier = Math.min(8, Math.floor(combo / 10) + 1);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(performance.now());
  const currentTimeRef = useRef<number>(0);
  const feedbackTimeout = useRef<any>(null);
  const animTimeout = useRef<any>(null);
  const pauseStartTimeRef = useRef<number | null>(null);
  
  const currentNotesRef = useRef<Note[]>(song.notes);
  const activeLanesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    currentNotesRef.current = notes;
  }, [notes]);

  const triggerFeedback = (text: string, color: string) => {
    setFeedback({ text, color });
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => setFeedback(null), 600);

    if (text === 'MISS') {
        setCharAnim('miss');
    } else {
        setCharAnim('hit');
    }
    if (animTimeout.current) clearTimeout(animTimeout.current);
    animTimeout.current = setTimeout(() => setCharAnim('idle'), 400);
  };

  const handleHit = useCallback((lane: number) => {
    if (isPaused) return;
    const now = currentTimeRef.current;
    
    activeLanesRef.current.add(lane);
    setActiveLanes(new Set(activeLanesRef.current));

    const activeNote = currentNotesRef.current.find(n => 
      !n.hit && 
      !n.missed && 
      n.lane === lane && 
      Math.abs(n.time - now) < GAME_CONFIG.HIT_WINDOW_GREAT
    );

    if (activeNote) {
      const diff = Math.abs(activeNote.time - now);
      let hitType: 'PERFECT' | 'GREAT' = 'GREAT';
      let points = GAME_CONFIG.BASE_SCORE_GREAT;
      let color = '#fff';

      if (diff <= GAME_CONFIG.HIT_WINDOW_PERFECT) {
        hitType = 'PERFECT';
        points = GAME_CONFIG.BASE_SCORE_PERFECT;
        color = '#00ffff';
      }

      audioService.playHit(hitType === 'PERFECT');
      
      const pointsToGain = points * multiplier;

      setNotes(prev => prev.map(n => {
        if (n.id === activeNote.id) {
          return { ...n, hit: true };
        }
        return n;
      }));
      
      setScore(s => s + pointsToGain);
      setCombo(c => {
        const nc = c + 1;
        setMaxCombo(m => Math.max(m, nc));
        return nc;
      });
      setStats(prev => ({ ...prev, [hitType.toLowerCase()]: prev[hitType.toLowerCase() as keyof typeof prev] + 1 }));
      triggerFeedback(hitType, color);
    }
  }, [combo, isPaused, multiplier]);

  const handleRelease = useCallback((lane: number) => {
    activeLanesRef.current.delete(lane);
    setActiveLanes(new Set(activeLanesRef.current));
  }, []);

  const update = useCallback(() => {
    if (isPaused) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    currentTimeRef.current = elapsed;

    setNotes(prev => {
      let changed = false;
      const next = prev.map(n => {
        if (!n.hit && !n.missed && n.time < elapsed - GAME_CONFIG.HIT_WINDOW_GREAT) {
          changed = true;
          return { ...n, missed: true };
        }
        return n;
      });

      if (changed) {
        setCombo(0);
        setStats(s => ({ ...s, miss: s.miss + 1 }));
        triggerFeedback('MISS', '#ff0040');
        audioService.playMiss();
      }

      return next;
    });

    const lastNote = notes[notes.length - 1];
    const isGameOver = lastNote && 
                       (lastNote.hit || lastNote.missed) && 
                       (lastNote.time < elapsed - 1000);
    
    if (isGameOver) {
      onFinish({
        score,
        combo,
        maxCombo,
        perfect: stats.perfect,
        great: stats.great,
        miss: stats.miss
      });
      return;
    }

    requestRef.current = requestAnimationFrame(update);
  }, [notes, score, combo, stats, maxCombo, onFinish, isPaused]);

  useEffect(() => {
    if (!isPaused) {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update, isPaused]);

  const togglePause = () => {
    if (isPaused) {
      if (pauseStartTimeRef.current !== null) {
        const pauseDuration = performance.now() - pauseStartTimeRef.current;
        startTimeRef.current += pauseDuration;
        pauseStartTimeRef.current = null;
      }
      setIsPaused(false);
    } else {
      setIsPaused(true);
      pauseStartTimeRef.current = performance.now();
    }
  };

  const restartGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setStats({ perfect: 0, great: 0, miss: 0 });
    setNotes(song.notes.map(n => ({ ...n, hit: false, missed: false })));
    setFeedback(null);
    setCharAnim('idle');
    startTimeRef.current = performance.now();
    currentTimeRef.current = 0;
    pauseStartTimeRef.current = null;
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p') {
        togglePause();
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 'a') handleHit(0);
      else if (key === 's') handleHit(1);
      else if (key === 'k') handleHit(2);
      else if (key === 'l') handleHit(3);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        if (key === 'a') handleRelease(0);
        else if (key === 's') handleRelease(1);
        else if (key === 'k') handleRelease(2);
        else if (key === 'l') handleRelease(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleHit, handleRelease, isPaused]);

  const hitZoneY = 92;

  return (
    <div ref={containerRef} className="relative flex-1 bg-[#050510] flex flex-col overflow-hidden">
      
      {/* Static Character-Themed Background Layer */}
      {character && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-40 transition-all duration-1000"
          style={{ background: character.scenery.background }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:16px_16px]" />
          <div className="flex flex-wrap justify-around items-center h-full">
            {character.scenery.elements.map((el, i) => (
              <div 
                key={i} 
                className="text-6xl animate-float opacity-30 blur-[1px]"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                {el}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 pt-10 flex justify-between items-start z-50 pointer-events-none">
        <div className="flex flex-col bg-black/80 p-2 border-l-2 border-[#ff0040] min-w-[100px] shadow-lg">
          <span className="text-[8px] text-gray-400 uppercase">Score</span>
          <span className="text-xl text-white font-bold tabular-nums">{score.toLocaleString()}</span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="flex flex-col text-right bg-black/80 p-2 border-r-2 border-[#e94560] min-w-[100px] shadow-lg">
            <span className="text-[8px] text-gray-400 uppercase">Combo</span>
            <span className="text-xl text-[#e94560] font-bold tabular-nums">{combo}x</span>
          </div>
          {multiplier > 1 && (
            <div className="bg-[#00ffff] px-2 py-0.5 animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              <span className="text-[10px] text-black font-black uppercase">Multiplier x{multiplier}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Display - Repositioned slightly higher on the screen */}
      <div className="absolute top-[18%] left-0 w-full flex items-center justify-center z-40 pointer-events-none overflow-visible">
        {character?.imageUrl && (
          <div className="relative">
             <img 
              src={character.imageUrl}
              alt={character.name}
              className={`w-40 h-52 object-contain transition-all duration-150 transform ${
                  charAnim === 'idle' ? 'animate-jam opacity-95' : 
                  charAnim === 'hit' ? '-translate-y-4 scale-125 opacity-100 rotate-2' : 
                  'translate-y-2 scale-90 opacity-40 grayscale'
              }`}
              style={{ 
                filter: charAnim === 'hit' ? `drop-shadow(0 0 25px ${character.color})` : 'none',
                imageRendering: 'pixelated'
              }}
            />
            {/* Subtle stage platform under hero */}
            <div 
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/40 blur-md rounded-full -z-10"
              style={{ background: `radial-gradient(circle, ${character.color}44 0%, transparent 70%)` }}
            />
          </div>
        )}
      </div>

      <button 
        onClick={togglePause}
        className="absolute top-4 left-4 z-[60] px-3 py-1.5 text-[8px] border border-white/20 text-white/50 bg-black/60 active:bg-white active:text-black transition-all"
      >
        PAUSE
      </button>

      {/* Pause Menu Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-8 backdrop-blur-sm">
          <div className="w-full max-w-[280px] bg-[#16213e] p-6 border-4 border-[#e94560] shadow-[0_0_30px_rgba(233,69,96,0.3)]">
            <h2 className="text-xl text-white font-black italic mb-8 text-center animate-pulse">PAUSED</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={togglePause}
                className="w-full py-4 bg-white text-black text-[10px] font-black uppercase hover:bg-[#00ffff] transition-colors"
              >
                RESUME
              </button>
              <button
                onClick={restartGame}
                className="w-full py-4 bg-[#1a1a2e] text-white border-2 border-white/20 text-[10px] font-black uppercase hover:bg-[#e94560] hover:border-[#e94560] transition-colors"
              >
                RESTART
              </button>
              <button
                onClick={onExit}
                className="w-full py-4 bg-[#1a1a2e] text-[#ff0040] border-2 border-[#ff0040]/30 text-[10px] font-black uppercase hover:bg-[#ff0040] hover:text-white transition-colors"
              >
                QUIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Canvas */}
      <div className="flex-1 relative flex justify-center mt-20" style={{ perspective: '600px' }}>
        <div 
          className="w-[95%] max-w-[420px] h-[140%] absolute bottom-0 flex bg-gradient-to-b from-[#0a0a20]/80 to-[#050515]/90 border-x-2 border-white/10 origin-bottom"
          style={{ transform: 'rotateX(58deg)' }}
        >
          {/* Lanes */}
          {[0, 1, 2, 3].map((lane) => (
            <div 
              key={lane} 
              className={`flex-1 relative border-x border-white/5 flex flex-col justify-end transition-colors duration-75 ${activeLanes.has(lane) ? 'bg-white/10' : ''}`}
              onTouchStart={(e) => { e.preventDefault(); handleHit(lane); }}
              onTouchEnd={(e) => { e.preventDefault(); handleRelease(lane); }}
              onMouseDown={(e) => { e.preventDefault(); handleHit(lane); }}
              onMouseUp={(e) => { e.preventDefault(); handleRelease(lane); }}
              onMouseLeave={(e) => { e.preventDefault(); handleRelease(lane); }}
            >
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/10 -translate-x-1/2" />
              {activeLanes.has(lane) && (
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white/20 to-transparent" />
              )}
            </div>
          ))}

          {/* Hit Zone Line */}
          <div 
            className="absolute left-0 w-full h-[4px] bg-white/30 z-20 pointer-events-none"
            style={{ top: `${hitZoneY}%`, transform: 'translateY(-50%)' }}
          />

          {/* Visual Targets */}
          <div className="absolute inset-0 flex pointer-events-none">
            {[0, 1, 2, 3].map((lane) => (
              <div key={lane} className="flex-1 relative flex items-center justify-center">
                <div 
                  className="absolute w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center bg-black/40"
                  style={{ top: `${hitZoneY}%`, transform: 'translateY(-50%)' }}
                >
                  <div 
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-75 flex items-center justify-center ${activeLanes.has(lane) ? 'scale-110' : 'scale-100'}`}
                    style={{ 
                      borderColor: activeLanes.has(lane) ? '#fff' : COLORS[`LANE_${lane}` as keyof typeof COLORS],
                      backgroundColor: activeLanes.has(lane) ? COLORS[`LANE_${lane}` as keyof typeof COLORS] : 'transparent',
                      boxShadow: activeLanes.has(lane) ? `0 0 30px ${COLORS[`LANE_${lane}` as keyof typeof COLORS]}` : 'none'
                    }}
                  >
                    <span className="text-[8px] text-white/40 font-bold">
                      {['A', 'S', 'K', 'L'][lane]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {notes.filter(n => !n.missed && !n.hit).map(note => {
               const timeDiff = note.time - currentTimeRef.current;
               const pixelsPerMs = GAME_CONFIG.NOTE_SPEED;
               const containerHeight = (containerRef.current?.clientHeight || 800) * 1.4;
               
               // Head Position
               const yHeadOffset = (timeDiff * pixelsPerMs / containerHeight) * 100;
               let headTop = hitZoneY - yHeadOffset;

               // Render optimization: Skip notes outside of visible track
               if (headTop > 110 || headTop < -20) return null;

               const scale = 0.05 + (0.95 * (headTop / hitZoneY));
               const opacity = Math.min(1, headTop / 10 + 0.2);

               return (
                 <div
                   key={note.id}
                   className="absolute w-[24%] flex items-center justify-center"
                   style={{
                     left: `${note.lane * 25 + 0.5}%`,
                     top: `${headTop}%`,
                     transform: `translateY(-50%) scale(${Math.max(0.01, scale)})`,
                     opacity: opacity,
                     zIndex: Math.floor(100 - timeDiff / 10),
                     height: '40px'
                   }}
                 >
                    {/* Note Head - 16-bit Tap Note */}
                    <div 
                      className="w-full h-full rounded-sm border-b-[4px] border-black/60 shadow-xl"
                      style={{
                        backgroundColor: COLORS[`LANE_${note.lane}` as keyof typeof COLORS],
                        boxShadow: `inset 0 4px 0 rgba(255,255,255,0.4), 0 0 ${15 * scale}px ${COLORS[`LANE_${note.lane}` as keyof typeof COLORS]}`,
                      }}
                    >
                      <div className="w-full h-1 bg-white/20 mt-1" />
                    </div>
                 </div>
               );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div className="absolute top-[70%] left-0 w-full flex flex-col items-center pointer-events-none z-50">
          <p className="text-2xl font-black italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase animate-bounce" style={{ color: feedback.color }}>
            {feedback.text}
          </p>
        </div>
      )}
      
      <div className="scanlines z-[100]" />
    </div>
  );
};

export default GameEngine;
