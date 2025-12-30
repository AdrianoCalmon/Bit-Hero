
import React from 'react';
import { EXCLUSIVE_SONGS } from '../songs';
import { SongMetadata, Character } from '../types';

interface MainMenuProps {
  onStart: (song: SongMetadata) => void;
  onSelectCharacter: () => void;
  selectedCharacter: Character | null;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onSelectCharacter, selectedCharacter }) => {
  return (
    <div className="flex-1 flex flex-col items-center py-6 px-4 overflow-hidden">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-white leading-tight tracking-tighter italic animate-pulse">
          BIT<br/>HERO
        </h1>
        <div className="h-1 w-24 bg-[#e94560] mx-auto mt-2"></div>
      </div>

      <button 
        onClick={onSelectCharacter}
        className="w-full bg-[#16213e] p-3 border-2 border-[#e94560] mb-4 flex items-center gap-4 hover:bg-[#1a2b54] transition-colors relative overflow-hidden group"
      >
        <div className="w-14 h-14 flex-shrink-0 bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
          {selectedCharacter?.faceUrl ? (
            <img 
              src={selectedCharacter.faceUrl} 
              alt={selectedCharacter.name}
              className="w-full h-full object-cover pixelated"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-xl font-bold">?</div>
          )}
        </div>
        <div className="text-left flex-1 z-10">
          <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">CURRENT HERO</p>
          <p className="text-[10px] text-white font-bold truncate uppercase">{selectedCharacter?.name || 'SELECT HERO'}</p>
          <p className="text-[6px] text-[#e94560] font-bold mt-1 uppercase tracking-tighter">
            {selectedCharacter ? `${selectedCharacter.style} • ${selectedCharacter.country}` : 'CHOOSE YOUR STYLE'}
          </p>
        </div>
        <div className="text-[7px] text-white bg-[#e94560] px-2 py-1 font-bold animate-pulse group-hover:scale-110 transition-transform">CHANGE</div>
      </button>

      <p className="text-[8px] text-white text-center mb-4 uppercase tracking-[0.2em]">SELECT TRACK</p>
      
      <div className="flex-1 w-full overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {EXCLUSIVE_SONGS.map((song) => (
          <button
            key={song.title}
            onClick={() => onStart(song)}
            className="w-full p-4 flex justify-between items-center bg-[#16213e] border-2 border-white hover:border-[#e94560] hover:translate-x-1 transition-all group"
          >
            <div className="text-left">
              <h3 className="text-[10px] text-white font-bold group-hover:text-[#e94560]">{song.title}</h3>
              <p className="text-[7px] text-gray-400 uppercase mt-1">{song.genre}</p>
            </div>
            <div className="text-right">
              <span className={`text-[7px] px-2 py-1 border border-current font-bold ${
                song.difficulty === 'HARD' ? 'text-red-500' : 
                song.difficulty === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {song.difficulty}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-[6px] text-gray-500 uppercase tracking-widest">Created by Adriano Calmon, 2025</p>
      </div>
      
      <style>{`
        .pixelated {
          image-rendering: pixelated;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a2e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e94560;
        }
      `}</style>
    </div>
  );
};

export default MainMenu;
