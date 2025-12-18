
import React from 'react';
import { Character } from '../types';

interface Props {
  character: Character;
  onClose: () => void;
}

const CharacterSummaryModal: React.FC<Props> = ({ character, onClose }) => {
  const getMBTIGroup = (mbti: string) => {
    if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(mbti)) return '분석가형';
    if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(mbti)) return '외교관형';
    if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(mbti)) return '관리자형';
    return '탐험가형';
  };

  const isDead = character.status === 'Dead' || character.status === 'Missing';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
        <div className={`p-6 text-white relative ${isDead ? 'bg-slate-700' : 'bg-amber-500'}`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Survivor Summary</div>
          <h2 className="text-3xl font-black">{character.name}</h2>
          <p className="text-sm opacity-90">{character.job || '무직'} • {character.mbti} ({getMBTIGroup(character.mbti)})</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 mb-1">상태</div>
              <div className={`font-bold ${isDead ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                {character.status}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 mb-1">좀비 처치</div>
              <div className="font-bold text-slate-800 dark:text-white">{character.killCount}마리</div>
            </div>
          </div>

          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">현재 컨디션 요약</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">생존력 (HP)</span>
                <span className="font-bold text-red-500">{Math.round((character.hp / character.maxHp) * 100)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">정신적 내성</span>
                <span className="font-bold text-blue-500">{Math.round((character.sanity / character.maxSanity) * 100)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">피로 누적</span>
                <span className="font-bold text-purple-500">{character.fatigue}%</span>
              </div>
            </div>
          </section>

          <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20">
             <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed italic">
               "{character.name}은(는) {getMBTIGroup(character.mbti)} 성향의 {character.job || '사람'}으로서, 
               현재 {character.status === 'Dead' ? '안타깝게 세상을 떠난 상태입니다.' : 
               character.status === 'Zombie' ? '이성을 잃고 좀비가 되었습니다.' : 
               character.sanity < 30 ? '극도로 불안정한 정신 상태로 버티고 있습니다.' : '생존을 위해 최선을 다하고 있습니다.'}"
             </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSummaryModal;
