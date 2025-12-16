
import React, { useState, useEffect } from 'react';
import { StoryNode, Character, StoryRequirement } from '../types';

interface Props {
    node: StoryNode;
    onSelect: (nextId: string, choiceText: string) => void;
    currentSelection: { id: string, text: string } | null;
    characters: Character[]; // Added
    inventory: string[]; // Added
}

const StoryChoiceModal: React.FC<Props> = ({ node, onSelect, currentSelection, characters, inventory }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    // If a selection is already made, default to minimized state
    useEffect(() => {
        if (currentSelection) {
            setIsMinimized(true);
        } else {
            setIsMinimized(false);
        }
    }, [currentSelection]);

    // Requirements Checker
    const checkRequirement = (req?: StoryRequirement) => {
        if (!req) return { met: true, reason: null };

        if (req.job) {
            // Check if any ALIVE character has the job
            const hasJob = characters.some(c => c.job === req.job && (c.status === 'Alive' || c.status === 'Infected'));
            if (!hasJob) return { met: false, reason: `직업 [${req.job}] 필요` };
        }

        if (req.item) {
            const hasItem = inventory.includes(req.item);
            if (!hasItem) return { met: false, reason: `아이템 [${req.item}] 필요` };
        }

        if (req.minSurvivors) {
            const livingCount = characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing').length;
            if (livingCount < req.minSurvivors) return { met: false, reason: `생존자 ${req.minSurvivors}명 이상 필요` };
        }

        return { met: true, reason: null };
    };

    // Minimized View (Sticky Corner)
    if (isMinimized && currentSelection) {
        return (
            <div className="fixed z-50 animate-bounce-in bottom-24 right-4 md:bottom-10 md:right-auto md:left-10">
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-zombie-green rounded-lg shadow-lg p-3 max-w-[200px] flex flex-col gap-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">다음 행동 선택됨</div>
                    <div className="font-bold text-sm text-zombie-green truncate">{currentSelection.text}</div>
                    <button 
                        onClick={() => setIsMinimized(false)}
                        className="text-xs text-blue-500 underline text-left mt-1"
                    >
                        다시 선택하기
                    </button>
                </div>
            </div>
        );
    }

    // Full Modal View
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                
                {/* Header Image or Icon Placeholder */}
                <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center">
                    <span className="text-4xl">🤔</span>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <span className="text-red-500 animate-pulse">●</span> 중요한 결정 (Decision)
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic border-l-4 border-slate-300 dark:border-slate-600 pl-3">
                        "{node.text}"
                    </p>

                    <div className="space-y-3">
                        {node.next?.map((option, idx) => {
                            const { met, reason } = checkRequirement(option.req);
                            const isSelected = currentSelection?.id === option.id;
                            const isSpecial = !!option.req; // Highlight requirements

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (met) {
                                            onSelect(option.id, option.choiceText || '');
                                            setIsMinimized(true);
                                        }
                                    }}
                                    disabled={!met}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all group relative overflow-hidden flex justify-between items-center ${
                                        isSelected 
                                        ? 'border-zombie-green bg-green-50 dark:bg-green-900/20' 
                                        : !met
                                            ? 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 opacity-70 cursor-not-allowed grayscale'
                                            : isSpecial
                                                ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800'
                                    }`}
                                >
                                    <div className="relative z-10 flex flex-col">
                                        <span className={`font-bold ${isSelected ? 'text-zombie-green' : !met ? 'text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {option.choiceText || "이동"}
                                        </span>
                                        {!met && (
                                            <span className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                                                🔒 {reason}
                                            </span>
                                        )}
                                        {met && isSpecial && (
                                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">
                                                ✨ 조건 충족!
                                            </span>
                                        )}
                                    </div>
                                    
                                    {isSelected && (
                                        <span className="bg-zombie-green text-white text-[10px] px-2 py-1 rounded-full font-bold relative z-10">V</span>
                                    )}
                                    {!met && (
                                        <span className="text-slate-400 text-xl relative z-10">🔒</span>
                                    )}
                                    
                                    {/* Hover Effect */}
                                    <div className={`absolute inset-0 transform origin-left transition-transform duration-300 ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} ${isSpecial ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-blue-50 dark:bg-blue-900/10'}`}></div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3 text-center border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400">선택 후 '다음 날' 버튼을 눌러 진행하세요.</p>
                </div>
            </div>
        </div>
    );
};

export default StoryChoiceModal;
