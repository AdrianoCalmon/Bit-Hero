
import React, { useState } from 'react';
import { Character } from '../types';

interface CharacterSelectProps {
  characters: Character[];
  onSelect: (char: Character) => void;
  onBack: () => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ characters, onSelect, onBack }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const hovered = characters[selectedIdx];

  return (
    <div className="flex-1 flex flex-col bg-[#050510] select-none h-full relative overflow-hidden">
      {/* Top Presentation Area */}
      <div className="relative flex-[3] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Scenario Layer */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-700 ease-out"
          style={{ background: hovered.scenery.background }}
        >
          <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
            {hovered.scenery.elements.map((emoji, i) => (
              <div
                key={`${hovered.id}-${i}`}
                className="absolute text-5xl animate-float"
                style={{
                  top: `${15 + (i * 18)}%`,
                  left: `${(i * 30) % 85}%`,
                  animationDelay: `${i * 0.4}s`,
                  opacity: 0.6,
                  filter: `drop-shadow(0 0 15px ${hovered.scenery.accentColor})`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1.5px,transparent_1.5px)] bg-[size:24px_24px] opacity-25" />
          
          <div 
            className="absolute bottom-0 w-full h-[35%] opacity-40"
            style={{ 
              background: `linear-gradient(to top, ${hovered.scenery.floorColor}, transparent)`,
              perspective: '120px'
            }}
          >
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(${hovered.scenery.floorColor}77 1.5px, transparent 1.5px), linear-gradient(90deg, ${hovered.scenery.floorColor}77 1.5px, transparent 1.5px)`,
                backgroundSize: '50px 50px',
                transform: 'rotateX(48deg) scale(2.2)',
                transformOrigin: 'bottom'
              }}
            />
          </div>
        </div>

        {/* TOP INFORMATION HEADER */}
        <div className="absolute top-10 left-0 w-full z-20 flex flex-col items-center">
          <div className="px-10 py-5 bg-black/70 backdrop-blur-md border-y-[3px] shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-500 w-full text-center" style={{ borderColor: hovered.color }}>
            <h2 className="text-[18px] text-white font-black italic tracking-[0.2em] uppercase drop-shadow-[0_3px_0_rgba(0,0,0,1)]">
              {hovered.name}
            </h2>
            <div className="flex items-center justify-center gap-5 mt-2.5">
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: hovered.color }}>
                {hovered.style}
              </span>
              <span className="w-2 h-2 bg-white/50 rotate-45" />
              <span className="text-[9px] text-white/90 font-black uppercase tracking-widest">
                {hovered.country}
              </span>
            </div>
          </div>
        </div>

        {/* Character Image Display - Larger and centered */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-20">
          <div className="relative w-64 h-80 flex items-center justify-center">
            <img 
              key={hovered.id}
              src={hovered.imageUrl} 
              alt={hovered.name}
              className="w-full h-full object-contain animate-jam transition-all duration-300"
              style={{ 
                filter: `drop-shadow(0 0 25px ${hovered.color})`, 
                imageRendering: 'pixelated',
                transform: 'scale(1.1)'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 flex gap-3 w-full px-6 z-20">
          <button 
              onClick={onBack}
              className="flex-1 py-4 border-2 border-white/30 text-[9px] text-white bg-black/90 uppercase font-black tracking-widest active:bg-white active:text-black transition-all"
          >
              BACK
          </button>
          <button 
              onClick={() => onSelect(hovered)}
              className="flex-[2.5] py-4 text-[10px] bg-white text-black font-black uppercase tracking-widest shadow-[0_6px_0_#999] active:translate-y-1 active:shadow-none transition-all"
          >
              START STAGE
          </button>
        </div>
      </div>

      {/* Grid Selection */}
      <div className="flex-1 bg-black/98 p-6 flex flex-col border-t-2 border-white/15">
        <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.4em] mb-4 text-center">CHARACTER SELECTION</p>
        <div className="grid grid-cols-5 gap-3 max-w-[420px] mx-auto w-full flex-1">
          {characters.map((char, index) => (
            <button
              key={char.id}
              onClick={() => setSelectedIdx(index)}
              className={`aspect-square relative border-[3px] overflow-hidden transition-all duration-300 bg-[#16213e] flex items-center justify-center ${
                selectedIdx === index 
                  ? 'border-white scale-110 z-20 ring-[6px] ring-white/20' 
                  : 'border-white/10 opacity-50 grayscale hover:opacity-80 hover:grayscale-0'
              }`}
            >
              <img src={char.faceUrl} className="w-full h-full object-cover pixelated" alt={char.name} />
              <div className={`absolute inset-0 border-[3px] transition-opacity ${selectedIdx === index ? 'opacity-100 border-white' : 'opacity-0 border-transparent'}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="scanlines pointer-events-none" />
    </div>
  );
};

export default CharacterSelect;
