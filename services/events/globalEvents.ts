
import { StoryNode } from "../../types";
import { STORY_NODES, STARTER_NODE_IDS } from "./storyNodes";

/**
 * 다음 스토리 노드를 결정하는 함수
 * @param currentId 현재 노드 ID (없으면 랜덤 시작)
 * @param forcedNextId (Optional) 유저가 선택한 다음 노드 ID
 */
export const getNextStoryNode = (currentId: string | null, forcedNextId?: string): StoryNode => {
    
    // 0. 강제 선택된 노드가 있다면 최우선 반환
    if (forcedNextId && STORY_NODES[forcedNextId]) {
        return STORY_NODES[forcedNextId];
    }

    // 1. 현재 진행 중인 이벤트가 있고, 다음 단계가 정의되어 있다면
    if (currentId && STORY_NODES[currentId] && STORY_NODES[currentId].next) {
        const nextOptions = STORY_NODES[currentId].next!;
        const totalWeight = nextOptions.reduce((sum, opt) => sum + opt.weight, 0);
        
        if (totalWeight > 0) {
            let random = Math.random() * totalWeight;
            for (const option of nextOptions) {
                random -= option.weight;
                if (random <= 0 && STORY_NODES[option.id]) {
                    return STORY_NODES[option.id];
                }
            }
        }
        
        // 가중치가 0이거나 선택된 노드가 없는 경우 첫 번째 가능한 노드 시도
        const firstValid = nextOptions.find(opt => STORY_NODES[opt.id]);
        if (firstValid) return STORY_NODES[firstValid.id];
    }

    // 2. 진행 중인 이벤트가 없거나, 체인의 끝이거나, 데이터 오류가 발생한 경우 -> 새로운 메인 이벤트 랜덤 시작
    // 안전 장치: 유효한 스타터 ID만 필터링
    const validStarters = STARTER_NODE_IDS.filter(id => STORY_NODES[id]);
    const randomStarterId = validStarters[Math.floor(Math.random() * validStarters.length)];
    
    // 최종 방어선: 만약 스타터조차 없다면 (그럴 일은 없어야 함) 아무거나 하나 반환
    return STORY_NODES[randomStarterId] || Object.values(STORY_NODES)[0];
};
