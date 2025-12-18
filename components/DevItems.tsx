
import React, { useState, useEffect } from 'react';

interface Props {
    availableItems: string[];
    onAdd: (item: string, count: number) => void;
}

const DevItems: React.FC<Props> = ({ availableItems, onAdd }) => {
    const [itemToAdd, setItemToAdd] = useState<string>('');
    const [itemCount, setItemCount] = useState<number>(1);

    // FIX: availableItems가 로드되었을 때 기본 선택값 설정
    useEffect(() => {
        if (availableItems.length > 0 && !itemToAdd) {
            setItemToAdd(availableItems[0]);
        }
    }, [availableItems]);

    const handleAddItem = () => {
        if (itemToAdd && itemCount > 0) {
            onAdd(itemToAdd, itemCount);
            alert(`${itemToAdd} ${itemCount}개를 인벤토리에 추가했습니다.`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-md w-full space-y-6">
                <h3 className="text-2xl font-bold text-center text-slate-700 dark:text-white mb-4">
                    📦 인벤토리 아이템 추가
                </h3>
                
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-500 dark:text-slate-400">아이템 선택</label>
                    <select 
                        value={itemToAdd} 
                        onChange={(e) => setItemToAdd(e.target.value)}
                        className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="" disabled>아이템 선택</option>
                        {availableItems.map(item => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-500 dark:text-slate-400">수량 (Quantity)</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="number" 
                            min="1" 
                            max="100"
                            value={itemCount}
                            onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value) || 0))}
                            className="flex-1 p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono text-lg"
                        />
                        <div className="flex gap-2">
                            <button onClick={() => setItemCount(Math.max(1, itemCount - 1))} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600">-</button>
                            <button onClick={() => setItemCount(itemCount + 1)} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600">+</button>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleAddItem}
                    disabled={!itemToAdd}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    인벤토리에 추가하기
                </button>
            </div>
        </div>
    );
};

export default DevItems;
