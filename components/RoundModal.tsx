
import React, { useState } from 'react';
import { Player, RoundEntry } from '../types';
import { Button } from './Button';
import { PHASES } from '../constants';

interface RoundModalProps {
  players: Player[];
  initialEntries?: RoundEntry[];
  isEditing?: boolean;
  onClose: () => void;
  onSubmit: (entries: RoundEntry[]) => void;
}

export const RoundModal: React.FC<RoundModalProps> = ({ players, initialEntries, isEditing = false, onClose, onSubmit }) => {
  const [entries, setEntries] = useState<RoundEntry[]>(() => {
    if (initialEntries && initialEntries.length > 0) {
      // Ensure all current players have an entry, even if they were added after this round
      return players.map(p => {
        const existing = initialEntries.find(e => e.playerId === p.id);
        return existing || { playerId: p.id, points: 0, phaseCompleted: false };
      });
    }
    return players.map(p => ({ playerId: p.id, points: 0, phaseCompleted: false }));
  });

  const updateEntry = (index: number, updates: Partial<RoundEntry>) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], ...updates };
    setEntries(newEntries);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Round' : 'End Current Round'}</h2>
            <p className="text-gray-500 text-sm">Enter scores and phase completions for each player.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {players.map((player, idx) => {
            const phase = PHASES.find(p => p.number === player.currentPhase);
            return (
              <div key={player.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{player.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium">
                      Current Phase {player.currentPhase}: {phase?.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Points</label>
                      <input 
                        type="number"
                        min="0"
                        value={entries[idx].points}
                        onChange={(e) => updateEntry(idx, { points: parseInt(e.target.value) || 0 })}
                        className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phase Done?</label>
                      <button 
                        onClick={() => updateEntry(idx, { phaseCompleted: !entries[idx].phaseCompleted })}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                          entries[idx].phaseCompleted 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-white text-gray-300 border border-gray-200'
                        }`}
                      >
                        {entries[idx].phaseCompleted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={() => onSubmit(entries)} className="flex-[2]">
            {isEditing ? 'Save Changes' : 'Confirm Round Scores'}
          </Button>
        </div>
      </div>
    </div>
  );
};
