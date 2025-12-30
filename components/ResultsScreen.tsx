
import React from 'react';
import { GameScore } from '../types';

interface ResultsScreenProps {
  score: GameScore;
  songTitle: string;
  onRetry: () => void;
  onMenu: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, songTitle, onRetry, onMenu }) => {
  const getRank = (s: GameScore) => {
    const totalPossible = (s.perfect + s.great + s.miss) * 100;
    if (totalPossible === 0) return 'F';
    const ratio = s.score / totalPossible;
    if (ratio > 1.2) return 'S';
    if (ratio > 0.9) return 'A';
    if (ratio > 0.7) return 'B';
    if (ratio > 0.5) return 'C';
    return 'D';
  };

  const rank = getRank(score);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#1a1a2e]">
      <div className="text-center mb-8">
        <p className="text-[8px] text-gray-400 uppercase mb-2">FINISHED</p>
        <h2 className="text-xl font-bold text-white uppercase italic">{songTitle}</h2>
      </div>

      <div className="w-full bg-[#16213e] p-6 pixel-border mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-4xl font-black text-[#e94560] italic" style={{ textShadow: '4px 4px 0 #fff' }}>
            {rank}
          </div>
          <div className="text-right">
            <p className="text-[8px] text-gray-400">FINAL SCORE</p>
            <p className="text-2xl text-white font-bold">{score.score.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <StatRow label="PERFECT" value={score.perfect} color="#00ffff" />
          <StatRow label="GREAT" value={score.great} color="#ffeb3b" />
          <StatRow label="MISS" value={score.miss} color="#ff0000" />
          <div className="h-px bg-gray-700 my-2" />
          <StatRow label="MAX COMBO" value={score.maxCombo} color="#fff" />
        </div>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={onRetry}
          className="w-full py-4 text-[10px] text-black bg-white font-bold uppercase hover:bg-gray-200 transition-colors active:scale-95"
          style={{ boxShadow: '4px 4px 0px #e94560' }}
        >
          RETRY STAGE
        </button>
        <button
          onClick={onMenu}
          className="w-full py-4 text-[10px] text-white border-2 border-white font-bold uppercase hover:bg-white hover:text-black transition-colors active:scale-95"
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex justify-between items-center text-[10px]">
    <span className="text-gray-400 font-bold">{label}</span>
    <span className="font-bold" style={{ color }}>{value}</span>
  </div>
);

export default ResultsScreen;
