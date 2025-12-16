
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
        let random = Math.random() * totalWeight;
        
        for (const option of nextOptions) {
            random -= option.weight;
            if (random <= 0) {
                return STORY_NODES[option.id];
            }
        }
        // Fallback
        return STORY_NODES[nextOptions[0].id];
    }

    // 2. 진행 중인 이벤트가 없거나, 체인의 끝이라면 -> 새로운 메인 이벤트 시작
    const randomStarterId = STARTER_NODE_IDS[Math.floor(Math.random() * STARTER_NODE_IDS.length)];
    return STORY_NODES[randomStarterId];
};
