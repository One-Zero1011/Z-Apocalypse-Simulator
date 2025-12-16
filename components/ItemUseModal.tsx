
import React from 'react';
import { Character } from '../types';

interface Props {
    selectedItem: string | null;
    onClose: () => void;
    onUseItem: (targetId: string) => void;
    survivors: Character[];
    itemEffects: Record<string, any>;
}

const ItemUseModal: React.FC<Props> = ({ selectedItem, onClose, onUseItem, survivors, itemEffects }) => {
    if (!selectedItem) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-600">
                <h3 className="text-xl font-bold mb-2 dark:text-white">{selectedItem} 사용</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {itemEffects[selectedItem]?.desc || '효과 없음'}
                </p>
                
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">대상 선택</p>
                    {survivors.length > 0 ? survivors.map(char => (
                        <button
                            key={char.id}
                            onClick={() => onUseItem(char.id)}
                            disabled={
                                (selectedItem === '백신' && (char.infection === 0 || char.status === 'Zombie')) ||
                                ((selectedItem === '입마개' || selectedItem === '고기' || selectedItem === '인육') && char.status !== 'Zombie') ||
                                (char.status === 'Zombie' && !['입마개', '고기', '인육', '붕대', '항생제'].includes(selectedItem || ''))
                            }
                            className="w-full text-left p-3 rounded bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-transparent hover:border-blue-300 transition-colors flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex flex-col">
                            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                {char.name}
                                {char.status === 'Zombie' && <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded">ZOMBIE</span>}
                                {char.infection > 0 && char.status !== 'Zombie' && <span className="text-[10px] bg-orange-100 text-orange-800 px-1 rounded">{char.infection}%</span>}
                            </span>
                            </div>
                            <div className="text-xs text-slate-500 space-x-2">
                                <span>HP: {char.hp}</span>
                                {char.status === 'Zombie' ? (
                                    <span className="text-red-500">허기: {char.hunger}</span>
                                ) : (
                                    <span className={char.sanity <= 10 ? 'text-red-500 font-bold' : ''}>멘탈: {char.sanity}</span>
                                )}
                            </div>
                        </button>
                    )) : (
                        <p className="text-center text-slate-500 py-4">사용할 수 있는 대상이 없습니다.</p>
                    )}
                </div>
                
                <button 
                    onClick={onClose}
                    className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    취소
                </button>
            </div>
        </div>
    );
};

export default ItemUseModal;
