
import React from 'react';
import { Character, RelationshipStatus } from '../types';

interface Props {
  character: Character;
  allCharacters: Character[];
  onClose: () => void;
}

const CharacterDetailModal: React.FC<Props> = ({ character, allCharacters, onClose }) => {
  const getRelationshipName = (id: string) => {
    const target = allCharacters.find(c => c.id === id);
    return target ? target.name : '알 수 없음';
  };

  const getStatusEmoji = (status: RelationshipStatus) => {
    switch (status) {
      case 'Lover': return '❤️';
      case 'Spouse': return '💍';
      case 'Parent': return '👪';
      case 'Child': return '🐣';
      case 'Sibling': return '👫';
      case 'Family': return '🏠';
      case 'BestFriend': return '🤝';
      case 'Friend': return '👥';
      case 'Colleague': return '💼';
      case 'Savior': return '🦸';
      case 'Guardian': return '🛡️';
      case 'Ward': return '👧';
      case 'Rival': return '⚔️';
      case 'Enemy': return '👿';
      case 'Ex': return '💔';
      default: return '😐';
    }
  };

  const stats = character.stats || { str: 5, agi: 5, con: 5, int: 5, cha: 5 };
  const relationships = character.relationships || {};
  const relationshipStatuses = character.relationshipStatuses || {};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="bg-indigo-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold">{character.name} <span className="text-sm font-normal opacity-80">({character.mbti})</span></h2>
          <p className="text-sm opacity-90 mt-1">{character.job || '직업 없음'} • {character.gender === 'Male' ? '남성' : '여성'}</p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">상세 능력치 (Stats)</h3>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: '힘', val: stats.str, icon: '💪' },
                { label: '민첩', val: stats.agi, icon: '🏃' },
                { label: '체력', val: stats.con, icon: '🛡️' },
                { label: '지능', val: stats.int, icon: '🧠' },
                { label: '매력', val: stats.cha, icon: '✨' }
              ].map(s => (
                <div key={s.label} className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                  <div className="text-lg">{s.icon}</div>
                  <div className="text-xs font-bold dark:text-white mt-1">{s.val}</div>
                  <div className="text-[9px] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">보유 스킬 (Skills)</h3>
            <div className="space-y-2">
              {character.skills && character.skills.length > 0 ? (
                character.skills.map((skill, idx) => (
                  <div key={idx} className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="text-sm font-bold text-amber-900 dark:text-amber-100">{skill.name}</span>
                    </div>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-tight">
                      {skill.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 text-xs py-4 italic border border-dashed rounded-2xl">획득한 스킬이 없습니다.</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">전체 관계망 (Relationships)</h3>
            <div className="space-y-2">
              {Object.entries(relationships).length > 0 ? (
                Object.entries(relationships)
                  .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number))
                  .map(([targetId, score]) => {
                    const status = relationshipStatuses[targetId] || 'None';
                    const numericScore = score as number;
                    return (
                      <div key={targetId} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getStatusEmoji(status)}</span>
                          <div>
                            <div className="text-sm font-bold dark:text-white">{getRelationshipName(targetId)}</div>
                            <div className="text-[10px] text-slate-500">{status}</div>
                          </div>
                        </div>
                        <div className={`font-mono font-bold text-sm ${numericScore > 0 ? 'text-green-500' : numericScore < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                          {numericScore > 0 ? '+' : ''}{numericScore}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs italic">
                  아직 맺어진 관계가 없습니다.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailModal;
