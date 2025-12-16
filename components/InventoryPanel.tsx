
import React from 'react';

interface Props {
    inventory: string[];
    onSelectItem: (item: string) => void;
}

const InventoryPanel: React.FC<Props> = ({ inventory, onSelectItem }) => {
    const groupedInventory = inventory.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col shadow-sm h-full">
            <div className="flex justify-between items-center mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    📦 캠프 인벤토리 
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">{inventory.length}</span>
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-[120px]">
                {inventory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                        <p>보관된 아이템이 없습니다.</p>
                        <p className="text-xs mt-1">시뮬레이션을 진행하여 물자를 확보하세요.</p>
                        <p className="text-xs mt-1"> 아이템은 터치해 사용이 가능합니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {Object.entries(groupedInventory).map(([item, count]) => (
                            <button
                                key={item}
                                onClick={() => onSelectItem(item)}
                                className="bg-slate-100 dark:bg-slate-700 p-2 rounded border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900 hover:border-blue-300 transition-all flex flex-col items-center justify-center gap-1 group relative min-h-[70px]"
                                title={`${item} (${count}개) - 클릭하여 사용`}
                            >
                                <span className="text-xl mb-1">
                                    {item === '붕대' ? '🩹' : 
                                        item === '통조림' ? '🥫' : 
                                        item === '항생제' ? '💊' : 
                                        item === '초콜릿' ? '🍫' : 
                                        item === '비타민' ? '🍋' : 
                                        item === '안정제' ? '💊' : 
                                        item === '백신' ? '💉' :
                                        item === '입마개' ? '😷' :
                                        item === '고기' ? '🥩' :
                                        item === '인육' ? '🍖' : '📦'}
                                </span>
                                <div className="text-center leading-none">
                                    <span className="block">{item}</span>
                                    {(count as number) > 1 && <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">({count as number}개)</span>}
                                </div>
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryPanel;
