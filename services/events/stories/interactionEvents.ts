
export const INTERACTION_TEMPLATES = {
    POSITIVE: [
        (a: string, b: string) => `${a}와(과) ${b}은(는) 서로의 등을 지켜주며 신뢰를 쌓았습니다.`,
        (a: string, b: string) => `${a}은(는) ${b}에게 자신의 비상 식량을 나눠주었습니다.`,
        (a: string, b: string) => `${a}와(과) ${b}은(는) 옛날 이야기를 나누며 깊은 유대감을 느꼈습니다.`,
        (a: string, b: string) => `${a}은(는) 위험에 처한 ${b}을(를) 간발의 차로 구했습니다.`,
        (a: string, b: string) => `${a}와(과) ${b}은(는) 함께 보초를 서며 서로에 대해 더 알게 되었습니다.`,
        (a: string, b: string) => `${a}은(는) ${b}의 상처를 정성껏 치료해주었습니다.`,
        (a: string, b: string) => `${a}와(과) ${b}은(는) 미래에 대한 희망을 이야기하며 서로를 격려했습니다.`,
        (a: string, b: string) => `${a}은(는) ${b}이(가) 힘들어하는 것을 보고 조용히 도와주었습니다.`
    ],
    NEGATIVE: [
        (a: string, b: string) => `${a}은(는) ${b}의 방식이 마음에 들지 않아 언성을 높였습니다.`,
        (a: string, b: string) => `${a}은(는) ${b}의 무모한 행동을 비난하며 화를 냈습니다.`,
        (a: string, b: string) => `${a}와(과) ${b}은(는) 이동 경로를 두고 심하게 다투었습니다.`,
        (a: string, b: string) => `${a}은(는) ${b}이(가) 식량을 훔쳤다고 의심했습니다.`,
        (a: string, b: string) => `${a}은(는) ${b}의 태도가 마음에 들지 않아 차갑게 대했습니다.`,
        (a: string, b: string) => `${a}와(과) ${b} 사이에는 숨막히는 침묵만이 흘렀습니다.`,
        (a: string, b: string) => `${a}은(는) ${b}의 실수 때문에 위험에 처할 뻔했다며 탓했습니다.`,
        (a: string, b: string) => `${a}은(는) ${b}의 이기적인 태도에 실망감을 감추지 못했습니다.`
    ]
};

export const LOVER_EVENTS = [
    (a: string, b: string) => `${a}은(는) ${b}에게 몰래 숨겨둔 초콜릿을 주며 사랑을 속삭였습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 좀비 떼를 피해 숨은 곳에서 손을 꼭 잡고 있었습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}을(를) 위해 자신의 목숨을 걸고 약을 구해왔습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 세상이 끝나더라도 함께하자고 약속했습니다.`,
    (a: string, b: string) => `${a}은(는) 악몽을 꾸는 ${b}을(를) 밤새 안아주었습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 폐허 속에서 둘만의 작은 결혼식을 상상했습니다.`
];

export const CONFESSION_EVENTS = [
    (a: string, b: string) => `${a}은(는) 떨리는 목소리로 ${b}에게 좋아한다고 고백했습니다!`,
    (a: string, b: string) => `${a}은(는) ${b}에게 꽃을 건네며 마음을 전했습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}에게 "너 없이는 살 수 없어"라고 말했습니다.`
];

export const BREAKUP_EVENTS = [
    (a: string, b: string) => `${a}와(과) ${b}은(는) 극심한 스트레스로 인해 서로에게 씻을 수 없는 상처를 주고 헤어졌습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}의 이기적인 행동에 질려 이별을 통보했습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}의 사랑은 좀비 아포칼립스의 현실 앞에서 무너져 내렸습니다.`
];

export const REUNION_EVENTS = [
    (a: string, b: string) => `${a}와(과) ${b}은(는) 죽음의 위기 속에서 서로의 소중함을 다시 깨닫고 재결합했습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}에게 지난 과오를 눈물로 사과하며 다시 받아달라고 부탁했습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) "역시 너밖에 없다"며 서로를 꼭 끌어안았습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 헤어져 있던 시간만큼 더 뜨겁게 사랑하기로 했습니다.`
];

// New Relationship Events
export const FAMILY_EVENTS = [
    (a: string, b: string) => `${a}은(는) ${b}에게 옷을 여며주며 "아프지 마"라고 걱정했습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 죽은 친척들을 떠올리며 서로를 위로했습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}에게 맛있는 부분을 덜어주며 "많이 먹어"라고 챙겼습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}의 안전을 확인하고서야 잠자리에 들었습니다.`
];

export const BEST_FRIEND_EVENTS = [
    (a: string, b: string) => `${a}와(과) ${b}은(는) 말하지 않아도 서로의 생각을 읽고 완벽한 호흡을 보여주었습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}의 흑역사를 폭로하려다 입막음을 당했습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 험한 농담을 주고받으며 긴장을 풀었습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}에게 "네가 좀비가 되면 내가 처리해줄게"라고 농담했습니다.`
];

export const COLLEAGUE_EVENTS = [
    (a: string, b: string) => `${a}와(과) ${b}은(는) "회사 다닐 때가 좋았지"라며 씁쓸하게 웃었습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 마치 업무를 분담하듯이 효율적으로 좀비를 처리했습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}에게 "이건 야근 수당도 안 나온다"며 투덜거렸습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 예전 상사 뒷담화를 하며 스트레스를 풀었습니다.`
];

export const RIVAL_EVENTS = [
    (a: string, b: string) => `${a}은(는) ${b}에게 "나보다 먼저 죽지 마"라며 경쟁심을 불태웠습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}가 실수하자 비웃었지만, 뒤에서는 조용히 도와주었습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 누가 더 많은 좀비를 잡는지 내기를 했습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}에게 지기 싫어서 위험한 임무를 자처했습니다.`
];

export const SAVIOR_EVENTS = [
    (a: string, b: string) => `${a}은(는) ${b}에게 생명의 은인이라며 과도한 친절을 베풀었습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}를 볼 때마다 자신이 구해줬던 그날을 상기시켰습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}에게 목숨 빚을 갚겠다며 위험을 대신 감수했습니다.`
];

export const ENEMY_EVENTS = [
    (a: string, b: string) => `${a}은(는) ${b}가 지나가자 바닥에 침을 뱉으며 경멸했습니다.`,
    (a: string, b: string) => `${a}와(과) ${b}은(는) 서로를 미끼로 쓸 기회만 엿보고 있습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}의 제안을 무조건 반대하며 훼방을 놓았습니다.`,
    (a: string, b: string) => `${a}와(과) ${b} 사이에서 살벌한 살기가 느껴졌습니다.`
];

export const EX_LOVER_EVENTS = [
    (a: string, b: string) => `${a}와(과) ${b}은(는) 어색한 침묵 속에서 서로의 눈을 피했습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}에게 "너 성격은 여전하구나"라며 비꼬았습니다.`,
    (a: string, b: string) => `${a}은(는) ${b}가 다른 사람과 웃는 것을 보고 질투와 안도감을 동시에 느꼈습니다.`
];
