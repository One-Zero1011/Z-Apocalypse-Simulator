
import { StoryNode, CustomStoryArc } from "../../types";
import { STORY_NODES, STARTER_NODE_IDS } from "./storyNodes";

/**
 * 다음 스토리 노드를 결정하는 함수
 * @param currentId 현재 노드 ID (없으면 랜덤 시작)
 * @param forcedNextId (Optional) 유저가 선택한 다음 노드 ID
 * @param customArcs (Optional) 사용자가 추가한 커스텀 스토리 아크 목록
 */
export const getNextStoryNode = (currentId: string | null, forcedNextId?: string, customArcs: CustomStoryArc[] = []): StoryNode => {
    
    // 1. 모든 노드 병합 (기본 + 커스텀)
    let allNodes = { ...STORY_NODES };
    let allStarters = [...STARTER_NODE_IDS];

    // 커스텀 아크 병합
    customArcs.forEach(arc => {
        allNodes = { ...allNodes, ...arc.nodes };
        if (arc.starterNodeId && arc.nodes[arc.starterNodeId]) {
            allStarters.push(arc.starterNodeId);
        }
    });

    // 2. 강제 선택된 노드가 있다면 최우선 반환
    if (forcedNextId && allNodes[forcedNextId]) {
        return allNodes[forcedNextId];
    }

    // 3. 현재 진행 중인 이벤트가 있고, 다음 단계가 정의되어 있다면
    if (currentId && allNodes[currentId] && allNodes[currentId].next) {
        const nextOptions = allNodes[currentId].next!;
        const totalWeight = nextOptions.reduce((sum, opt) => sum + opt.weight, 0);
        
        if (totalWeight > 0) {
            let random = Math.random() * totalWeight;
            for (const option of nextOptions) {
                random -= option.weight;
                if (random <= 0 && allNodes[option.id]) {
                    return allNodes[option.id];
                }
            }
        }
        
        // 가중치가 0이거나 선택된 노드가 없는 경우 첫 번째 가능한 노드 시도
        const firstValid = nextOptions.find(opt => allNodes[opt.id]);
        if (firstValid) return allNodes[firstValid.id];
    }

    // 4. 진행 중인 이벤트가 없거나, 체인의 끝이거나, 데이터 오류가 발생한 경우 -> 새로운 메인 이벤트 랜덤 시작
    const validStarters = allStarters.filter(id => allNodes[id]);
    const randomStarterId = validStarters[Math.floor(Math.random() * validStarters.length)];
    
    return allNodes[randomStarterId] || Object.values(STORY_NODES)[0];
};
