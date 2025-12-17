
import { StoryNode } from "../../../types";

export const ONE_OFF_NODES: Record<string, StoryNode> = {
    'tarot_start': {
        id: 'tarot_start',
        text: "🃏 안개 낀 거리 한복판에 낡은 타로 천이 깔린 테이블이 놓여 있습니다. 누군가 방금 전까지 있었던 것처럼 촛불이 타오르고 있습니다. 운명의 카드가 우리를 기다립니다.",
        effect: { target: 'ALL', sanity: -5 }
    },
    'sunny_day': { 
        id: 'sunny_day', 
        text: "☀️ 구름 한 점 없는 맑은 날입니다. 젖은 옷을 말리고 장비를 정비하며 모처럼 평화로운 시간을 보냅니다.", 
        effect: { target: 'ALL', sanity: 5, fatigue: -5 } 
    },
    'foggy_day': { 
        id: 'foggy_day', 
        text: "🌫️ 한 치 앞도 보이지 않는 짙은 안개가 꼈습니다. 좀비의 기습에 대비해 신경을 곤두세우느라 피로가 쌓입니다.", 
        effect: { target: 'ALL', fatigue: 5 } 
    },
    'heavy_rain': { 
        id: 'heavy_rain', 
        text: "🌧️ 장대비가 쏟아져 내립니다. 몸은 젖었지만, 덕분에 좀비들의 냄새 추적을 따돌리고 샤워를 할 수 있었습니다.", 
        effect: { target: 'ALL', fatigue: -5, sanity: 5 } 
    },
    'heatwave': {
        id: 'heatwave',
        text: "🔥 숨이 턱턱 막히는 폭염이 찾아왔습니다. 가만히 있어도 땀이 흐르고 체력이 떨어집니다.",
        effect: { target: 'ALL', hp: -2, fatigue: 10 }
    },
    'thunderstorm': {
        id: 'thunderstorm',
        text: "⛈️ 천둥번개가 요란하게 치는 밤입니다. 굉음 때문에 좀비 소리를 듣지 못할까 봐 모두가 불안에 니다.",
        effect: { target: 'ALL', sanity: -5, fatigue: 5 }
    },
    'full_moon': {
        id: 'full_moon',
        text: "🌕 유난히 밝은 보름달이 떴습니다. 달빛 아래서 좀비들의 그림자가 길게 늘어져 기괴함을 자아냅니다.",
        effect: { target: 'ALL', sanity: -5 }
    },
    'starry_night': {
        id: 'starry_night',
        text: "🌠 밤하늘에 별똥별이 떨어집니다. 잠시나마 지옥 같은 현실을 잊고 소원을 빌어봅니다.",
        effect: { target: 'ALL', sanity: 10 }
    },
    'quiet_day': { 
        id: 'quiet_day', 
        text: "🤫 기묘할 정도로 고요한 하루입니다. 폭풍전야일까요? 아니면 잠시나마 신이 우리를 보살피는 걸까요?", 
        effect: { target: 'ALL', fatigue: -5 } 
    },
    'horde_pass': { 
        id: 'horde_pass', 
        text: "🧟‍♂️ 수천 마리의 좀비 떼가 이동하는 것을 목격했습니다. 숨죽여 그들이 지나가길 기다리느라 진이 빠집니다.", 
        effect: { target: 'ALL', fatigue: 15, sanity: -5 } 
    },
    'helicopter': { 
        id: 'helicopter', 
        text: "🚁 머리 위로 헬리콥터가 지나갔지만, 우리를 보지 못했습니다. 구조의 희망과 절망이 동시에 교차합니다.", 
        effect: { target: 'ALL', sanity: -5 } 
    },
    'nightmare_shared': {
        id: 'nightmare_shared',
        text: "😱 밤새 끔찍한 비명소리가 들려 모두가 잠을 설쳤습니다. 그것이 사람인지 짐승인지 알 수 없습니다.",
        effect: { target: 'ALL', sanity: -5, fatigue: 10 }
    },
    'old_music': {
        id: 'old_music',
        text: "🎵 배터리가 남은 낡은 MP3 플레이어를 발견했습니다. 흘러나오는 옛 노래가 모두의 마음을 적십니다.",
        effect: { target: 'ALL', sanity: 10 }
    },
    'board_game': {
        id: 'board_game',
        text: "🎲 먼지 쌓인 보드게임을 발견했습니다. 잠시 생존 경쟁을 잊고 게임에 몰두하며 웃음을 되찾습니다.",
        effect: { target: 'ALL', sanity: 15, fatigue: -5 }
    },
    'stray_dog': {
        id: 'stray_dog',
        text: "🐕 떠돌이 개 한 마리가 캠프 근처를 서성입니다. 먹을 것을 나눠주자 꼬리를 흔들며 잠시 머물다 갑니다.",
        effect: { target: 'ALL', sanity: 5 }
    },
    'rat_swarm': {
        id: 'rat_swarm',
        text: "🐀 쥐 떼가 식량 창고를 습격했습니다! 급하게 쫓아냈지만 식량 일부가 오염되었습니다.",
        effect: { target: 'ALL', sanity: -5, inventoryRemove: ['통조림'] }
    },
    'abandoned_truck': {
        id: 'abandoned_truck',
        text: "🚚 갓길에 버려진 택배 트럭을 발견했습니다. 뒷문은 굳게 잠겨있습니다.",
        next: [
            { id: 'truck_lockpick', weight: 0.0, choiceText: "자물쇠 따기 (기술자/정비공 필요)", req: { job: '기술자(엔지니어)' } },
            { id: 'truck_lockpick_mech', weight: 0.0, choiceText: "자물쇠 따기 (기술자/정비공 필요)", req: { job: '정비공' } },
            { id: 'truck_force', weight: 1.0, choiceText: "힘으로 부수기 (피로도 증가)" }
        ]
    },
    'truck_lockpick': {
        id: 'truck_lockpick',
        text: "🔧 전문 기술을 발휘해 소리 없이 문을 열었습니다. 안에는 유용한 물건들이 가득합니다!",
        effect: { target: 'ALL', loot: ['통조림', '통조림', '붕대'], sanity: 5 }
    },
    'truck_lockpick_mech': { 
        id: 'truck_lockpick_mech', 
        text: "🔧 전문 기술을 발휘해 소리 없이 문을 열었습니다. 안에는 유용한 물건들이 가득합니다!", 
        effect: { target: 'ALL', loot: ['통조림', '통조림', '붕대'], sanity: 5 } 
    },
    'truck_force': {
        id: 'truck_force',
        text: "🔨 한참을 두드리고 부순 끝에 문을 열었습니다. 요란한 소리 때문에 서둘러 물건만 챙겨 떠납니다.",
        effect: { target: 'ALL', loot: ['통조림', '붕대'], fatigue: 15 }
    },
    'pharmacy_ruin': {
        id: 'pharmacy_ruin',
        text: "💊 약국 폐허의 금고가 열려있습니다. 누군가 털어가려다 실패한 것 같습니다. 안에는 귀한 백신과 약품이 그대로 있습니다!",
        effect: { target: 'ALL', loot: ['붕대', '항생제', '비타민', '백신'] }
    },
    'creepy_doll': {
        id: 'creepy_doll',
        text: "🧸 목이 잘린 곰 인형이 길 한복판에 놓여 있습니다. 누군가 우리를 지켜보는 것 같은 기분이 듭니다.",
        effect: { target: 'ALL', sanity: -5 }
    },
    'flower_field': {
        id: 'flower_field',
        text: "🌸 폐허 속에 기적처럼 피어난 꽃밭을 발견했습니다. 잠시 가던 길을 멈추고 향기를 맡습니다.",
        effect: { target: 'ALL', sanity: 5 }
    },
    'weapon_maintenance': {
        id: 'weapon_maintenance',
        text: "🔫 오늘은 이동을 멈추고 무기를 손질하고 장비를 점검하기로 했습니다. 준비된 상태가 마음을 편하게 합니다.",
        effect: { target: 'ALL', fatigue: 5, sanity: 5 }
    },
    'cannibal_meal': {
        id: 'cannibal_meal',
        text: "🍖 충격적인 광경을 목격했습니다. 누군가가 남기고 간 '고기'가 있습니다. 사람이었던 것 같습니다... 굶주림 앞에서는 선택의 여지가 없을지도 모릅니다.",
        effect: { target: 'ALL', sanity: -20, loot: ['인육', '인육'] }
    },
    'vaccine_drop': {
        id: 'vaccine_drop',
        text: "🚁 추락한 군용 드론의 잔해를 발견했습니다. 화물칸에 'Z-백신'이라고 적힌 앰플이 기적적으로 깨지지 않고 남아있습니다!",
        effect: { target: 'ALL', sanity: 15, loot: ['백신'] }
    },
    'military_convoy': {
        id: 'military_convoy',
        text: "🚛 전복된 군용 수송 차량 행렬을 발견했습니다. 호송하던 군인들은 모두 죽었지만, 화물 상자는 굳게 잠겨있습니다.",
        next: [
            { id: 'convoy_loot', weight: 0.5, choiceText: "수색 강행 (백신/무기, 위험)" },
            { id: 'convoy_ignore', weight: 0.5, choiceText: "무시하고 이동 (안전)" }
        ]
    },
    'convoy_loot': {
        id: 'convoy_loot',
        text: "📦 위험을 무릅쓰고 상자를 엽니다. 안에서 백신과 무기를 확보했지만, 매복해있던 군인 좀비가 튀어나옵니다!",
        effect: { target: 'ALL', sanity: 5, hp: -10, loot: ['백신', '권총', '통조림'] }
    },
    'convoy_ignore': {
        id: 'convoy_ignore',
        text: "👀 너무 위험해 보입니다. 아쉬움을 뒤로하고 조용히 자리를 뜹니다.",
        effect: { target: 'ALL', fatigue: 5 }
    },
    'oneoff_locked_box': {
        id: 'oneoff_locked_box',
        text: "🔒 수풀 속에 숨겨진 군용 보급 상자를 발견했습니다. 열쇠 구멍은 녹슬었고, 틈새는 좁습니다.",
        next: [
            { id: 'box_knife', weight: 0.0, choiceText: "맥가이버 칼로 따기 (맥가이버 칼 필요)", req: { item: '맥가이버 칼' } },
            { id: 'box_smash', weight: 1.0, choiceText: "돌로 내리찍기 (소음 발생)" }
        ]
    },
    'box_knife': {
        id: 'box_knife',
        text: "🔪 맥가이버 칼의 도구들을 이용해 정밀하게 자물쇠를 해체했습니다. 안에는 최고급 보급품이 가득합니다!",
        effect: { target: 'ALL', loot: ['권총', '통조림', '항생제', '지도'], sanity: 10 }
    },
    'box_smash': {
        id: 'box_smash',
        text: "🔨 돌로 수십 번을 내리찍어 겨우 상자를 열었습니다. 그 과정에서 내용물 일부가 부서졌고, 소음을 듣고 좀비가 몰려와 급히 자리를 떴습니다.",
        effect: { target: 'ALL', loot: ['통조림'], fatigue: 15 }
    },
    'oneoff_confusing_path': {
        id: 'oneoff_confusing_path',
        text: "🌫️ 짙은 안개 때문에 방향 감각을 상실했습니다. 눈앞에 세 갈래 길이 나타났는데, 어디가 안전한지 알 수 없습니다.",
        next: [
            { id: 'path_map', weight: 0.0, choiceText: "지도로 위치 확인 (지도 필요)", req: { item: '지도' } },
            { id: 'path_guess', weight: 1.0, choiceText: "감으로 찍어서 이동" }
        ]
    },
    'path_map': {
        id: 'path_map',
        text: "🗺️ 지도를 펼쳐 주변 지형지물과 대조했습니다. 숨겨진 안전 가옥으로 가는 지름길을 찾아냈습니다! 편안하게 휴식을 취합니다.",
        effect: { target: 'ALL', fatigue: -20, hp: 5, sanity: 5 }
    },
    'path_guess': {
        id: 'path_guess',
        text: "🌀 감을 믿고 이동했지만, 늪지대를 헤매며 체력만 낭비했습니다. 결국 제자리로 돌아왔습니다.",
        effect: { target: 'ALL', fatigue: 20, sanity: -5 }
    },
    'oneoff_zombie_dog': {
        id: 'oneoff_zombie_dog',
        text: "🐕르르릉... 덩치 큰 좀비견 세 마리가 좁은 골목길을 막아서고 침을 흘리고 있습니다. 도망칠 곳이 없습니다!",
        next: [
            { id: 'dog_shoot', weight: 0.0, choiceText: "권총 사격 (권총 필요)", req: { item: '권총' } },
            { id: 'dog_fight', weight: 1.0, choiceText: "근접전 돌입 (부상 위험)" }
        ]
    },
    'dog_shoot': {
        id: 'dog_shoot',
        text: "🔫 탕! 탕! 탕! 침착하게 권총을 발사해 달려드는 짐승들을 제압했습니다. 다친 사람 없이 위기를 넘겼습니다.",
        effect: { target: 'ALL', sanity: 5, fatigue: 5 }
    },
    'dog_fight': {
        id: 'dog_fight',
        text: "⚔️ 무기를 들고 육탄전을 벌였습니다. 놈들을 처치했지만, 날카로운 이빨에 물리고 뜯겨 심한 상처를 입었습니다.",
        effect: { target: 'RANDOM_HALF', hp: -20, infection: 15, fatigue: 20 }
    },
    'oneoff_faint_signal': {
        id: 'oneoff_faint_signal',
        text: "📡 버려진 통신탑 근처를 지나는데, 끊어진 전선들 사이에서 미세한 잡음이 들리는 것 같습니다.",
        next: [
            { id: 'signal_radio', weight: 0.0, choiceText: "주파수 스캔 (무전기 필요)", req: { item: '무전기' } },
            { id: 'signal_ignore', weight: 1.0, choiceText: "무시하고 이동" }
        ]
    },
    'signal_radio': {
        id: 'signal_radio',
        text: "📻 무전기를 켜고 주파수를 맞추자, 생존자 그룹의 좌표 방송이 잡혔습니다! 그들이 숨겨둔 보급품 위치를 알아냈습니다.",
        effect: { target: 'ALL', loot: ['통조림', '통조림', '비타민', '안정제'], sanity: 10 }
    },
    'signal_ignore': {
        id: 'signal_ignore',
        text: "🔇 바람 소리겠거니 하고 지나쳤습니다. 무언가 중요한 기회를 놓친 것 같은 찜찜함이 남습니다.",
        effect: { target: 'ALL', fatigue: 5 }
    },
    'oneoff_broken_bridge': {
        id: 'oneoff_broken_bridge',
        text: "🌉 협곡을 건너는 다리가 끊어져 있습니다. 반대편에는 안전한 쉼터가 보입니다. 주변에 튼튼해 보이는 덩굴 식물이 있습니다.",
        next: [
            { id: 'bridge_cut', weight: 0.0, choiceText: "덩굴 잘라 밧줄 만들기 (맥가이버 칼 필요)", req: { item: '맥가이버 칼' } },
            { id: 'bridge_tech', weight: 0.0, choiceText: "임시 다리 건설 (기술자 필요)", req: { job: '기술자(엔지니어)' } },
            { id: 'bridge_detour', weight: 1.0, choiceText: "먼 길로 우회하기" }
        ]
    },
    'bridge_cut': {
        id: 'bridge_cut',
        text: "🔪 맥가이버 칼의 톱날로 덩굴을 잘라 튼튼한 밧줄을 만들었습니다. 타잔처럼 줄을 타고 건너 시간을 대폭 단축했습니다.",
        effect: { target: 'ALL', fatigue: -15, sanity: 5 }
    },
    'bridge_tech': {
        id: 'bridge_tech',
        text: "🔧 주변의 자재를 모아 임시 다리를 뚝딱 만들어냈습니다. 모두가 안전하고 편하게 건넜습니다.",
        effect: { target: 'ALL', fatigue: -15, sanity: 5 }
    },
    'bridge_detour': {
        id: 'bridge_detour',
        text: "🚶 도구도 기술도 없습니다. 어쩔 수 없이 산을 하나 넘어서 돌아가야 했습니다. 다리가 퉁퉁 부었습니다.",
        effect: { target: 'ALL', fatigue: 25, hp: -5 }
    }
};