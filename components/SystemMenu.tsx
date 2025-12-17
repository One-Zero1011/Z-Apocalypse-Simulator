
import React, { useState } from 'react';

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
  restrictStudentDating: boolean;
  onToggleStudentDating: () => void;
  friendshipMode: boolean; // New
  onToggleFriendshipMode: () => void; // New
  // Added restrictMinorAdultActions and onToggleRestrictMinorAdultActions to Props
  restrictMinorAdultActions: boolean;
  onToggleRestrictMinorAdultActions: () => void;
  developerMode: boolean; 
  onToggleDeveloperMode: () => void;
  useMentalStates: boolean;
  onToggleMentalStates: () => void;
  allowInteractions: boolean; 
  onToggleInteractions: () => void;
  enableStoryChoices: boolean;
  onToggleStoryChoices: () => void;
  enablePregnancy: boolean; 
  onTogglePregnancy: () => void;
  showEventEffects: boolean; 
  onToggleEventEffects: () => void; 
  onShowTutorial: () => void;
}

type MenuTab = 'SETTINGS' | 'DATA' | 'INFO';

const ToggleItem: React.FC<{
    label: string;
    desc: string;
    checked: boolean;
    onChange: () => void;
    colorClass: string;
}> = ({ label, desc, checked, onChange, colorClass }) => (
    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <div className="flex-1 pr-4">
            <div className="font-bold text-sm text-slate-700 dark:text-slate-200">{label}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{desc}</div>
        </div>
        <button 
            onClick={onChange}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:ring-offset-slate-800 ${checked ? colorClass : 'bg-slate-300 dark:bg-slate-600'}`}
        >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
        </button>
    </div>
);

const SystemMenu: React.FC<Props> = ({ 
    onClose, 
    onSaveRoster, onLoadRoster, 
    onSaveGame, onLoadGame, onNewGame,
    allowSameSex, onToggleSameSex,
    allowIncest, onToggleIncest,
    pureLoveMode, onTogglePureLove,
    restrictStudentDating, onToggleStudentDating,
    friendshipMode, onToggleFriendshipMode,
    // Added restrictMinorAdultActions and onToggleRestrictMinorAdultActions to destructuring
    restrictMinorAdultActions, onToggleRestrictMinorAdultActions,
    developerMode, onToggleDeveloperMode,
    useMentalStates, onToggleMentalStates,
    allowInteractions, onToggleInteractions,
    enableStoryChoices, onToggleStoryChoices,
    enablePregnancy, onTogglePregnancy,
    showEventEffects, onToggleEventEffects, 
    onShowTutorial
}) => {
  const [activeTab, setActiveTab] = useState<MenuTab>('SETTINGS');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full h-[85vh] md:h-auto md:max-h-[85vh] overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            💾 시스템 메뉴
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
            {[
                { id: 'SETTINGS', label: '설정 (Settings)', icon: '⚙️' },
                { id: 'DATA', label: '데이터 (Data)', icon: '💾' },
                { id: 'INFO', label: '정보 (Info)', icon: 'ℹ️' }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as MenuTab)}
                    className={`flex-1 py-3 text-sm font-bold transition-all relative ${
                        activeTab === tab.id 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-700/50' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                    }`}
                >
                    <span className="mr-1">{tab.icon}</span> {tab.label}
                    {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 bg-white dark:bg-slate-800">
          
          {/* TAB: SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6">
                {/* 1. 관계 및 연애 */}
                <div>
                    <h3 className="text-xs font-bold uppercase text-pink-600 dark:text-pink-400 tracking-wider mb-3 flex items-center gap-2">
                        <span>💞</span> 관계 및 연애 설정
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <ToggleItem 
                            label="우정 모드 (No Romance)" 
                            desc="ON 설정 시 모든 캐릭터가 연애를 하지 않습니다." 
                            checked={friendshipMode} 
                            onChange={onToggleFriendshipMode} 
                            colorClass="bg-blue-600" 
                        />
                        <ToggleItem 
                            label="학생 연애 제한 (Age Restriction)" 
                            desc="초/중/고등학생은 학생끼리만 연인이 됩니다." 
                            checked={restrictStudentDating} 
                            onChange={onToggleStudentDating} 
                            colorClass="bg-teal-500" 
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ToggleItem 
                                label="동성 커플 허용" 
                                desc="성별 무관 연인이 됨" 
                                checked={allowSameSex} 
                                onChange={onToggleSameSex} 
                                colorClass="bg-blue-500" 
                            />
                            <ToggleItem 
                                label="순애 모드" 
                                desc="양다리/바람 방지" 
                                checked={pureLoveMode} 
                                onChange={onTogglePureLove} 
                                colorClass="bg-green-500" 
                            />
                            <ToggleItem 
                                label="임신/출산 시스템" 
                                desc="부부 사이 아기 탄생" 
                                checked={enablePregnancy} 
                                onChange={onTogglePregnancy} 
                                colorClass="bg-pink-500" 
                            />
                            <ToggleItem 
                                label="근친(가족간 연애)" 
                                desc="가족 관계 무시하고 연애" 
                                checked={allowIncest} 
                                onChange={onToggleIncest} 
                                colorClass="bg-pink-600" 
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-700" />

                {/* 2. 게임 시스템 */}
                <div>
                    <h3 className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider mb-3 flex items-center gap-2">
                        <span>🎮</span> 게임 플레이 시스템
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Added ToggleItem for restrictMinorAdultActions */}
                        <ToggleItem 
                            label="미성년자 부적절 행위 제한" 
                            desc="초/중/고등학생의 술/담배 관련 묘사를 순화합니다." 
                            checked={restrictMinorAdultActions} 
                            onChange={onToggleRestrictMinorAdultActions} 
                            colorClass="bg-orange-500" 
                        />
                        <ToggleItem 
                            label="정신 상태 시스템" 
                            desc="트라우마, 광기 등 상태이상" 
                            checked={useMentalStates} 
                            onChange={onToggleMentalStates} 
                            colorClass="bg-purple-600" 
                        />
                        <ToggleItem 
                            label="스토리 선택지" 
                            desc="중요 분기점 직접 선택" 
                            checked={enableStoryChoices} 
                            onChange={onToggleStoryChoices} 
                            colorClass="bg-yellow-500" 
                        />
                        <ToggleItem 
                            label="생존자 상호작용" 
                            desc="대화, 다툼 등 소셜 이벤트" 
                            checked={allowInteractions} 
                            onChange={onToggleInteractions} 
                            colorClass="bg-green-600" 
                        />
                    </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-700" />

                {/* 3. 표시 및 기타 */}
                <div>
                    <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3 flex items-center gap-2">
                        <span>👁️</span> 표시 및 기타
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ToggleItem 
                            label="이벤트 효과 수치 표시" 
                            desc="텍스트 뒤에 (❤️+10) 등 표시" 
                            checked={showEventEffects} 
                            onChange={onToggleEventEffects} 
                            colorClass="bg-indigo-500" 
                        />
                        <ToggleItem 
                            label="개발자 모드" 
                            desc="디버그 메뉴 및 치트 활성화" 
                            checked={developerMode} 
                            onChange={onToggleDeveloperMode} 
                            colorClass="bg-red-500" 
                        />
                    </div>
                </div>
            </div>
          )}

          {/* TAB: DATA */}
          {activeTab === 'DATA' && (
            <div className="space-y-6">
                
                {/* Save/Load Game */}
                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">전체 게임 상태 (Full Save)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">현재 진행 중인 날짜, 인벤토리, 모든 캐릭터 상태를 저장합니다.</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onSaveGame} className="flex items-center justify-center gap-2 px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                            파일로 저장
                        </button>
                        <button onClick={onLoadGame} className="flex items-center justify-center gap-2 px-3 py-3 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-500 rounded-lg font-bold text-sm transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" transform="rotate(180 12 12)"/></svg>
                            불러오기
                        </button>
                    </div>
                </div>

                {/* Roster Save */}
                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
                        생존자 명단 관리 <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded font-normal">초기화됨</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">현재 캐릭터들의 이름과 관계만 저장합니다. 불러올 때 1일차로 초기화됩니다.</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onSaveRoster} className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-sm transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            명단 내보내기
                        </button>
                        <button onClick={onLoadRoster} className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-bold text-sm transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                            명단 불러오기
                        </button>
                    </div>
                </div>

                <hr className="border-slate-200 dark:border-slate-700" />

                {/* New Game */}
                <div>
                    <button
                        onClick={onNewGame}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg font-bold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        모든 데이터 삭제 및 새 게임
                    </button>
                </div>
            </div>
          )}

          {/* TAB: INFO */}
          {activeTab === 'INFO' && (
            <div className="space-y-4">
                <div className="text-center py-6">
                    <div className="text-4xl mb-2">🧟</div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Z-SIMULATOR</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">MBTI Survival Simulation</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-1">
                    <button
                        onClick={onShowTutorial}
                        className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors group"
                    >
                        <div className="text-left">
                            <div className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                💡 튜토리얼 다시 보기
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                게임 방법과 생존 팁을 확인합니다.
                            </div>
                        </div>
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-slate-600 mx-4"></div>
                    <a 
                        href="https://posty.pe/w1g6pe" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors group"
                    >
                        <div className="text-left">
                            <div className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                📢 개발자 노트 & 후원
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                업데이트 내역 확인 및 제작자 후원 (Postype)
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-blue-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                </div>

                <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
                    <p>Version 0.4.2</p>
                    <p>Created by 김먁먁</p>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SystemMenu;
