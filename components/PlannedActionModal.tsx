
import React from 'react';
import { Character } from '../types';

interface Props {
  character: Character;
  onSelect: (actionId: string | null) => void;
  onClose: () => void;
}

const PlannedActionModal: React.FC<Props> = ({ character, onSelect, onClose }) => {
  const actions = [
    { id: 'rest', label: '🛌 집중 휴식', desc: '체력과 피로도를 대폭 회복합니다. (HP +15, 피로 -35)' },
    { id: 'scavenge', label: '🎒 물자 수색', desc: '위험을 무릅쓰고 생존에 필요한 물자를 찾아옵니다.' },
    { id: 'fortify', label: '🛡️ 거점 보수', desc: '은신처의 보안을 강화하고 정신적 안정을 찾습니다.' },
    { id: 'meditate', label: '🧘 정신 수양', desc: '명상을 통해 정신력을 대폭 회복합니다. (정신력 +20)' },
    { id: 'patrol', label: '⚔️ 적극 섬멸', desc: '주변 좀비를 소탕합니다. (킬 수 증가, 피로 대폭 증가)' },
  ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            📋 {character.name}의 행동 계획
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">
            * 지정된 행동은 다음 날 아침에 수행됩니다. 아무것도 지정하지 않으면 평소처럼 행동합니다.
          </p>
          
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                onSelect(action.id);
                onClose();
              }}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all flex flex-col gap-1 ${
                character.plannedAction === action.id
                  ? 'border-zombie-green bg-lime-50 dark:bg-lime-900/20'
                  : 'border-slate-100 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50 dark:bg-slate-900/50'
              }`}
            >
              <span className="font-bold text-sm text-slate-800 dark:text-white">{action.label}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{action.desc}</span>
            </button>
          ))}

          {character.plannedAction && (
            <button
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className="w-full mt-2 py-2 text-xs font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            >
              계획 취소 (자유 행동)
            </button>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-3 flex justify-end border-t border-slate-100 dark:border-slate-700">
           <button onClick={onClose} className="px-4 py-1.5 rounded-lg font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
             닫기
           </button>
        </div>
      </div>
    </div>
  );
};

export default PlannedActionModal;
