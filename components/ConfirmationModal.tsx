import React from 'react';

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isDangerous?: boolean; // 붉은색 버튼 강조 여부
}

const ConfirmationModal: React.FC<Props> = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmLabel = "확인",
  isDangerous = false
}) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-600 transform transition-all scale-100">
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            {isDangerous && <span className="text-red-500">⚠️</span>}
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex gap-3 justify-end border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-bold text-sm text-white shadow-sm transition-colors flex items-center gap-2
              ${isDangerous 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;