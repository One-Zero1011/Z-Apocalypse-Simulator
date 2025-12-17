
import React, { useMemo, useState, useEffect } from 'react';
import { Character, RelationshipStatus } from '../types';

interface Props {
  characters: Character[];
  onClose: () => void;
}

const RelationshipMap: React.FC<Props> = ({ characters, onClose }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);

  // Filter alive characters only
  const nodes = useMemo(() => 
    characters.filter(c => c.status !== 'Dead' && c.status !== 'Missing'), 
  [characters]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        const width = Math.min(window.innerWidth - 32, 1000); // Padding considering
        const height = Math.min(window.innerHeight - 200, 800); // Leave space for header/footer
        setDimensions({ width, height });
        setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = dimensions;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - (isMobile ? 40 : 80); // Adjust padding based on device

  // Calculate positions
  const nodePositions = useMemo(() => {
    return nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2; // Start from top
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle // Store angle for text alignment if needed
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
        id: string; // unique link id
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
        
        linkList.push({ 
            source, 
            target, 
            affinity: avgAffinity, 
            status,
            id: `${source.id}-${target.id}` 
        });
      }
    }
    return linkList;
  }, [nodePositions]);

  const getLineStyle = (affinity: number, status: RelationshipStatus) => {
    // 1. Check Status First (Distinct Styles)
    if (status === 'Spouse') return { stroke: '#be185d', width: isMobile ? 4 : 6, label: '부부', opacity: 1 }; // Dark Pink
    if (status === 'Lover') return { stroke: '#ec4899', width: isMobile ? 4 : 5, label: '연인', opacity: 1 }; // Pink
    
    if (status === 'Parent' || status === 'Child') return { stroke: '#f59e0b', width: isMobile ? 4 : 5, label: '가족(부모자식)', opacity: 1 }; // Amber
    if (status === 'Guardian' || status === 'Ward') return { stroke: '#fbbf24', width: isMobile ? 4 : 5, label: '유사가족(보호)', opacity: 1 }; // Yellow-Amber
    if (status === 'Sibling') return { stroke: '#10b981', width: isMobile ? 4 : 5, label: '남매/형제', opacity: 1 }; // Emerald
    if (status === 'Family') return { stroke: '#eab308', width: isMobile ? 3 : 4, label: '친척', opacity: 1 }; // Yellow
    
    if (status === 'BestFriend') return { stroke: '#3b82f6', width: isMobile ? 3 : 5, label: '절친', opacity: 1 }; // Blue
    if (status === 'Savior') return { stroke: '#8b5cf6', width: isMobile ? 2 : 4, label: '은인', opacity: 0.9, dash: '10,5' }; // Purple Dashed
    if (status === 'Colleague') return { stroke: '#64748b', width: isMobile ? 2 : 3, label: '동료', opacity: 0.8, dash: '2,2' }; // Slate Dashed
    if (status === 'Rival') return { stroke: '#f97316', width: isMobile ? 2 : 4, label: '라이벌', opacity: 0.9 }; // Orange
    if (status === 'Enemy') return { stroke: '#ef4444', width: isMobile ? 3 : 5, label: '원수', opacity: 0.9, dash: '5,2' }; // Red Dashed
    if (status === 'Ex') return { stroke: '#9f1239', width: isMobile ? 2 : 3, label: '전 애인', opacity: 0.6, dash: '5,5' }; // Dark Red Dashed

    // 2. Fallback to Score
    if (affinity >= 30) return { stroke: '#22c55e', width: 3, label: '우호', opacity: 0.7 }; // Green
    if (affinity <= -10) return { stroke: '#f97316', width: 2, label: '반목', opacity: 0.5 }; // Orange
    
    return { stroke: '#475569', width: 1, label: '중립', opacity: 0.2 }; // Gray/Neutral
  };

  // Helper to get relationship text for the details panel
  const getRelationshipDetail = (char1Id: string, char2Id: string) => {
      const char1 = nodes.find(n => n.id === char1Id);
      const char2 = nodes.find(n => n.id === char2Id);
      if (!char1 || !char2) return null;

      const status = char1.relationshipStatuses[char2.id] || 'None';
      const score = char1.relationships[char2.id] || 0;
      
      let statusText = '';
      if (status !== 'None') statusText = status;
      else if (score >= 30) statusText = 'Friend';
      else if (score <= -10) statusText = 'Dislike';
      else statusText = 'Neutral';

      // Translation for display
      const map: Record<string, string> = {
          'Spouse': '부부 💍',
          'Lover': '연인 ❤️', 
          'Parent': '부모 👪',
          'Child': '자식 🐣',
          'Guardian': '보호자 🛡️',
          'Ward': '피보호자 👧',
          'Sibling': '형제/자매 👫',
          'Family': '가족 🏠', 
          'BestFriend': '절친 🤞',
          'Savior': '은인 🦸', 
          'Colleague': '동료 💼', 
          'Rival': '라이벌 ⚔️',
          'Enemy': '원수 👿', 
          'Ex': '전 애인 💔', 
          'Friend': '친구 🤝',
          'Dislike': '싫어함 😠', 
          'Neutral': '서먹함 😐'
      };

      return {
          name: char2.name,
          status: map[statusText] || statusText,
          score: score
      };
  };

  const selectedNode = selectedId ? nodes.find(n => n.id === selectedId) : null;
  const relatedLinks = selectedId 
    ? links.filter(l => l.source.id === selectedId || l.target.id === selectedId) 
    : [];

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
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md animate-fade-in text-slate-200">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-slate-900 border-b border-slate-800 shrink-0">
            <div>
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                    <span>🕸️</span> 관계도 {selectedNode && <span className="text-sm font-normal text-slate-400">| {selectedNode.name} 선택됨</span>}
                </h2>
                <p className="text-xs text-slate-500 hidden md:block">캐릭터를 클릭하여 상세 정보를 확인하세요.</p>
            </div>
            <button 
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-full transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Canvas Area */}
        <div 
            className="flex-1 overflow-hidden relative flex justify-center items-center" 
            onClick={() => setSelectedId(null)} // Background click resets selection
        >
            <svg 
                width={width} 
                height={height} 
                viewBox={`0 0 ${width} ${height}`} 
                className="select-none touch-none"
            >
                {/* Links */}
                {links.map((link) => {
                    const style = getLineStyle(link.affinity, link.status);
                    
                    // Interaction Logic
                    const isConnected = selectedId 
                        ? (link.source.id === selectedId || link.target.id === selectedId)
                        : true;
                    
                    const opacity = isConnected ? style.opacity : 0.05; // Dim others
                    
                    return (
                        <g key={link.id} className="transition-opacity duration-300" style={{ opacity }}>
                            <line
                                x1={link.source.x}
                                y1={link.source.y}
                                x2={link.target.x}
                                y2={link.target.y}
                                stroke={style.stroke}
                                strokeWidth={style.width}
                                strokeLinecap={style.dash ? 'square' : 'round'}
                                strokeDasharray={style.dash}
                            />
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodePositions.map((node) => {
                    const isSelected = node.id === selectedId;
                    const isRelated = selectedId 
                        ? links.some(l => (l.source.id === selectedId && l.target.id === node.id) || (l.target.id === selectedId && l.source.id === node.id))
                        : false;

                    const opacity = !selectedId || isSelected || isRelated ? 1 : 0.3;

                    return (
                        <g 
                            key={node.id} 
                            transform={`translate(${node.x}, ${node.y})`} 
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(node.id === selectedId ? null : node.id);
                            }}
                            className="cursor-pointer transition-all duration-300"
                            style={{ opacity }}
                        >
                            <circle 
                                r={isMobile ? 25 : 30} 
                                fill={isSelected ? '#2563eb' : '#1e293b'} 
                                stroke={isSelected ? '#60a5fa' : '#cbd5e1'} 
                                strokeWidth={isSelected ? 3 : 2} 
                                className="transition-colors duration-300"
                            />
                            {/* Initials or Short Name */}
                            <text
                                textAnchor="middle"
                                dy=".3em"
                                fill="white"
                                fontSize={isMobile ? "10" : "12"}
                                fontWeight="bold"
                                className="pointer-events-none"
                            >
                                {node.name.slice(0, 3)}
                            </text>
                            
                            {/* MBTI Tag */}
                             <text
                                textAnchor="middle"
                                dy={isMobile ? "2.8em" : "2.5em"}
                                fill="#94a3b8"
                                fontSize="9"
                                className="pointer-events-none"
                            >
                                {node.mbti}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Hint Overlay (Only when nothing selected) */}
            {!selectedId && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/80 px-4 py-2 rounded-full text-xs text-slate-400 pointer-events-none backdrop-blur-sm whitespace-nowrap">
                   {isMobile ? "캐릭터를 터치하여 관계 보기" : "캐릭터를 클릭하여 상세 관계 확인"}
                </div>
            )}
        </div>

        {/* Bottom Panel (Mobile Friendly Legend / Details) */}
        <div className="bg-slate-900 border-t border-slate-800 shrink-0 max-h-[40vh] overflow-y-auto">
            {selectedId ? (
                // Selected Details View
                <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg text-white">{selectedNode?.name}의 관계</h3>
                        <button onClick={() => setSelectedId(null)} className="text-xs text-blue-400">
                            선택 해제
                        </button>
                    </div>
                    {relatedLinks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {relatedLinks.map(link => {
                                const targetId = link.source.id === selectedId ? link.target.id : link.source.id;
                                const detail = getRelationshipDetail(selectedId, targetId);
                                if (!detail) return null;
                                
                                return (
                                    <div key={link.id} className="flex items-center justify-between bg-slate-800 p-3 rounded border border-slate-700">
                                        <span className="font-bold text-slate-200">{detail.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-slate-300">{detail.status}</span>
                                            <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                                                detail.score > 0 ? 'bg-green-900/30 text-green-400' : 
                                                detail.score < 0 ? 'bg-red-900/30 text-red-400' : 'bg-slate-700 text-slate-400'
                                            }`}>
                                                {detail.score > 0 ? '+' : ''}{detail.score}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm text-center py-4">아직 특별한 관계가 형성되지 않았습니다.</p>
                    )}
                </div>
            ) : (
                // Default Legend View (Compact Grid)
                <div className="p-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">범례 (Legend)</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-700"></span>부부</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>연인</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>부모자식</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>유사가족</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>남매/형제</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>친척</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>절친</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>라이벌</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>원수</div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default RelationshipMap;
