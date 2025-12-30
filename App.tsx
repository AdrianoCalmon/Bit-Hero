
import React, { useState } from 'react';
import { GameState, SongMetadata, GameScore, Character } from './types';
import { CHARACTERS } from './constants';
import GameEngine from './components/GameEngine';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import ResultsScreen from './components/ResultsScreen';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [song, setSong] = useState<SongMetadata | null>(null);
  const [lastScore, setLastScore] = useState<GameScore | null>(null);
  const [selectedCharId, setSelectedCharId] = useState<string>(CHARACTERS[0].id);

  const selectedCharacter = CHARACTERS.find(c => c.id === selectedCharId) || CHARACTERS[0];

  const startCharacterSelect = () => {
    setGameState(GameState.CHARACTER_SELECT);
  };

  const onCharacterChosen = (char: Character) => {
    setSelectedCharId(char.id);
    setGameState(GameState.MENU);
  };

  const selectSong = (songData: SongMetadata) => {
    audioService.init();
    const resetSong = {
      ...songData,
      notes: songData.notes.map(n => ({ ...n, hit: false, missed: false }))
    };
    setSong(resetSong);
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (score: GameScore) => {
    setLastScore(score);
    setGameState(GameState.RESULTS);
  };

  const returnToMenu = () => {
    setGameState(GameState.MENU);
    setSong(null);
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="scanlines" />
      
      <div className="relative w-full max-w-[450px] h-full bg-[#1a1a2e] flex flex-col shadow-2xl overflow-hidden border-x-4 border-[#333]">
        
        {gameState === GameState.MENU && (
          <MainMenu 
            onStart={selectSong} 
            onSelectCharacter={startCharacterSelect} 
            selectedCharacter={selectedCharacter} 
          />
        )}

        {gameState === GameState.CHARACTER_SELECT && (
          <CharacterSelect 
            characters={CHARACTERS}
            onSelect={onCharacterChosen} 
            onBack={() => setGameState(GameState.MENU)}
          />
        )}

        {gameState === GameState.PLAYING && song && (
          <GameEngine 
            song={song} 
            character={selectedCharacter}
            onFinish={handleGameOver} 
            onExit={returnToMenu}
          />
        )}

        {gameState === GameState.RESULTS && lastScore && (
          <ResultsScreen 
            score={lastScore} 
            songTitle={song?.title || 'Unknown'} 
            onRetry={() => song && selectSong(song)}
            onMenu={returnToMenu} 
          />
        )}

      </div>
    </div>
  );
};

export default App;
