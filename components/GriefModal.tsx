
import React from 'react';
import { Character } from '../types';

interface Props {
  character: Character;
  onClose: () => void;
}

const GriefModal: React.FC<Props> = ({ character, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="bg-red-700 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🕯️ {character.name}의 추모록
          </h2>
          <p className="text-sm opacity-90 mt-1">떠난 이들을 기억하며...</p>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
          {character.griefLogs && character.griefLogs.length > 0 ? (
            <div className="space-y-3">
              {character.griefLogs.map((log, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/20 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{log}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center">
              <span className="text-5xl mb-4 grayscale opacity-30">🕊️</span>
              <p className="text-slate-400 dark:text-slate-500 text-sm">아직 소중한 동료를 잃지 않았습니다.<br/>평화가 지속되길 바랍니다.</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <div className="mb-4 px-2">
            <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">현재 감정 상태</h4>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {character.mentalState === 'Despair' ? '깊은 절망 속에 침잠함' : 
               character.mentalState === 'Trauma' ? '사고의 충격에서 벗어나지 못함' :
               character.sanity < 30 ? '극도로 불안정하고 위태로움' : '떠난 이들을 가슴에 묻고 견디는 중'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
          >
            기록 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GriefModal;
