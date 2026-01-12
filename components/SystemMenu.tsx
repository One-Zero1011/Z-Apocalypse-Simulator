
import React, { useState } from 'react';
import { GameSettings } from '../types';

interface Props {
  onClose: () => void;
  onSaveRoster: () => void;
  onLoadRoster: () => void;
  onSaveGame: () => void;
  onLoadGame: () => void;
  onNewGame: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onShowTutorial: () => void;
  onShowCustomEvents: () => void; // New Prop
}

type TabType = 'SETTINGS' | 'DATA' | 'INFO';

const ToggleSwitch: React.FC<{ 
    label: string; 
    desc: string; 
    checked: boolean; 
    onChange: () => void;
    colorClass?: string;
}> = ({ label, desc, checked, onChange, colorClass = "bg-blue-500" }) => (
    <div 
        onClick={onChange}
        className="flex flex-col p-4 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors select-none group"
    >
        <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</span>
            <div 
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? colorClass : 'bg-slate-300 dark:bg-slate-600'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{desc}</p>
    </div>
);

const SystemMenu: React.FC<Props> = ({ 
    onClose, 
    onSaveRoster, onLoadRoster, 
    onSaveGame, onLoadGame, onNewGame,
    settings,
    onUpdateSettings,
    onShowTutorial,
    onShowCustomEvents
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('SETTINGS');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full h-[85vh] md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                💾 시스템 설정 (System Config)
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
            {[
                { id: 'SETTINGS', label: '⚙️ 게임 설정' },
                { id: 'DATA', label: '💾 데이터 관리' },
                { id: 'INFO', label: 'ℹ️ 정보' }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex-1 py-3 text-sm font-bold transition-all relative ${
                        activeTab === tab.id 
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
                        : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
            
            {activeTab === 'SETTINGS' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Section 1: Relationships */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-pink-500 text-lg">💞</span>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">관계 및 연애</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ToggleSwitch 
                                label="우정 모드 (No Romance)" 
                                desc="ON: 연애 관련 이벤트(고백, 이별, 결혼 등)가 발생하지 않습니다." 
                                checked={settings.friendshipMode} 
                                onChange={() => onUpdateSettings({ friendshipMode: !settings.friendshipMode })}
                                colorClass="bg-slate-500"
                            />
                            <ToggleSwitch 
                                label="순애 모드 (Pure Love)" 
                                desc="ON: 양다리, 불륜, 환승 이별 등 복잡한 관계를 방지합니다." 
                                checked={settings.pureLoveMode} 
                                onChange={() => onUpdateSettings({ pureLoveMode: !settings.pureLoveMode })}
                                colorClass="bg-pink-400"
                            />
                            <ToggleSwitch 
                                label="학생 연애 제한 (School Life)" 
                                desc="ON: 학생(초/중/고)은 학생끼리만 연인이 됩니다." 
                                checked={settings.restrictStudentDating} 
                                onChange={() => onUpdateSettings({ restrictStudentDating: !settings.restrictStudentDating })}
                                colorClass="bg-zombie-green"
                            />
                            <ToggleSwitch 
                                label="이성 커플 허용" 
                                desc="ON: 남성-여성 간의 고백 이벤트를 허용합니다." 
                                checked={settings.allowOppositeSexCouples} 
                                onChange={() => onUpdateSettings({ allowOppositeSexCouples: !settings.allowOppositeSexCouples })}
                                colorClass="bg-blue-600"
                            />
                            <ToggleSwitch 
                                label="동성 커플 허용" 
                                desc="ON: 동성 간의 고백 이벤트를 허용합니다." 
                                checked={settings.allowSameSexCouples} 
                                onChange={() => onUpdateSettings({ allowSameSexCouples: !settings.allowSameSexCouples })}
                                colorClass="bg-purple-500"
                            />
                            <ToggleSwitch 
                                label="근친(가족간 연애)" 
                                desc="ON: 가족 관계에서도 연인이 될 수 있습니다. (주의)" 
                                checked={settings.allowIncest} 
                                onChange={() => onUpdateSettings({ allowIncest: !settings.allowIncest })}
                                colorClass="bg-red-500"
                            />
                            <div className="sm:col-span-2 space-y-2 pt-2">
                                <ToggleSwitch 
                                    label="임신/출산 시스템" 
                                    desc="ON: 부부 관계에서 확률적으로 아기가 태어납니다." 
                                    checked={settings.enablePregnancy} 
                                    onChange={() => onUpdateSettings({ enablePregnancy: !settings.enablePregnancy })}
                                    colorClass="bg-pink-500"
                                />
                                {settings.enablePregnancy && (
                                    <div className="ml-2 px-4 py-3 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-900/30 animate-fade-in">
                                        <div className="flex justify-between text-xs font-bold text-pink-600 dark:text-pink-400 mb-2">
                                            <span>일일 임신 확률 설정</span>
                                            <span>{settings.pregnancyChance}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="100" step="1"
                                            value={settings.pregnancyChance}
                                            onChange={(e) => onUpdateSettings({ pregnancyChance: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-pink-200 dark:bg-pink-900/50 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Gameplay */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400 text-lg">🎮</span>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">게임 플레이</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ToggleSwitch 
                                label="미성년자 보호 모드" 
                                desc="ON: 미성년자의 음주/흡연 묘사를 순화합니다." 
                                checked={settings.restrictMinorAdultActions} 
                                onChange={() => onUpdateSettings({ restrictMinorAdultActions: !settings.restrictMinorAdultActions })}
                                colorClass="bg-orange-500"
                            />
                            <ToggleSwitch 
                                label="정신 상태(Sanity) 시스템" 
                                desc="ON: 정신력 저하 시 트라우마, 광기 등 상태이상이 발생합니다." 
                                checked={settings.useMentalStates} 
                                onChange={() => onUpdateSettings({ useMentalStates: !settings.useMentalStates })}
                                colorClass="bg-purple-600"
                            />
                            <ToggleSwitch 
                                label="스토리 선택지" 
                                desc="ON: 중요 분기점에서 유저가 행동을 직접 선택합니다." 
                                checked={settings.enableStoryChoices} 
                                onChange={() => onUpdateSettings({ enableStoryChoices: !settings.enableStoryChoices })}
                                colorClass="bg-amber-500"
                            />
                            <ToggleSwitch 
                                label="생존자 상호작용" 
                                desc="ON: 생존자들 간의 대화, 다툼 등 상호작용 이벤트가 발생합니다." 
                                checked={settings.enableInteractions} 
                                onChange={() => onUpdateSettings({ enableInteractions: !settings.enableInteractions })}
                                colorClass="bg-green-600"
                            />
                        </div>
                    </section>

                    {/* Section 3: Misc */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400 text-lg">👁️</span>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">기타 설정</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ToggleSwitch 
                                label="이벤트 효과 수치 표시" 
                                desc="ON: 텍스트 뒤에 (❤️+10, 🧠-5) 등의 수치를 표시합니다." 
                                checked={settings.showEventEffects} 
                                onChange={() => onUpdateSettings({ showEventEffects: !settings.showEventEffects })}
                                colorClass="bg-blue-400"
                            />
                            <ToggleSwitch 
                                label="개발자 모드 (Cheat)" 
                                desc="ON: 강제 이벤트 실행, 스탯 조작 등이 가능한 메뉴를 활성화합니다." 
                                checked={settings.developerMode} 
                                onChange={() => onUpdateSettings({ developerMode: !settings.developerMode })}
                                colorClass="bg-red-600"
                            />
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'DATA' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-1">전체 게임 상태 (Full Save)</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">현재 진행 중인 날짜, 인벤토리, 모든 캐릭터 상태를 파일로 저장하거나 불러옵니다.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={onSaveGame} className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75z" /></svg>
                                파일로 저장
                            </button>
                            <button onClick={onLoadGame} className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                                불러오기
                            </button>
                        </div>
                    </div>

                    <div className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">생존자 명단 관리 (Roster)</h4>
                            <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">초기화됨</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">현재 캐릭터들의 이름과 관계만 저장합니다. 불러올 때 1일차로 초기화됩니다.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={onSaveRoster} className="flex items-center justify-center gap-2 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold transition-all active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                                명단 내보내기
                            </button>
                            <button onClick={onLoadRoster} className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
                                명단 불러오기
                            </button>
                        </div>
                    </div>

                    <div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400">커스텀 이벤트 관리 (Modding)</h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">나만의 이벤트를 만들거나 파일을 불러와 게임에 적용합니다.</p>
                        <button onClick={onShowCustomEvents} className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                            이벤트 제작 및 관리
                        </button>
                    </div>

                    <button
                        onClick={onNewGame}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-black transition-all active:scale-[0.98]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        모든 데이터 삭제 및 새 게임
                    </button>
                </div>
            )}

            {activeTab === 'INFO' && (
                <div className="flex flex-col items-center py-10 animate-fade-in text-center">
                    <div className="text-7xl mb-6 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">🧟</div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter mb-1">Z-SIMULATOR</h3>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">MBTI Survival Simulation</p>
                    
                    <div className="w-full max-w-sm space-y-3">
                        <button
                            onClick={onShowTutorial}
                            className="w-full flex flex-col p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all group"
                        >
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-blue-600">💡 튜토리얼 다시 보기</span>
                            <span className="text-[11px] text-slate-400 mt-1">게임 방법과 생존 팁을 확인합니다.</span>
                        </button>
                        
                        <a 
                            href="https://posty.pe/w1g6pe" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-red-500 transition-all group"
                        >
                            <div className="text-left">
                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-red-500">📢 개발자 노트 & 후원</span>
                                <p className="text-[11px] text-slate-400 mt-1">업데이트 내역 확인 및 제작자 후원 (Postype)</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-slate-300 group-hover:text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                        </a>
                    </div>

                    <div className="mt-12 text-[10px] font-bold text-slate-400 flex flex-col gap-1">
                        <span>Version 1.2.0</span>
                        <span>Created by 김먁먁</span>
                    </div>
                </div>
            )}

        </div>

        {/* Footer Hint */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">System Control Unit • Beta Stable Build</p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}} />
    </div>
  );
};

export default SystemMenu;
