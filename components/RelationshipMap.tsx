import React, { useMemo } from 'react';
import { Character, RelationshipStatus } from '../types';

interface Props {
  characters: Character[];
  onClose: () => void;
}

const RelationshipMap: React.FC<Props> = ({ characters, onClose }) => {
  // Filter alive characters only
  const nodes = useMemo(() => 
    characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing'), 
  [characters]);

  const width = 800;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 100; // Radius of the circle

  // Calculate positions
  const nodePositions = useMemo(() => {
    return nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2; // Start from top
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [nodes, radius, centerX, centerY]);

  // Calculate links
  const links = useMemo(() => {
    const linkList: { 
        source: typeof nodePositions[0]; 
        target: typeof nodePositions[0]; 
        affinity: number;
        status: RelationshipStatus;
    }[] = [];
    
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const source = nodePositions[i];
        const target = nodePositions[j];
        
        // Get bidirectional relationship values
        const aToB = source.relationships[target.id] || 0;
        const bToA = target.relationships[source.id] || 0;
        
        // Check Status (Check source for status)
        const status = source.relationshipStatuses[target.id] || 'None';

        // Use average for visualization
        const avgAffinity = (aToB + bToA) / 2;
        
        linkList.push({ source, target, affinity: avgAffinity, status });
      }
    }
    return linkList;
  }, [nodePositions]);

  const getLineStyle = (affinity: number, status: RelationshipStatus) => {
    // 1. Check Status First (Distinct Styles)
    if (status === 'Lover') return { stroke: '#ec4899', width: 6, label: '연인', opacity: 1 }; // Pink
    if (status === 'Family') return { stroke: '#eab308', width: 6, label: '가족', opacity: 1 }; // Yellow
    if (status === 'BestFriend') return { stroke: '#3b82f6', width: 5, label: '절친', opacity: 1 }; // Blue
    if (status === 'Savior') return { stroke: '#8b5cf6', width: 4, label: '은인', opacity: 0.9, dash: '10,5' }; // Purple Dashed
    if (status === 'Colleague') return { stroke: '#64748b', width: 3, label: '동료', opacity: 0.8, dash: '2,2' }; // Slate Dashed
    if (status === 'Rival') return { stroke: '#f97316', width: 4, label: '라이벌', opacity: 0.9 }; // Orange
    if (status === 'Enemy') return { stroke: '#ef4444', width: 5, label: '원수', opacity: 0.9, dash: '5,2' }; // Red Dashed
    if (status === 'Ex') return { stroke: '#9f1239', width: 2, label: '전 애인', opacity: 0.6, dash: '5,5' }; // Dark Red Dashed

    // 2. Fallback to Score
    if (affinity >= 30) return { stroke: '#22c55e', width: 3, label: '친구', opacity: 0.7 }; // Green
    if (affinity <= -10) return { stroke: '#f97316', width: 2, label: '싫어함', opacity: 0.5 }; // Orange
    
    return { stroke: '#94a3b8', width: 1, label: '남', opacity: 0.2 }; // Gray/Neutral
  };

  if (nodes.length < 2) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg max-w-md text-center shadow-2xl border border-slate-700">
                <h2 className="text-2xl font-bold mb-4 text-white">인물 관계도</h2>
                <p className="text-slate-300 mb-6">관계도를 표시할 생존자가 충분하지 않습니다 (최소 2명).</p>
                <button 
                    onClick={onClose}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-full transition-colors"
                >
                    닫기
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🕸️</span> 인물 관계도 (Relationship Map)
            </h2>
            <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative bg-slate-950 flex justify-center items-center p-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-w-[800px] select-none">
                {/* Lines */}
                {links.map((link, i) => {
                    const style = getLineStyle(link.affinity, link.status);
                    return (
                        <g key={i}>
                            <line
                                x1={link.source.x}
                                y1={link.source.y}
                                x2={link.target.x}
                                y2={link.target.y}
                                stroke={style.stroke}
                                strokeWidth={style.width}
                                strokeOpacity={style.opacity}
                                strokeLinecap={style.dash ? 'square' : 'round'}
                                strokeDasharray={style.dash}
                            />
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodePositions.map((node) => (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer hover:scale-110 transition-transform duration-200">
                        <circle r="30" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                        <text
                            textAnchor="middle"
                            dy=".3em"
                            fill="white"
                            fontSize="12"
                            fontWeight="bold"
                            className="pointer-events-none"
                        >
                            {node.name.slice(0, 3)}
                        </text>
                        <text
                            textAnchor="middle"
                            dy="2.5em"
                            fill="#94a3b8"
                            fontSize="10"
                            className="pointer-events-none"
                        >
                            {node.mbti}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-800/80 p-4 rounded-lg border border-slate-700 text-xs backdrop-blur-sm grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-pink-500 ring-2 ring-pink-900"></span>
                        <span className="text-pink-200 font-bold">연인</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-yellow-900"></span>
                        <span className="text-yellow-200 font-bold">가족</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-blue-200">절친</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                        <span className="text-purple-200">생명의 은인</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                        <span className="text-orange-200">라이벌</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-slate-500"></span>
                        <span className="text-slate-300">직장 동료</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-red-200">원수</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-900 border border-rose-500"></span>
                        <span className="text-rose-200">전 애인</span>
                    </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipMap;