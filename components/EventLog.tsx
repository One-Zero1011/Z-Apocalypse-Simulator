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

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg h-[500px] overflow-y-auto flex flex-col font-mono text-sm relative shadow-sm">
      <div className="sticky top-0 bg-gray-100 dark:bg-slate-800 p-2 border-b border-slate-200 dark:border-slate-700 font-bold z-10 flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        생존 일지 (Mission Log)
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