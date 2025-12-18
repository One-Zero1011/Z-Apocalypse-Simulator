
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Character, DiceChallenge, Stats } from '../types';

interface Props {
    challenge: DiceChallenge;
    characters: Character[];
    choiceText: string;
    onComplete: (isSuccess: boolean, selectedCharId: string) => void;
}

const DiceRollModal: React.FC<Props> = ({ challenge, characters, choiceText, onComplete }) => {
    const [step, setStep] = useState<'PICK' | 'ROLL' | 'RESULT'>('PICK');
    const [selectedCharId, setSelectedCharId] = useState<string>('');
    const [isRolling, setIsRolling] = useState(false);
    const [isFast, setIsFast] = useState(false); 
    
    // 타임아웃 제어를 위한 Ref
    const timerRef = useRef<number | null>(null);
    
    // 결과값
    const [tensResult, setTensResult] = useState(0); 
    const [unitsResult, setUnitsResult] = useState(0); 
    const [diceValue, setDiceValue] = useState(0);

    // 룰렛 아이템 높이 설정 (컨테이너 높이와 일치시켜야 함)
    const ITEM_HEIGHT = 200; 

    const livingChars = useMemo(() => 
        characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing'),
    [characters]);

    const selectedChar = livingChars.find(c => c.id === selectedCharId);
    const statModifier = selectedChar ? (selectedChar.stats[challenge.stat] || 0) * 5 : 0;
    const finalScore = diceValue + statModifier;
    const isSuccess = finalScore >= challenge.threshold;

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const getStatName = (stat: keyof Stats) => {
        switch(stat) {
            case 'str': return 'STR';
            case 'agi': return 'AGI';
            case 'con': return 'CON';
            case 'int': return 'INT';
            case 'cha': return 'CHA';
            default: return (stat as string).toUpperCase();
        }
    };

    const stopRolling = (fast: boolean = false) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        
        setIsFast(fast);
        // setIsRolling(false)는 하지 않음 (CSS transition 유지)
        
        // 결과 표시 딜레이
        const delay = fast ? 200 : 3500; // fast면 즉시, 아니면 transition 끝날 때쯤
        timerRef.current = window.setTimeout(() => setStep('RESULT'), delay);
    };

    const handleStartRoll = () => {
        setStep('ROLL');
        setIsFast(false);
        
        // 결과 미리 결정
        const tIdx = Math.floor(Math.random() * 10);
        const uIdx = Math.floor(Math.random() * 10);
        let total = (tIdx * 10) + uIdx;
        if (total === 0) total = 100;

        setTensResult(tIdx);
        setUnitsResult(uIdx);
        setDiceValue(total);

        // 약간의 딜레이 후 굴리기 시작 (DOM 렌더링 확보)
        setTimeout(() => {
            setIsRolling(true);
            // 자연스럽게 멈추기 시작
            timerRef.current = window.setTimeout(() => {
                stopRolling(false);
            }, 100); 
        }, 50);
    };

    const handleSkip = () => {
        if (step === 'ROLL' && !isFast) {
            stopRolling(true);
        }
    };

    // 긴 숫자 띠 생성 (0~9를 30번 반복)
    const LOOP_COUNT = 30;
    const baseArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const tensStrip = Array(LOOP_COUNT).fill(baseArray).flat().map(n => n * 10);
    const unitsStrip = Array(LOOP_COUNT).fill(baseArray).flat();

    // 목표 위치: (마지막 세트 - 5) 쯤의 결과값 위치
    // 예를 들어, 30세트 중 25번째 세트의 결과값 위치로 이동
    const TARGET_SET_INDEX = 25; 
    
    // 릴 스타일 계산
    const getReelStyle = (resultIndex: number) => {
        if (!isRolling) return { transform: 'translateY(0px)' };
        
        // 이동해야 할 총 인덱스 수
        const targetIndex = (TARGET_SET_INDEX * 10) + resultIndex;
        // 픽셀 단위 이동 거리 계산
        const translatePx = targetIndex * ITEM_HEIGHT;
        
        return {
            transform: `translateY(-${translatePx}px)`,
            transitionProperty: 'transform',
            transitionDuration: isFast ? '200ms' : '3500ms',
            transitionTimingFunction: isFast ? 'linear' : 'cubic-bezier(0.25, 1, 0.5, 1)' // 감속 효과
        };
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-200/50 dark:bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans transition-colors duration-300">
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                
                {step === 'PICK' && (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-bounce-in border border-gray-100 dark:border-slate-700 transition-colors duration-300">
                        {/* Header */}
                        <div className="bg-gray-50 dark:bg-slate-900/50 p-6 text-center border-b border-gray-100 dark:border-slate-700">
                            <h3 className="text-slate-800 dark:text-white font-bold text-xl tracking-tight">확률 판정</h3>
                            <div className="flex justify-center items-center gap-4 mt-3 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">Stat</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">{getStatName(challenge.stat)}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">Target</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-black">{challenge.threshold}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="text-center px-4">
                                <p className="text-slate-600 dark:text-slate-300 font-medium text-lg leading-relaxed">"{choiceText}"</p>
                            </div>

                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                <p className="text-xs font-bold text-slate-400 uppercase ml-1">주사위를 굴릴 생존자 선택</p>
                                {livingChars.map(char => (
                                    <button
                                        key={char.id}
                                        onClick={() => setSelectedCharId(char.id)}
                                        className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                                            selectedCharId === char.id 
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-md transform scale-[1.02]' 
                                            : 'bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                                                selectedCharId === char.id ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
                                            }`}>
                                                {char.name.slice(0, 1)}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-sm">{char.name}</div>
                                                <div className="text-[10px] opacity-70 uppercase">{char.job}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 font-mono font-bold text-lg">
                                            <span className="text-xs text-slate-400 font-sans">보너스</span>
                                            <span className={selectedCharId === char.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                                                +{char.stats[challenge.stat] * 5}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleStartRoll}
                                disabled={!selectedCharId}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl shadow-lg transition-all transform active:scale-[0.98]"
                            >
                                주사위 굴리기
                            </button>
                        </div>
                    </div>
                )}

                {(step === 'ROLL' || step === 'RESULT') && (
                    <div className="flex flex-col items-center justify-center w-full min-h-[400px] animate-fade-in">
                        
                        {/* Status Label */}
                        <div className={`mb-8 transition-all duration-500 ${step === 'RESULT' ? 'opacity-50 scale-90' : 'opacity-100'}`}>
                            <div className="px-4 py-1 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${step === 'ROLL' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                {step === 'ROLL' ? 'Calculating...' : 'Completed'}
                            </div>
                        </div>

                        {/* Modern Slot Machine Container */}
                        <div 
                            className="relative p-4 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-gray-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-transform"
                            onClick={handleSkip}
                            title="클릭하여 결과 즉시 확인"
                        >
                            {/* Inner Frame with Fixed Height */}
                            <div className="flex gap-2 p-4 bg-gray-100 dark:bg-slate-950 rounded-[2rem] border-inner relative overflow-hidden h-[200px]">
                                
                                {/* Center Highlight Line */}
                                <div className="absolute top-1/2 left-0 w-full h-[60px] -translate-y-1/2 bg-white/50 dark:bg-white/5 border-y border-indigo-500/30 z-10 pointer-events-none backdrop-blur-[1px]"></div>
                                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-indigo-500 border-y-[6px] border-y-transparent z-20"></div>
                                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-r-[8px] border-r-transparent border-l-[8px] border-l-indigo-500 border-y-[6px] border-y-transparent z-20"></div>

                                {/* Reel 1 (Tens) */}
                                <div className="relative w-28 h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-slate-800">
                                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white dark:from-slate-900 to-transparent z-10"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10"></div>
                                    
                                    <div 
                                        className="flex flex-col items-center w-full"
                                        style={getReelStyle(tensResult)}
                                    >
                                        {tensStrip.map((val, i) => (
                                            <div key={`t-${i}`} className="flex items-center justify-center text-5xl font-black text-slate-800 dark:text-slate-100 shrink-0 font-mono w-full" style={{ height: `${ITEM_HEIGHT}px` }}>
                                                {val === 0 ? '00' : val}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reel 2 (Units) */}
                                <div className="relative w-28 h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-slate-800">
                                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white dark:from-slate-900 to-transparent z-10"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10"></div>

                                    <div 
                                        className="flex flex-col items-center w-full"
                                        style={getReelStyle(unitsResult)}
                                    >
                                        {unitsStrip.map((val, i) => (
                                            <div key={`u-${i}`} className="flex items-center justify-center text-5xl font-black text-indigo-600 dark:text-indigo-400 shrink-0 font-mono w-full" style={{ height: `${ITEM_HEIGHT}px` }}>
                                                {val}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {(step === 'ROLL' && !isFast) && (
                            <div className="mt-4 text-xs text-slate-400 animate-pulse cursor-pointer" onClick={handleSkip}>
                                터치하여 결과 확인 (Skip)
                            </div>
                        )}

                        {/* Result Card */}
                        {step === 'RESULT' && (
                            <div className="mt-8 animate-bounce-in w-full max-w-xs">
                                <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-xl border-2 transition-colors ${
                                    isSuccess ? 'border-green-500 shadow-green-500/20' : 'border-red-500 shadow-red-500/20'
                                }`}>
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                                        <span>주사위: {diceValue}</span>
                                        <span>+ 보너스: {statModifier}</span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest mb-1">Total Score</div>
                                        <div className={`text-6xl font-black font-mono tracking-tighter ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {finalScore}
                                        </div>
                                    </div>

                                    <div className={`py-3 px-4 rounded-xl font-bold text-lg mb-4 ${
                                        isSuccess 
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                    }`}>
                                        {isSuccess ? '판정 성공' : '판정 실패'}
                                    </div>

                                    <button
                                        onClick={() => onComplete(isSuccess, selectedCharId)}
                                        className="w-full py-3 bg-slate-900 hover:bg-slate-700 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold rounded-xl transition-colors shadow-md"
                                    >
                                        결과 확인
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
            `}} />
        </div>
    );
};

export default DiceRollModal;
