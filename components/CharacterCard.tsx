
import React, { useState } from 'react';
import { Character, Status } from '../types';
import { MAX_HP, MAX_SANITY, MAX_FATIGUE, MAX_INFECTION, MAX_HUNGER, FATIGUE_THRESHOLD } from '../constants';

interface Props {
  character: Character;
  allCharacters: Character[];
  onDelete: (id: string) => void;
}

const CharacterCard: React.FC<Props> = ({ character, allCharacters, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isDead = character.status === 'Dead' || character.status === 'Missing';
  const isZombie = character.status === 'Zombie';
  const isInfected = character.status === 'Infected' || (character.infection > 0 && !isZombie);
  const isExhausted = character.fatigue >= FATIGUE_THRESHOLD;
  // Fallback for mentalState if not present (backward compatibility)
  const mentalState = character.mentalState || 'Normal';
  const hasMentalIllness = mentalState !== 'Normal';
  
  const getStatusColor = () => {
    if (character.status === 'Dead') return 'text-gray-500 bg-gray-100 border-gray-300 dark:text-gray-600 dark:bg-gray-900 dark:border-gray-700 opacity-60';
    if (character.status === 'Zombie') return 'text-zombie-green border-zombie-green bg-green-50 dark:bg-green-900/30 dark:text-green-400';
    if (character.infection >= 80) return 'border-orange-400 bg-orange-50 dark:bg-orange-900/20';
    if (character.status === 'Missing') return 'text-yellow-600 dark:text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
    if (hasMentalIllness) return 'border-red-400 bg-red-50 dark:bg-red-900/10 dark:border-red-800'; 
    if (isExhausted) return 'text-purple-900 border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-700';
    return 'text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800';
  };

  const getRelationshipName = (id: string) => {
    const target = allCharacters.find(c => c.id === id);
    return target ? target.name : '알 수 없음';
  };

  const hasStatus = (status: string) => Object.values(character.relationshipStatuses).includes(status as any);

  // Sort relationships by affinity
  const allRelationships = Object.entries(character.relationships)
    .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number));

  const visibleRelationships = isExpanded ? allRelationships : allRelationships.slice(0, 3);
  const hiddenCount = allRelationships.length - 3;

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
              {isZombie && <span title="좀비" className="text-xl">🧟</span>}
              {character.hasMuzzle && <span title="입마개 착용" className="text-sm">😷</span>}
              {!isZombie && (hasStatus('Lover') || hasStatus('Spouse')) && <span title="연인/배우자 있음" className="text-sm cursor-help">❤️</span>}
              {!isZombie && (hasStatus('Child') || hasStatus('Parent')) && <span title="가족 있음" className="text-sm cursor-help">👪</span>}
              {!isZombie && isExhausted && !isDead && <span title="탈진 상태" className="text-sm animate-pulse">💤</span>}
              {!isZombie && hasMentalIllness && !isDead && <span title="정신 이상" className="text-sm animate-pulse">🧠</span>}
          </h3>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80 mt-1">
            <span className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-700 dark:text-slate-300">{character.mbti}</span>
            <span className="text-slate-600 dark:text-slate-400">{character.gender === 'Male' ? '남성' : character.gender === 'Female' ? '여성' : '논바이너리'}</span>
            {!isZombie && hasMentalIllness && (
                <span className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-1.5 rounded font-bold">{mentalState}</span>
            )}
            {isZombie && (
                 <span className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-1.5 rounded font-bold">ZOMBIE</span>
            )}
          </div>
        </div>
        <div className="text-right text-xs flex flex-col items-end gap-1 relative z-20">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(character.id);
                }}
                className="text-slate-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="생존자 삭제"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="font-mono text-slate-600 dark:text-slate-400">처치: {character.killCount}</div>
            <div className={`font-bold ${isZombie ? 'text-green-600 dark:text-green-400' : isInfected ? 'text-orange-500 animate-pulse' : ''}`}>
                {character.status === 'Infected' ? '감염됨' : character.status}
            </div>
        </div>
      </div>

      <div className="space-y-2 mt-4 text-xs font-mono text-slate-600 dark:text-slate-400">
        {/* HP Bar */}
        <div className="w-full">
          <div className="flex justify-between mb-0.5">
            <span>체력</span>
            <span>{character.hp}/{MAX_HP}</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 dark:bg-red-600 transition-all duration-500" 
              style={{ width: `${(character.hp / MAX_HP) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Zombie: Hunger Bar, Human: Sanity Bar */}
        <div className="w-full">
          <div className="flex justify-between mb-0.5">
            {isZombie ? (
                <span className="text-red-700 dark:text-red-400 font-bold">허기 (Hunger)</span>
            ) : (
                <span className={character.sanity <= 10 ? 'text-red-500 font-bold animate-pulse' : ''}>
                    {hasMentalIllness ? '정신력 (불안정)' : '정신력'}
                </span>
            )}
            <span>
                {isZombie ? `${character.hunger}/${MAX_HUNGER}` : `${character.sanity}/${MAX_SANITY}`}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                  isZombie ? 'bg-red-800' : hasMentalIllness ? 'bg-purple-600' : 'bg-blue-500'
              }`} 
              style={{ width: `${isZombie ? (character.hunger / MAX_HUNGER) * 100 : (character.sanity / MAX_SANITY) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Human: Fatigue & Infection, Zombie: Just Infection (always 100) */}
        {!isZombie && (
        <>
            <div className="w-full">
            <div className="flex justify-between mb-0.5">
                <span className={isExhausted ? "text-purple-600 font-bold" : ""}>피로도</span>
                <span>{character.fatigue}/{MAX_FATIGUE}</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                className={`h-full transition-all duration-500 ${isExhausted ? 'bg-purple-600 animate-pulse' : 'bg-slate-500 dark:bg-slate-400'}`}
                style={{ width: `${(character.fatigue / MAX_FATIGUE) * 100}%` }}
                ></div>
            </div>
            </div>

            {/* Infection Bar (Only visible if > 0) */}
            {(character.infection > 0) && (
                <div className="w-full">
                    <div className="flex justify-between mb-0.5 text-zombie-green">
                        <span className="font-bold">감염도 (위험!)</span>
                        <span>{character.infection}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                        className="h-full bg-lime-500 transition-all duration-500 relative"
                        style={{ width: `${(character.infection / MAX_INFECTION) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMikiLz48L3N2Zz4=')] opacity-30"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
        <h4 className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1 flex justify-between items-center">
            <span>호감도 {allRelationships.length > 0 && `(${allRelationships.length})`}</span>
        </h4>
        {visibleRelationships.length > 0 ? (
          <div className="space-y-1">
            <ul className="space-y-1 text-xs">
              {visibleRelationships.map(([id, score]) => {
                const status = character.relationshipStatuses[id];
                return (
                  <li key={id} className="flex justify-between items-center animate-fade-in">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        {getRelationshipName(id)}
                        {status === 'Lover' && '❤️'}
                        {status === 'Spouse' && '💍'}
                        {status === 'Ex' && '💔'}
                        {status === 'Family' && '🏠'}
                        {status === 'Parent' && '👪'}
                        {status === 'Child' && '🐣'}
                        {status === 'Sibling' && '👫'}
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
            {allRelationships.length > 3 && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="w-full text-center text-[10px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 pt-1 pb-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded transition-colors"
                >
                    {isExpanded ? '접기 ▲' : `더 보기 (+${hiddenCount}) ▼`}
                </button>
            )}
          </div>
        ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">아직 특별한 유대 관계가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;
