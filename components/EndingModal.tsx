
import React from 'react';
import { Ending } from '../types';

interface Props {
    ending: Ending;
    onClose: () => void;
    day: number;
}

const EndingModal: React.FC<Props> = ({ ending, onClose, day }) => {
    const getTypeStyles = () => {
        switch (ending.type) {
            case 'GOOD': return 'from-green-500/20 to-blue-500/20 border-blue-400 text-blue-400';
            case 'BAD': return 'from-red-900/40 to-black/60 border-red-600 text-red-600';
            case 'SPECIAL': return 'from-purple-500/20 to-amber-500/20 border-amber-400 text-amber-400';
            default: return 'from-slate-700/20 to-slate-900/20 border-slate-500 text-slate-400';
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-fade-in">
            <div className={`relative max-w-2xl w-full rounded-3xl border-2 overflow-hidden bg-gradient-to-b shadow-2xl p-8 md:p-12 text-center transition-all ${getTypeStyles()}`}>
                
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] leading-none select-none">
                        {ending.icon}
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="text-xs uppercase tracking-[0.3em] font-mono text-slate-500 mb-4">
                        Simulation Terminated - Day {day}
                    </div>
                    
                    <div className="text-7xl mb-8 animate-bounce-slow">
                        {ending.icon}
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
                        {ending.title}
                    </h2>

                    <div className="h-px w-24 bg-current mx-auto mb-8 opacity-30"></div>

                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-12 italic font-serif">
                        "{ending.description}"
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button 
                            onClick={onClose}
                            className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            기록 확인 및 계속하기
                        </button>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-10 py-4 bg-slate-800 text-white font-bold rounded-full border border-slate-700 hover:bg-slate-700 transition-all"
                        >
                            새 시뮬레이션 시작
                        </button>
                    </div>
                </div>

                {/* Frame Decoration */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-current opacity-40"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-current opacity-40"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-current opacity-40"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-current opacity-40"></div>
            </div>
        </div>
    );
};

export default EndingModal;
