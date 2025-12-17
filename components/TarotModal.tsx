
import React, { useState, useEffect } from 'react';
import { CharacterUpdate } from '../types';

interface TarotCard {
    id: string;
    name: string;
    icon: string;
    desc: string;
    effect: (charIds: string[]) => CharacterUpdate[];
}

interface Props {
    livingCharIds: string[];
    onResult: (updates: CharacterUpdate[], log: string) => void;
}

const TAROT_CARDS: TarotCard[] = [
    {
        id: 'death',
        name: '사망 (Death)',
        icon: '💀',
        desc: '과거의 끝과 새로운 시작. 모든 생존자의 정신력이 회복되지만, 체력이 크게 깎입니다.',
        effect: (ids) => ids.map(id => ({ id, hpChange: -20, sanityChange: 15 }))
    },
    {
        id: 'lovers',
        name: '연인 (The Lovers)',
        icon: '❤️',
        desc: '강한 유대. 모든 생존자 간의 호감도가 크게 상승합니다.',
        effect: (ids) => ids.map(id => ({ 
            id, 
            relationshipUpdates: ids.filter(other => other !== id).map(targetId => ({ targetId, change: 15 }))
        }))
    },
    {
        id: 'tower',
        name: '탑 (The Tower)',
        icon: '🏰',
        desc: '갑작스러운 붕괴. 재난이 닥쳐 모든 생존자가 부상을 입고 물자를 잃습니다.',
        effect: (ids) => ids.map(id => ({ id, hpChange: -30, fatigueChange: 20 }))
    },
    {
        id: 'star',
        name: '별 (The Star)',
        icon: '⭐',
        desc: '희망의 빛. 생존자들의 정신력이 대폭 회복되고 피로가 가십니다.',
        effect: (ids) => ids.map(id => ({ id, sanityChange: 30, fatigueChange: -30 }))
    },
    {
        id: 'wheel',
        name: '운명의 수레바퀴',
        icon: '🎡',
        desc: '알 수 없는 변화. 감염도가 무작위로 변동됩니다.',
        effect: (ids) => ids.map(id => ({ id, infectionChange: Math.random() > 0.5 ? -20 : 10 }))
    },
    {
        id: 'sun',
        name: '태양 (The Sun)',
        icon: '☀️',
        desc: '생명력의 축복. 모든 생존자의 체력이 대폭 회복됩니다.',
        effect: (ids) => ids.map(id => ({ id, hpChange: 40 }))
    }
];

const TarotModal: React.FC<Props> = ({ livingCharIds, onResult }) => {
    const [isFanned, setIsFanned] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);

    useEffect(() => {
        // 셔플 및 3장 선택
        const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random()).slice(0, 3);
        setShuffledCards(shuffled);
        
        // 뭉쳐있다가 0.5초 뒤에 펼쳐짐
        const timer = setTimeout(() => setIsFanned(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCardClick = (idx: number) => {
        if (selectedIdx !== null) return;
        setSelectedIdx(idx);
        
        const card = shuffledCards[idx];
        const updates = card.effect(livingCharIds);
        
        setTimeout(() => {
            onResult(updates, `🔮 [타로] '${card.name}' 카드를 뽑았습니다. ${card.desc}`);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 animate-fade-in">
            <div className="max-w-lg w-full text-center">
                <h2 className="text-3xl font-bold text-purple-400 mb-2 font-mono tracking-widest uppercase">Tarot of Fate</h2>
                <p className="text-slate-400 text-sm mb-12">운명의 카드를 한 장 선택하세요...</p>

                <div className="relative h-64 flex justify-center items-center">
                    {shuffledCards.map((card, i) => {
                        // 펼쳐지는 각도 계산
                        const angle = isFanned ? (i - 1) * 20 : 0;
                        const xOffset = isFanned ? (i - 1) * 90 : 0;
                        const yOffset = isFanned ? Math.abs(i - 1) * 10 : 0;
                        const isSelected = selectedIdx === i;

                        return (
                            <button
                                key={i}
                                onClick={() => handleCardClick(i)}
                                disabled={selectedIdx !== null}
                                className={`absolute w-40 h-60 rounded-xl border-2 transition-all duration-700 transform cursor-pointer
                                    ${isSelected 
                                        ? 'z-50 scale-110 -translate-y-12 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] bg-slate-800' 
                                        : 'z-10 border-purple-500/50 shadow-2xl bg-slate-900 hover:border-purple-400'
                                    }
                                    ${selectedIdx !== null && !isSelected ? 'opacity-0 scale-75' : 'opacity-100'}
                                `}
                                style={{
                                    transform: isSelected 
                                        ? `translateY(-40px) scale(1.1)` 
                                        : `rotate(${angle}deg) translateX(${xOffset}px) translateY(${yOffset}px)`,
                                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                            >
                                <div className="h-full w-full flex flex-col items-center justify-center p-4">
                                    {/* 뒷면 또는 앞면 표시 */}
                                    {selectedIdx === i ? (
                                        <div className="animate-flip-in">
                                            <div className="text-5xl mb-4">{card.icon}</div>
                                            <div className="text-lg font-bold text-white mb-1">{card.name}</div>
                                            <div className="text-[10px] text-slate-400 leading-tight">{card.desc}</div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center opacity-40">
                                            <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 mb-2 flex items-center justify-center">
                                                <div className="w-6 h-6 rounded-full border border-purple-500/20"></div>
                                            </div>
                                            <div className="text-[8px] uppercase tracking-tighter text-purple-300">Fate</div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* 테두리 장식 */}
                                <div className="absolute inset-1 border border-purple-500/10 rounded-lg pointer-events-none"></div>
                            </button>
                        );
                    })}
                </div>

                {selectedIdx !== null && (
                    <div className="mt-12 text-yellow-400 font-bold animate-pulse tracking-wide">
                        운명이 결정되었습니다...
                    </div>
                )}
            </div>
        </div>
    );
};

export default TarotModal;