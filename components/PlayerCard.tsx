
import React from 'react';
import { Player } from '../types';
import { PHASES } from '../constants';

interface PlayerCardProps {
  player: Player;
  onRemove?: () => void;
  isGameStarted: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onRemove, isGameStarted }) => {
  const currentPhaseData = PHASES.find(p => p.number === player.currentPhase) || PHASES[9];
  const progressPercent = (player.currentPhase / 10) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
          {isGameStarted && (
            <p className="text-sm text-gray-500 mt-1">
              Phase {player.currentPhase}: {currentPhaseData.description}
            </p>
          )}
        </div>
        {!isGameStarted && onRemove && (
          <button 
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Score</span>
          <span className="text-3xl font-black text-gray-800">{player.totalScore}</span>
        </div>
        
        {isGameStarted && (
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-700">{player.currentPhase}/10</span>
            </div>
          </div>
        )}
      </div>

      {isGameStarted && (
        <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
