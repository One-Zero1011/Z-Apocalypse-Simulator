
import React from 'react';

interface Props {
  onClose: () => void;
  onSaveRoster: () => void;
  onLoadRoster: () => void;
  onSaveGame: () => void;
  onLoadGame: () => void;
  onNewGame: () => void;
  allowSameSex: boolean; 
  onToggleSameSex: () => void; 
  allowIncest: boolean; 
  onToggleIncest: () => void; 
  pureLoveMode: boolean; 
  onTogglePureLove: () => void; 
  developerMode: boolean; 
  onToggleDeveloperMode: () => void;
  useMentalStates: boolean;
  onToggleMentalStates: () => void;
  allowInteractions: boolean; 
  onToggleInteractions: () => void;
  enableStoryChoices: boolean;
  onToggleStoryChoices: () => void;
  enablePregnancy: boolean; // Added
  onTogglePregnancy: () => void; // Added
  onShowTutorial: () => void;
}

const SystemMenu: React.FC<Props> = ({ 
    onClose, 
    onSaveRoster, 
    onLoadRoster, 
    onSaveGame, 
    onLoadGame, 
    onNewGame,
    allowSameSex,
    onToggleSameSex,
    allowIncest,
    onToggleIncest,
    pureLoveMode,
    onTogglePureLove,
    developerMode,
    onToggleDeveloperMode,
    useMentalStates,
    onToggleMentalStates,
    allowInteractions, 
    onToggleInteractions,
    enableStoryChoices,
    onToggleStoryChoices,
    enablePregnancy, // Added
    onTogglePregnancy, // Added
    onShowTutorial
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            💾 시스템 메뉴
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Option: Settings */}
          <div className="space-y-3">
             <h3 className="text-sm font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
               게임 설정 (Settings)
             </h3>
             
             {/* Interaction Toggle */}
             <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">생존자 상호작용 (Interactions)</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        활성화 시 생존자들끼리 대화, 다툼, 연애 등 상호작용을 합니다.
                    </div>
                </div>
                <button 
                    onClick={onToggleInteractions}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${allowInteractions ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowInteractions ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                </button>
             </div>

             {/* Story Choices Toggle */}
             <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">스토리 선택지 (Interactive Story)</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        활성화 시 중요 분기점에서 직접 선택합니다. 끄면 확률에 따라 자동 진행됩니다.
                    </div>
                </div>
                <button 
                    onClick={onToggleStoryChoices}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${enableStoryChoices ? 'bg-yellow-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enableStoryChoices ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                </button>
             </div>

             {/* Pregnancy Toggle (New) */}
             <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">임신/출산 시스템 (Pregnancy)</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        활성화 시 부부 사이에서 아기 이벤트가 발생합니다. (꺼도 기존 아기는 유지됩니다)
                    </div>
                </div>
                <button 
                    onClick={onTogglePregnancy}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${enablePregnancy ? 'bg-pink-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enablePregnancy ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                </button>
             </div>

             {/* Same Sex Couples Toggle */}
             <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">동성 커플 허용</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">활성화 시 성별에 관계없이 연인이 될 수 있습니다.</div>
                </div>
                <button 
                    onClick={onToggleSameSex}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${allowSameSex ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowSameSex ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                </button>
             </div>

             {/* Allow Incest Toggle */}
             <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">근친(가족간 연애) 허용</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">활성화 시 가족 관계(부모/자식/형제)에서도 연인 관계가 발생할 수 있습니다.</div>
                </div>
                <button 
                    onClick={onToggleIncest}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${allowIncest ? 'bg-pink-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowIncest ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                </button>
             </div>

             {/* Pure Love Mode Toggle */}
             <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        순애 모드 (일부일처)
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        활성화 시 파트너가 있는 상태에서 다른 사람과 사귈 수 없습니다.
                    </div>
                </div>
                <button 
                    onClick={onTogglePureLove}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${pureLoveMode ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pureLoveMode ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                </button>
             </div>

             {/* Mental States Toggle */}
             <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">정신 상태 시스템</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">정신력 저하 시 불안정 상태(트라우마 등) 발생 및 특수 이벤트 활성화</div>
                </div>
                <button 
                    onClick={onToggleMentalStates}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${useMentalStates ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useMentalStates ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                </button>
             </div>

             {/* Developer Mode Toggle */}
             <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">개발자 모드</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">디버그 정보 표시 및 테스트 기능 활성화</div>
                </div>
                <button 
                    onClick={onToggleDeveloperMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zombie-green focus:ring-offset-2 ${developerMode ? 'bg-zombie-green' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                    <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${developerMode ? 'translate-x-6' : 'translate-x-1'}`} 
                    />
                </button>
             </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Option: Info & Support */}
          <div className="space-y-3">
             <h3 className="text-sm font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
               정보 (Info)
             </h3>
             <button
                onClick={onShowTutorial}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
             >
                <div className="text-left">
                    <div className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        튜토리얼 / 도움말
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        게임 방법과 팁을 다시 확인합니다.
                    </div>
                </div>
                <span className="text-2xl">💡</span>
             </button>

             <a 
                href="https://posty.pe/w1g6pe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
             >
                <div>
                    <div className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        개발자 공지 & 후원
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        업데이트 내역 확인 및 제작자 후원하기 (Postype)
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
             </a>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Option 0: New Game */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase text-red-600 dark:text-red-400 tracking-wider">
              새 게임 (New Game)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              현재 진행 상황을 <strong>모두 삭제하고 초기화</strong>합니다. 생존자 목록도 비워집니다.
            </p>
            <button
                onClick={onNewGame}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg font-bold transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                모든 데이터 초기화 및 새 게임 시작
            </button>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />
          
          {/* Option 1: Full Game Save */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              전체 게임 상태 (Full Save)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              현재 날짜, 인벤토리, 생존 일지, 캐릭터 상태 등 <strong>모든 진행 상황</strong>을 저장합니다. 나중에 이어서 플레이할 수 있습니다.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onSaveGame}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                게임 저장하기
              </button>
              <button
                onClick={onLoadGame}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg font-bold transition-colors shadow-sm"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" transform="rotate(180 12 12)"/>
                 </svg>
                이어하기 (Load)
              </button>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Option 2: Roster Save */}
          <div className="space-y-3">
             <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                생존자 명단 관리 (Roster Only)
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full font-bold">초기화됨</span>
             </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              현재 생존자들의 이름과 관계만 저장합니다. 불러올 때 <strong>모든 상태(체력, 날짜 등)가 1일차로 초기화</strong>됩니다. 새로운 게임을 시작할 때 유용합니다.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onSaveRoster}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                명단 내보내기
              </button>
              <button
                onClick={onLoadRoster}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-bold text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                명단 불러오기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMenu;
