
import React, { useState, useEffect, useCallback } from 'react';
import { Player, GameState, RoundEntry, Round } from './types';
import { PlayerCard } from './components/PlayerCard';
import { Button } from './components/Button';
import { RoundModal } from './components/RoundModal';
import { saveGame, loadGame, clearGame } from './services/storageService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    history: [],
    isGameOver: false,
    gameStartedAt: 0
  });
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load game from local storage on mount
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setGameState(saved);
    }
    setIsInitialized(true);
  }, []);

  // Save game whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveGame(gameState);
    }
  }, [gameState, isInitialized]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPlayerName.trim(),
      currentPhase: 1,
      totalScore: 0
    };
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
    setNewPlayerName('');
    setIsAddingPlayer(false);
  };

  const removePlayer = (id: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const startGame = () => {
    if (gameState.players.length < 2) {
      alert("Add at least 2 players to start!");
      return;
    }
    setGameState(prev => ({
      ...prev,
      gameStartedAt: Date.now()
    }));
  };

  const submitRound = (entries: RoundEntry[]) => {
    setGameState(prev => {
      const newHistory: Round = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        entries
      };

      const updatedPlayers = prev.players.map(player => {
        const entry = entries.find(e => e.playerId === player.id);
        if (!entry) return player;

        let nextPhase = player.currentPhase;
        if (entry.phaseCompleted && player.currentPhase < 10) {
          nextPhase += 1;
        }

        return {
          ...player,
          totalScore: player.totalScore + entry.points,
          currentPhase: nextPhase
        };
      });

      // Check for winner
      const phase10CompletedInRound = entries.some(e => {
        const p = prev.players.find(pl => pl.id === e.playerId);
        return p?.currentPhase === 10 && e.phaseCompleted;
      });

      return {
        ...prev,
        players: updatedPlayers,
        history: [newHistory, ...prev.history],
        isGameOver: phase10CompletedInRound
      };
    });
    setIsRoundModalOpen(false);
  };

  const resetGame = () => {
    if (confirm("Reset current game? All scores and history will be cleared.")) {
      clearGame();
      setGameState({
        players: [],
        history: [],
        isGameOver: false,
        gameStartedAt: 0
      });
    }
  };

  const sortedPlayers = [...gameState.players].sort((a, b) => {
    // Phase 10 logic: Higher phase is better. If phase is same, lower score is better.
    if (b.currentPhase !== a.currentPhase) return b.currentPhase - a.currentPhase;
    return a.totalScore - b.totalScore;
  });

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
               <span className="font-black text-xl">10</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-800">Phase 10 <span className="text-indigo-600">Tracker</span></h1>
          </div>
          
          <div className="flex gap-2">
            {gameState.gameStartedAt > 0 && (
              <Button variant="ghost" onClick={resetGame} className="text-red-500 hover:bg-red-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Game Winner State */}
        {gameState.isGameOver && (
          <div className="mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-8 text-white text-center shadow-xl">
             <div className="inline-block p-4 bg-white/20 rounded-full mb-4 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
             </div>
             <h2 className="text-3xl font-black mb-2">Game Over!</h2>
             <p className="text-xl mb-4 font-medium opacity-90">{sortedPlayers[0].name} has completed Phase 10 and won the game!</p>
             <Button variant="secondary" onClick={resetGame} className="mx-auto border-none text-indigo-600 font-bold">New Game</Button>
          </div>
        )}

        {/* Players List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {gameState.players.map(player => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              isGameStarted={gameState.gameStartedAt > 0} 
              onRemove={() => removePlayer(player.id)}
            />
          ))}

          {/* Setup Phase: Add Player UI */}
          {!gameState.gameStartedAt && (
            <div className="flex flex-col gap-3">
              {isAddingPlayer ? (
                <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-4 flex flex-col gap-3">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Player Name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  />
                  <div className="flex gap-2">
                    <Button fullWidth onClick={addPlayer}>Add</Button>
                    <Button fullWidth variant="secondary" onClick={() => setIsAddingPlayer(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingPlayer(true)}
                  className="h-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-bold">Add Player</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Start Game Action */}
        {!gameState.gameStartedAt && gameState.players.length >= 2 && (
          <div className="text-center">
            <Button size="lg" className="px-12 py-4 text-lg" onClick={startGame}>Start New Game</Button>
          </div>
        )}

        {/* History Section */}
        {gameState.gameStartedAt > 0 && gameState.history.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Game History
            </h2>
            <div className="space-y-4">
              {gameState.history.map((round, idx) => (
                <div key={round.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Round {gameState.history.length - idx}</span>
                    <span className="text-xs text-gray-400">{new Date(round.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {round.entries.map(entry => {
                      const player = gameState.players.find(p => p.id === entry.playerId);
                      return (
                        <div key={entry.playerId} className="px-4 py-3 flex justify-between items-center">
                          <span className="font-medium text-gray-700">{player?.name}</span>
                          <div className="flex items-center gap-4">
                            {entry.phaseCompleted && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">Phase Up!</span>
                            )}
                            <span className="font-black text-gray-800">+{entry.points}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating Action Button for Adding Rounds */}
      {gameState.gameStartedAt > 0 && !gameState.isGameOver && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-40">
           <Button 
            onClick={() => setIsRoundModalOpen(true)}
            className="shadow-2xl px-12 py-4 rounded-full text-lg animate-in fade-in slide-in-from-bottom-4"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
             </svg>
             Complete Round
           </Button>
        </div>
      )}

      {/* Round Entry Modal */}
      {isRoundModalOpen && (
        <RoundModal 
          players={gameState.players}
          onClose={() => setIsRoundModalOpen(false)}
          onSubmit={submitRound}
        />
      )}
    </div>
  );
};

export default App;
