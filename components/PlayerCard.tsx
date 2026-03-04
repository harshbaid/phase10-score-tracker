
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 relative overflow-hidden transition-colors duration-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {player.name}
        </h3>

        {!isGameStarted && onRemove && (
          <button 
            onClick={onRemove}
            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {isGameStarted && (
        <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800/30 flex items-start gap-3">
          <div className="flex flex-col items-center justify-center bg-indigo-600 text-white rounded-md w-12 h-12 flex-shrink-0 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none mb-1">Phase</span>
            <span className="text-xl font-black leading-none">{player.currentPhase}</span>
          </div>
          <div className="flex flex-col justify-center min-h-[48px]">
            <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 leading-snug">
              {currentPhaseData.description}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Score</span>
          <span className="text-3xl font-black text-gray-800 dark:text-white">{player.totalScore}</span>
        </div>
        
        {isGameStarted && (
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">{player.currentPhase}/10</span>
            </div>
          </div>
        )}
      </div>

      {isGameStarted && (
        <div className="mt-4 w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
