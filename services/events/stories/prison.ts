
import { StoryNode } from "../../../types";

export const PRISON_NODES: Record<string, StoryNode> = {
    'prison_0_start': {
        id: 'prison_0_start',
        text: "🏰 높은 콘크리트 벽과 감시탑이 보입니다. 주립 교도소입니다. 내부는 좀비들로 가득할까요, 아니면 죄수들이 장악했을까요?",
        next: [
            { id: 'prison_1_front_assault', weight: 0.3, choiceText: "정면 돌파 (무력 진입)" },
            { id: 'prison_1_sewer_sneak', weight: 0.7, choiceText: "하수구 잠입 (은밀 침투)" }
        ]
    },
    'prison_1_front_assault': {
        id: 'prison_1_front_assault',
        text: "🔫 정면돌파를 선택했습니다. 위병소의 좀비들을 처리하며 당당하게 정문으로 들어갑니다.",
        next: [{ id: 'prison_2_block_c', weight: 1.0 }],
        effect: { target: 'ALL', kill: 3, fatigue: 15, hp: -5 }
    },
    'prison_1_sewer_sneak': {
        id: 'prison_1_sewer_sneak',
        text: "🕳️ 배수로를 통해 잠입합니다. 악취가 진동하고 오물이 묻지만, 들키지 않고 내부에 진입했습니다.",
        next: [{ id: 'prison_2_block_c', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -10, fatigue: 10 }
    },
    'prison_2_block_c': {
        id: 'prison_2_block_c',
        text: "⛓️ C동 감방 구역. 철창 너머로 감염된 죄수들이 팔을 뻗으며 울부짖습니다. 바닥에는 '폭동'의 흔적이 역력합니다.",
        next: [
            { id: 'prison_3_armory', weight: 0.5, choiceText: "무기고 수색" },
            { id: 'prison_3_infirmary', weight: 0.5, choiceText: "의무실 수색" },
            { id: 'prison_3_control_room', weight: 0.0, choiceText: "중앙 통제실 (교도관/개발자 필요)", req: { job: '교도관' } },
            { id: 'prison_3_control_room_dev', weight: 0.0, choiceText: "중앙 통제실 (교도관/개발자 필요)", req: { job: '개발자' } }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'prison_3_armory': {
        id: 'prison_3_armory',
        text: "🔫 무기고 문은 열려있습니다. 대부분 털렸지만, 진압봉과 방패, 약간의 탄약을 챙겼습니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['권총', '맥가이버 칼'] }
    },
    'prison_3_infirmary': {
        id: 'prison_3_infirmary',
        text: "💊 의무실에서 다량의 진통제와 항생제를 발견했습니다. 하지만 구석 커튼 뒤에서 뭔가 움직입니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'RANDOM_1', hp: -5, loot: ['항생제', '안정제', '붕대'] }
    },
    'prison_3_control_room': {
        id: 'prison_3_control_room',
        text: "🖥️ 보안 코드를 입력하고 안전하게 통제실에 진입했습니다. CCTV로 적의 위치를 파악하고, 전자식 무기고를 원격으로 열어 최고급 장비를 챙깁니다.",
        next: [{ id: 'prison_4_warden', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['권총', '권총', '무전기'], sanity: 10 }
    },
    'prison_3_control_room_dev': { 
        id: 'prison_3_control_room_dev', 
        text: "🖥️ 보안 코드를 입력하고 안전하게 통제실에 진입했습니다. CCTV로 적의 위치를 파악하고, 전자식 무기고를 원격으로 열어 최고급 장비를 챙깁니다.", 
        next: [{ id: 'prison_4_warden', weight: 1.0 }], 
        effect: { target: 'ALL', loot: ['권총', '권총', '무전기'], sanity: 10 } 
    },
    'prison_4_warden': {
        id: 'prison_4_warden',
        text: "🗝️ 교도소장실에 도착했습니다. 책상 위에서 '마스터 키'를 발견했지만, CCTV 모니터에 무장한 죄수 무리가 우리 쪽으로 오는 게 보입니다.",
        next: [
            { id: 'prison_5_ambush', weight: 0.6 },
            { id: 'prison_5_hide', weight: 0.4 }
        ],
        effect: { target: 'ALL', sanity: -5 }
    },
    'prison_5_ambush': {
        id: 'prison_5_ambush',
        text: "⚔️ 죄수들의 리더 '살인마 잭'이 부하들을 이끌고 들이닥쳤습니다. 좁은 복도에서 치열한 백병전이 벌어집니다!",
        next: [{ id: 'prison_6_victory', weight: 0.5 }, { id: 'prison_6_captured', weight: 0.5 }],
        effect: { target: 'RANDOM_HALF', hp: -20, kill: 2, fatigue: 20 }
    },
    'prison_5_hide': {
        id: 'prison_5_hide',
        text: "🤫 책상 밑과 옷장에 숨었습니다. 그들이 방을 뒤지다가 나갈 때까지 숨죽이고 기다립니다. 극도의 긴장감이 흐릅니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', sanity: -15, fatigue: 5 }
    },
    'prison_6_victory': {
        id: 'prison_6_victory',
        text: "🩸 리더를 쓰러뜨리자 나머지는 도망쳤습니다. 그들이 가지고 있던 식량과 무기를 빼앗습니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', loot: ['고기', '권총'] }
    },
    'prison_6_captured': {
        id: 'prison_6_captured',
        text: "🔗 수적으로 밀려 제압당했습니다. 독방에 갇혔지만, 밤이 되자 좀비들이 교도소를 덮치며 혼란이 일어난 틈을 타 문을 부수고 나옵니다.",
        next: [{ id: 'prison_7_yard', weight: 1.0 }],
        effect: { target: 'ALL', hp: -10, inventoryRemove: ['무전기', '지도', '권총'] }
    },
    'prison_7_yard': {
        id: 'prison_7_yard',
        text: "🏟️ 운동장은 지옥도입니다. 좀비 떼와 죄수들이 엉켜 싸우고 있습니다. 우리는 혼란을 틈타 수송 차량이 있는 곳으로 달려야 합니다.",
        next: [
            { id: 'prison_8_armored_car', weight: 0.7 },
            { id: 'prison_8_lockdown', weight: 0.3 }
        ],
        effect: { target: 'ALL', fatigue: 15 }
    },
    'prison_8_armored_car': {
        id: 'prison_8_armored_car',
        text: "🚐 죄수 호송 버스를 탈취하는 데 성공했습니다! 튼튼한 차체로 좀비들을 밀어버리며 교도소를 빠져나갑니다.",
        effect: { target: 'ALL', sanity: 15, fatigue: -20 }
    },
    'prison_8_lockdown': {
        id: 'prison_8_lockdown',
        text: "🚨 비상 봉쇄가 작동되어 모든 문이 잠겼습니다! 우리는 감시탑 꼭대기에 고립되었습니다. 구조가 올 때까지 버틸 수 있을까요?",
        effect: { target: 'ALL', sanity: -30, fatigue: 20, hunger: -20 }
    }
};
