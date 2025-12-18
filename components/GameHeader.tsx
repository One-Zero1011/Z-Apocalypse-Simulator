
import React from 'react';

interface Props {
    day: number;
    survivorsCount: number;
    totalCount: number;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    developerMode: boolean;
}

const GameHeader: React.FC<Props> = ({ 
    day, 
    survivorsCount, 
    totalCount, 
    darkMode, 
    setDarkMode, 
    developerMode
}) => {
    return (
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-300 dark:border-slate-700 pb-6">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-slate-800 dark:text-slate-100">
                        <span className="text-red-600">Z</span>-SIMULATOR 1.0.1v
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">MBTI 성격 기반 생존 시뮬레이터</p>
                </div>
                <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    title="다크 모드 전환"
                >
                    {darkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
                {developerMode && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">DEV MODE</span>
                )}
            </div>

            <div className="flex flex-wrap justify-end items-center gap-4">
                <div className="text-right pl-4 border-l border-slate-300 dark:border-slate-700 hidden sm:block">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">생존 일수</div>
                    <div className="text-3xl font-mono font-bold text-zombie-green">{day}</div>
                </div>
                <div className="text-right pl-4 border-l border-slate-300 dark:border-slate-700 hidden sm:block">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">생존자</div>
                    <div className="text-3xl font-mono font-bold text-slate-800 dark:text-white">{survivorsCount}/{totalCount}</div>
                </div>
            </div>
        </header>
    );
};

export default GameHeader;
