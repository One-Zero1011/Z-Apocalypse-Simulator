
import React, { useState } from 'react';
import { Character, MentalState } from '../types';

interface Props {
  characters: Character[];
  onClose: () => void;
}

const GriefModal: React.FC<Props> = ({ characters, onClose }) => {
  // Only show living survivors (Alive, Infected) or Zombies (who might still have memories)
  // Typically grief is for the living.
  const survivors = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getMentalDescription = (state: MentalState, sanity: number) => {
    if (state === 'Madness') return "광기에 사로잡혀 현실과 환상을 구분하지 못합니다.";
    if (state === 'Despair') return "깊은 절망의 늪에 빠져 삶의 의지를 잃어가고 있습니다.";
    if (state === 'Trauma') return "과거의 끔찍한 기억이 계속해서 뇌리를 스칩니다.";
    if (state === 'Anxiety') return "작은 소리에도 소스라치게 놀라며 불안에 떨고 있습니다.";
    if (state === 'Delusion') return "보이지 않는 것을 보며 알 수 없는 말을 중얼거립니다.";
    if (sanity >= 80) return "비교적 평온한 상태를 유지하며 희망을 잃지 않았습니다.";
    return "슬픔을 가슴에 묻고 묵묵히 버티고 있습니다.";
  };

  const getMentalColor = (state: MentalState) => {
    switch (state) {
        case 'Normal': return 'text-green-600 dark:text-green-400';
        case 'Anxiety': return 'text-orange-500';
        case 'Trauma': return 'text-purple-500';
        case 'Despair': return 'text-blue-500';
        case 'Delusion': return 'text-pink-500';
        case 'Madness': return 'text-red-600 font-bold';
        default: return 'text-slate-500';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-100 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              🕯️ 생존자 심리 및 추모 기록
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              생존자들의 현재 감정 상태와 떠나간 이들에 대한 기억을 확인합니다.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
          {survivors.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <span className="text-4xl mb-2">🌫️</span>
                <p>기록할 생존자가 없습니다.</p>
            </div>
          ) : (
            survivors.map(char => {
                const isExpanded = expandedId === char.id;
                const hasGrief = char.griefLogs && char.griefLogs.length > 0;
                
                return (
                    <div key={char.id} className={`bg-white dark:bg-slate-900 rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                        {/* Accordion Header */}
                        <button 
                            onClick={() => toggleExpand(char.id)}
                            className="w-full flex items-center justify-between p-4 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${char.status === 'Zombie' ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                    {char.name.slice(0, 1)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        {char.name}
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                            char.mentalState === 'Normal' 
                                            ? 'bg-green-50 text-green-600 border-green-200' 
                                            : 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                                        }`}>
                                            {char.mentalState}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        {hasGrief ? `추모 기록 ${char.griefLogs.length}건` : '기록 없음'}
                                    </div>
                                </div>
                            </div>
                            <div className={`transition-transform duration-300 text-slate-400 ${isExpanded ? 'rotate-180' : ''}`}>
                                ▼
                            </div>
                        </button>

                        {/* Expanded Content */}
                        {isExpanded && (
                            <div className="px-4 pb-4 animate-fade-in">
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-4">
                                    
                                    {/* 1. Mental State Section */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">현재 감정 상태</h4>
                                        <p className={`text-sm font-medium ${getMentalColor(char.mentalState)}`}>
                                            "{getMentalDescription(char.mentalState, char.sanity)}"
                                        </p>
                                    </div>

                                    {/* 2. Grief Logs Section */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <span>🪦 떠난 이들을 위한 말</span>
                                            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                                        </h4>
                                        
                                        {hasGrief ? (
                                            <div className="space-y-2 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                                                {char.griefLogs.map((log, idx) => (
                                                    <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 italic relative pl-4">
                                                        <span className="absolute left-0 top-0 text-slate-300">"</span>
                                                        {log}
                                                        <span className="text-slate-300">"</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic text-center py-2">
                                                아직 가슴에 묻은 동료가 없습니다.
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default GriefModal;
