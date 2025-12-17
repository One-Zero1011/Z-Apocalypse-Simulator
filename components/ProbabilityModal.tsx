
import React from 'react';
import { Character, GameSettings, MBTI } from '../types';
import { ANALYSTS, DIPLOMATS, SENTINELS } from '../services/events/mbtiEvents';
import { STARTER_NODE_IDS } from '../services/events/storyNodes';

interface Props {
    characters: Character[];
    settings: GameSettings;
    onClose: () => void;
}

const ProbabilityModal: React.FC<Props> = ({ characters, settings, onClose }) => {
    const humans = characters.filter(c => ['Alive', 'Infected'].includes(c.status));
    const zombies = characters.filter(c => c.status === 'Zombie');
    const deads = characters.filter(c => c.status === 'Dead');

    // --- Data Calculation ---
    
    // 1. Marriage Pairs Calculation
    const getMarriagePairs = () => {
        const pairs: { names: string, chance: string, days: number }[] = [];
        const processed = new Set<string>();
        humans.forEach(c1 => {
            Object.entries(c1.relationshipStatuses).forEach(([id, status]) => {
                if (status === 'Lover') {
                    const c2 = humans.find(h => h.id === id);
                    if (!c2) return;
                    const pairKey = [c1.id, c2.id].sort().join('-');
                    if (processed.has(pairKey)) return;
                    processed.add(pairKey);
                    const duration = c1.relationshipDurations[c2.id] || 0;
                    const chance = Math.min(0.5, 0.01 + (duration * 0.005)) * 100;
                    pairs.push({ names: `${c1.name} & ${c2.name}`, chance: `${chance.toFixed(1)}%`, days: duration });
                }
            });
        });
        return pairs;
    };

    // 2. Story Distribution Stats
    const getStoryDistribution = () => {
        const total = STARTER_NODE_IDS.length;
        const counts = { main: 0, environmental: 0, loot: 0, interactive: 0 };
        STARTER_NODE_IDS.forEach(id => {
            // Updated to include 'signal' for bunker arc detection
            if (id.includes('_0_start') || id.includes('_0_signal')) counts.main++;
            else if (['sunny', 'foggy', 'heavy', 'heatwave', 'thunder', 'moon', 'starry', 'quiet', 'horde', 'helicopter', 'nightmare', 'doll', 'flower'].some(k => id.includes(k))) counts.environmental++;
            else if (['truck', 'pharmacy', 'drop', 'meal', 'convoy'].some(k => id.includes(k))) counts.loot++;
            else if (['oneoff_'].some(k => id.includes(k))) counts.interactive++;
            else counts.environmental++;
        });
        return [
            { label: '🎬 메인 스토리 아크', percent: ((counts.main / total) * 100).toFixed(1), color: 'text-blue-500' },
            { label: '☁️ 환경 및 분위기', percent: ((counts.environmental / total) * 100).toFixed(1), color: 'text-slate-500' },
            { label: '📦 물자 확보 이벤트', percent: ((counts.loot / total) * 100).toFixed(1), color: 'text-amber-500' },
            { label: '🧩 특수 상호작용', percent: ((counts.interactive / total) * 100).toFixed(1), color: 'text-purple-500' },
        ];
    };

    const mentalRisks = humans.filter(c => c.mentalState && c.mentalState !== 'Normal');
    const storyDist = getStoryDistribution();
    const marriagePairs = getMarriagePairs();

    const getMBTIGroupName = (mbti: MBTI) => {
        if (ANALYSTS.includes(mbti)) return '분석가';
        if (DIPLOMATS.includes(mbti)) return '외교관';
        if (SENTINELS.includes(mbti)) return '관리자';
        return '탐험가';
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in text-slate-800 dark:text-slate-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-amber-500/50 flex flex-col">
                {/* Header */}
                <div className="bg-amber-500 p-4 flex justify-between items-center text-white shrink-0">
                    <h3 className="text-xl font-bold flex items-center gap-2 font-mono">
                        📊 시뮬레이션 마스터 데이터 (Simulation Engine)
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-10">
                    
                    {/* 1. Behavior & Story Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section>
                            <h4 className="font-bold text-amber-600 dark:text-amber-400 border-b pb-1 mb-4 uppercase tracking-wider">🏃 개인 행동 결정 알고리즘</h4>
                            <div className="space-y-1.5">
                                {[
                                    { n: '유저 명령', c: '수동 지정 시', p: '100%' },
                                    { n: '정신질환 돌발', c: '불안정 상태', p: '30.0%' },
                                    { n: '피로 임계사고', c: '피로 80 이상', p: '40.0%' },
                                    { n: '직업별 자원획득', c: '생산직 보유', p: '30.0%' },
                                    { n: '자동 휴식', c: '피로 60 이상', p: '30.0%' },
                                    { n: '직업/성격 행동', c: '기본값', p: '60/40%' }
                                ].map((it, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700 text-xs">
                                        <span className="font-bold">{idx + 1}. {it.n}</span>
                                        <span className="text-slate-500">{it.c}</span>
                                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{it.p}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h4 className="font-bold text-blue-600 dark:text-blue-400 border-b pb-1 mb-4 uppercase tracking-wider">🌍 월드 이벤트 엔진</h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {storyDist.map((s, i) => (
                                        <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                            <div className="text-[10px] text-slate-500 mb-1">{s.label}</div>
                                            <div className={`font-mono font-bold ${s.color}`}>{s.percent}%</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 text-[11px] leading-relaxed">
                                    <p>🚩 <strong>스토리 규칙:</strong> 메인 아크(HOSPITAL 등) 진행 중에는 해당 흐름을 따르며, 아크가 종료되면 위 확률에 따라 다음 메인/단발성 이벤트가 결정됩니다.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 2. Relationships & Ghost Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section>
                            <h4 className="font-bold text-pink-600 dark:text-pink-400 border-b pb-1 mb-4 uppercase tracking-wider">💍 관계 및 가족 시스템</h4>
                            <div className="space-y-4">
                                <div className="bg-pink-50 dark:bg-pink-900/10 p-3 rounded-lg border border-pink-100 dark:border-pink-900/30 text-xs">
                                    <ul className="space-y-1">
                                        <li className="flex justify-between"><span>💘 연인 진화 (호감도 75+)</span> <span className="font-bold">15.0% / 일</span></li>
                                        <li className="flex justify-between"><span>💍 결혼 (연인 지속일 비례)</span> <span className="font-bold">1% + (0.5% x 일)</span></li>
                                        <li className="flex justify-between"><span>👶 임신 (부부 대상)</span> <span className="font-bold">5.0% / 일</span></li>
                                    </ul>
                                </div>
                                {marriagePairs.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-pink-700 dark:text-pink-300">실시간 결혼 확률 모니터:</p>
                                        {marriagePairs.map((p, i) => (
                                            <div key={i} className="flex justify-between bg-white dark:bg-slate-950 p-2 rounded border border-pink-100 dark:border-pink-900 text-[10px]">
                                                <span>{p.names} (지속 {p.days}일)</span>
                                                <span className="font-bold text-pink-500">{p.chance}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section>
                            <h4 className="font-bold text-slate-500 dark:text-slate-400 border-b pb-1 mb-4 uppercase tracking-wider">👻 사후 세계 & 실종 (Ghost & Missing)</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                                    <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">유령 목격 (Ghost Events)</p>
                                    <p className="text-[10px] text-slate-500 leading-normal">사망자가 밤에 나타나 유대인이 있는 이에게 영향을 미칠 확률:</p>
                                    <ul className="mt-2 space-y-1">
                                        <li className="flex justify-between"><span>깊은 유대 (연인/가족 등)</span> <span className="font-bold">25.0%</span></li>
                                        <li className="flex justify-between"><span>일반 동료</span> <span className="font-bold">10.0%</span></li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                                    <p className="font-bold text-blue-600 dark:text-blue-400 mb-1">실종자 처리 (Missing)</p>
                                    <ul className="mt-1 space-y-1">
                                        <li className="flex justify-between"><span>매일 귀환 확률</span> <span className="font-bold">5.0%</span></li>
                                        <li className="flex justify-between"><span>유품 발견 (사망 간주)</span> <span className="font-bold">3.0%</span></li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* 3. Zombies & Infection Crisis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section>
                            <h4 className="font-bold text-red-600 dark:text-red-400 border-b pb-1 mb-4 uppercase tracking-wider">🗳️ 감염 위기 투표 시스템</h4>
                            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-xs">
                                <p className="mb-3 font-bold">감염도 100% 도달 시 생존자 투표 로직 (합산 &gt; 0 이면 찬성):</p>
                                <div className="space-y-2 font-mono text-[10px] opacity-80">
                                    <div className="flex justify-between"><span>성향 보너스</span> <span>F: +2 / T: -2</span></div>
                                    <div className="flex justify-between"><span>호감도 가중치</span> <span>50이상: +4 / -20이하: -3</span></div>
                                    <div className="flex justify-between"><span>특수 관계 (연인/가족)</span> <span className="text-red-500">+15 (강력)</span></div>
                                </div>
                                <p className="mt-3 text-[10px] italic text-slate-500">* 투표 결과 과반수 이상 찬성 시 '속박된 좀비'로 전환되며 생존이 유지됩니다.</p>
                            </div>
                        </section>

                        <section>
                            <h4 className="font-bold text-zombie-green border-b pb-1 mb-4 uppercase tracking-wider">🧟 좀비 생존 규칙 (Zombie Life)</h4>
                            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30 text-xs space-y-3">
                                <div className="flex justify-between">
                                    <span>일일 허기 감소 (Hunger Loss)</span>
                                    <span className="font-bold text-red-600">-2.0 / 일</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>굶주림 패널티 (허기 10 이하)</span>
                                    <span className="font-bold text-red-600">HP -5.0 / 일</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>좀비 물기 돌발 (상호작용 시)</span>
                                    <span className="font-bold text-red-600">10.0%</span>
                                </div>
                                <p className="text-[10px] text-slate-400 italic">* 입마개(Muzzle) 착용 시 물기 확률이 0%로 고정됩니다.</p>
                            </div>
                        </section>
                    </div>

                    {/* 4. Mental Illness Risk Monitor */}
                    <section>
                        <h4 className="font-bold text-purple-600 dark:text-purple-400 border-b pb-1 mb-4 uppercase tracking-wider flex items-center gap-2">
                            🧠 실시간 정신질환 위험군 ({mentalRisks.length})
                        </h4>
                        {mentalRisks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {mentalRisks.map(c => (
                                    <div key={c.id} className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-900/30 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">{c.name} ({getMBTIGroupName(c.mbti)})</span>
                                            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">{c.mentalState}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-400 uppercase">돌발확률</div>
                                            <div className="font-mono text-sm text-red-600 font-bold">30.0%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-xl">위험군 생존자가 없습니다. 평화로운 상태입니다.</div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0 text-center">
                    <p className="text-[10px] text-slate-500 italic">※ 위 데이터는 시뮬레이션 엔진 0.4.2v의 하드코딩된 확률값 및 실시간 상태를 기반으로 합니다.</p>
                </div>
            </div>
        </div>
    );
};

export default ProbabilityModal;
