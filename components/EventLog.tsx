
import React, { useEffect, useRef } from 'react';
import { DayLog } from '../types';

interface Props {
  logs: DayLog[];
}

const EventLog: React.FC<Props> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleExport = () => {
    if (logs.length === 0) return;

    let content = "Z-Apocalypse Simulator - Survival Log\n=====================================\n\n";
    logs.forEach(log => {
        content += `[Day ${log.day}]\n`;
        content += `> ${log.narrative}\n`;
        log.events.forEach(event => {
            content += `- ${event}\n`;
        });
        content += "\n------------------------------------------------\n\n";
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `z_survival_log_day${logs.length}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg h-[calc(100vh-280px)] min-h-[400px] md:h-[80vh] md:sticky md:top-6 overflow-y-auto flex flex-col font-mono text-sm relative shadow-sm transition-all">
      <div className="sticky top-0 bg-gray-100 dark:bg-slate-800 p-2 border-b border-slate-200 dark:border-slate-700 font-bold z-10 flex items-center justify-between text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            생존 일지 (Mission Log)
        </div>
        {logs.length > 0 && (
            <button 
                onClick={handleExport}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-300"
                title="전체 로그를 텍스트 파일로 저장"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export
            </button>
        )}
      </div>
      <div className="p-4 space-y-6 flex-1">
        {logs.length === 0 && (
          <div className="text-slate-400 dark:text-slate-500 text-center mt-10 italic">
            시뮬레이션 대기 중... <br/>
            생존자를 추가하고 '다음 날'을 눌러주세요.
          </div>
        )}
        {logs.map((log) => (
          <div key={log.day} className="animate-fade-in border-l-2 border-slate-200 dark:border-slate-700 pl-4 pb-4">
            <h4 className="text-zombie-green font-bold mb-2">{log.day}일차</h4>
            <p className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed italic">{log.narrative}</p>
            <ul className="space-y-1">
              {log.events.map((event, idx) => (
                <li key={idx} className="flex gap-2 items-start text-slate-500 dark:text-slate-400">
                  <span className="text-slate-400 dark:text-slate-600 mt-1">➤</span>
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default EventLog;
