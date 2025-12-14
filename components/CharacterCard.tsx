import React from 'react';
import { Character } from '../types';
import { MAX_HP, MAX_SANITY, MAX_FATIGUE, FATIGUE_THRESHOLD } from '../constants';

interface Props {
  character: Character;
  allCharacters: Character[];
  onDelete: (id: string) => void;
}

const CharacterCard: React.FC<Props> = ({ character, allCharacters, onDelete }) => {
  const isDead = character.status === 'Dead' || character.status === 'Missing';
  const isInfected = character.status === 'Infected';
  const isExhausted = character.fatigue >= FATIGUE_THRESHOLD;
  
  const getStatusColor = () => {
    if (character.status === 'Dead') return 'text-gray-500 bg-gray-100 border-gray-300 dark:text-gray-600 dark:bg-gray-900 dark:border-gray-700 opacity-60';
    if (character.status === 'Infected') return 'text-zombie-green border-zombie-green bg-green-50 dark:bg-green-900/20';
    if (character.status === 'Missing') return 'text-yellow-600 dark:text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
    if (isExhausted) return 'text-purple-900 border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-700';
    return 'text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800';
  };

  const getRelationshipName = (id: string) => {
    const target = allCharacters.find(c => c.id === id);
    return target ? target.name : 'Unknown';
  };

  const hasStatus = (status: string) => Object.values(character.relationshipStatuses).includes(status as any);

  // Sort relationships by affinity
  const topRelationships = Object.entries(character.relationships)
    .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number)) // Sort by intensity
    .slice(0, 3); // Top 3

  return (
    <div className={`border p-4 rounded-lg shadow-sm hover:shadow-md transition-all ${getStatusColor()} relative overflow-hidden group`}>
      {isDead && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 dark:bg-black/60 font-bold text-3xl uppercase tracking-widest text-red-600 rotate-12 border-4 border-red-600 rounded-lg pointer-events-none">
          {character.status}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-xl flex items-center gap-2">
              {character.name}
              {hasStatus('Lover') && <span title="Has Lover" className="text-sm cursor-help">❤️</span>}
              {hasStatus('Family') && <span title="Has Family" className="text-sm cursor-help">🏠</span>}
              {hasStatus('BestFriend') && <span title="Has Best Friend" className="text-sm cursor-help">🤞</span>}
              {isExhausted && !isDead && <span title="Exhausted" className="text-sm animate-pulse">💤</span>}
          </h3>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
            <span className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-700 dark:text-slate-300">{character.mbti}</span>
            <span className="text-slate-600 dark:text-slate-400">{character.gender}</span>
          </div>
        </div>
        <div className="text-right text-xs flex flex-col items-end gap-1 relative z-20">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(character.id);
                }}
                className="text-slate-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Delete Survivor"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="font-mono text-slate-600 dark:text-slate-400">Kills: {character.killCount}</div>
            <div className={`font-bold ${isInfected ? 'text-green-600 dark:text-green-400 animate-pulse' : ''}`}>{character.status}</div>
        </div>
      </div>

      <div className="space-y-2 mt-4 text-xs font-mono text-slate-600 dark:text-slate-400">
        {/* HP Bar */}
        <div className="w-full">
          <div className="flex justify-between mb-0.5">
            <span>HP</span>
            <span>{character.hp}/{MAX_HP}</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 dark:bg-red-600 transition-all duration-500" 
              style={{ width: `${(character.hp / MAX_HP) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Sanity Bar */}
        <div className="w-full">
          <div className="flex justify-between mb-0.5">
            <span>SANITY</span>
            <span>{character.sanity}/{MAX_SANITY}</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${(character.sanity / MAX_SANITY) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Fatigue Bar */}
        <div className="w-full">
          <div className="flex justify-between mb-0.5">
            <span className={isExhausted ? "text-purple-600 font-bold" : ""}>FATIGUE</span>
            <span>{character.fatigue}/{MAX_FATIGUE}</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isExhausted ? 'bg-purple-600 animate-pulse' : 'bg-slate-500 dark:bg-slate-400'}`}
              style={{ width: `${(character.fatigue / MAX_FATIGUE) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
        <h4 className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1">Key Relationships</h4>
        {topRelationships.length > 0 ? (
          <ul className="space-y-1 text-xs">
            {topRelationships.map(([id, score]) => {
              const status = character.relationshipStatuses[id];
              return (
                <li key={id} className="flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      {getRelationshipName(id)}
                      {status === 'Lover' && '❤️'}
                      {status === 'Ex' && '💔'}
                      {status === 'Family' && '🏠'}
                      {status === 'BestFriend' && '🤝'}
                      {status === 'Colleague' && '💼'}
                      {status === 'Rival' && '⚔️'}
                      {status === 'Savior' && '🦸'}
                      {status === 'Enemy' && '👿'}
                  </span>
                  <span className={(score as number) > 0 ? 'text-green-600 dark:text-green-400' : (score as number) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}>
                    {(score as number) > 0 ? '+' : ''}{score as number}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">No significant bonds yet.</p>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;