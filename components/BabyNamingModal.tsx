
import React, { useState } from 'react';
import { Character } from '../types';

interface Props {
    father: Character;
    mother: Character;
    onConfirm: (name: string) => void;
    onCancel: () => void;
}

const BabyNamingModal: React.FC<Props> = ({ father, mother, onConfirm, onCancel }) => {
    const [babyName, setBabyName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (babyName.trim()) {
            onConfirm(babyName.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border-2 border-pink-400 dark:border-pink-600 transform transition-all scale-100 relative">
                
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300"></div>

                <div className="p-6 text-center">
                    <div className="text-5xl mb-4 animate-bounce">👶</div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">새 생명의 탄생!</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{father.name}</span>와(과) 
                        <span className="font-bold text-pink-600 dark:text-pink-400"> {mother.name}</span> 사이에서<br/>
                        사랑의 결실이 맺어졌습니다.<br/>
                        이 아이를 거두시겠습니까?
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 text-left">아기 이름</label>
                            <input 
                                type="text" 
                                value={babyName}
                                onChange={(e) => setBabyName(e.target.value)}
                                placeholder="이름을 지어주세요..."
                                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none text-center font-bold"
                                maxLength={10}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 transition-colors"
                            >
                                포기하기
                            </button>
                            <button
                                type="submit"
                                disabled={!babyName.trim()}
                                className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                낳기 (그룹 합류)
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BabyNamingModal;
