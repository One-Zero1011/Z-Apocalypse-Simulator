
import { ActionEffect, Gender, MBTI } from "../../types";

// MBTI Groupings for compatibility logic
export const ANALYSTS: MBTI[] = ['INTJ', 'INTP', 'ENTJ', 'ENTP'];
export const DIPLOMATS: MBTI[] = ['INFJ', 'INFP', 'ENFJ', 'ENFP'];
export const SENTINELS: MBTI[] = ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'];
export const EXPLORERS: MBTI[] = ['ISTP', 'ISFP', 'ESTP', 'ESFP'];

// Helper to get pronoun based on gender (Korean nuance)
const getPronoun = (gender: Gender) => {
    if (gender === 'Male') return '그';
    if (gender === 'Female') return '그녀';
    return '그들';
};

// Event Definition Type
type MBTIEventGenerator = (name: string, p: string) => ActionEffect;

// Raw Event Pools (Exported for Developer Menu)
export const MBTI_EVENT_POOL: Record<MBTI, MBTIEventGenerator[]> = {
    INTJ: [
        (n, p) => ({ text: `${n}은(는) 장기 생존을 위한 마스터플랜을 수립하고 비상 식량을 숨겼습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 비효율적인 바리케이드를 뜯어고치다 손을 다쳤지만 방어력은 올랐습니다.`, hp: -2, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) ${p}의 냉철한 판단으로 함정을 미리 감지하고 피해갔습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 혼자만의 시간을 가지며 복잡한 머릿속을 정리했습니다.`, sanity: 10, fatigue: -5 }),
        (n, p) => ({ text: `${n}은(는) 좀비들의 이동 패턴에서 규칙성을 발견하고 기록했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 동료들의 감정적인 결정이 생존에 방해가 된다고 비판했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 빗물을 효율적으로 모으는 정수 시스템을 고안해냈습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 체스 말을 깎아 만들며 다음 수를 생각했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 잠을 줄여가며 탈출용 지도를 완벽하게 암기했습니다.`, hp: -5, sanity: 5, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) "모든 것은 계획대로야"라고 중얼거렸습니다.`, fatigue: 0 }),
        (n, p) => ({ text: `${n}은(는) 비상 사태를 대비해 플랜 D까지 세웠습니다.`, sanity: 2, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 남들이 보지 못한 탈출 루트를 발견하고 조용히 미소 지었습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 감정에 휩쓸리는 동료를 보며 고개를 저었습니다.`, fatigue: 2 }),
        (n, p) => ({ text: `${n}은(는) 좀비의 동선을 완벽히 예측하여 설치한 함정으로 깔끔하게 처리했습니다.`, kill: 1, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 은신처에서 완벽한 휴식 계획을 짜고 숙면을 취했습니다.`, hp: 10, sanity: 5, fatigue: -30 })
    ],
    INTP: [
        (n, p) => ({ text: `${n}은(는) 좀비 바이러스의 원인에 대해 깊게 고찰하다 불침번 시간을 놓쳤습니다.`, sanity: -5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 잡동사니를 모아 기발한 전기 충격 함정을 만들었습니다.`, kill: 1, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 좀비의 행동 양식을 관찰하려다 너무 가까이 다가가 공격당했습니다.`, hp: -10, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 지도에서 모순점을 발견하고 더 안전한 경로를 계산해냈습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 쓸모없어 보이는 기계를 분해하여 유용한 부품을 얻었습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 좀비도 굶어 죽을까에 대한 가설을 세우느라 식사하는 것을 잊었습니다.`, hp: -5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 복잡한 암호로 잠긴 문을 해제하는 데 성공했습니다.`, sanity: 10, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 무전기를 개조하여 더 먼 곳의 신호를 잡으려 시도했습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 갑자기 떠오른 아이디어로 좀비 유인용 드론을 만들었습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 현실감이 없어져 이것이 시뮬레이션인지 의심하기 시작했습니다.`, sanity: -5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) "이 상황이 논리적으로 말이 안 돼"라며 분석을 시작했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 좀비의 약점을 파악하기 위해 위험한 실험을 감행했습니다.`, hp: -5, kill: 2, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 혼자만의 세계에 빠져 누가 불러도 듣지 못했습니다.`, sanity: 5, fatigue: -5 }),
        (n, p) => ({ text: `${n}은(는) 화학 지식을 이용해 진통제를 합성했습니다.`, hp: 15, fatigue: -10 })
    ],
    ENTJ: [
        (n, p) => ({ text: `${n}은(는) 생존자들을 효율적으로 지휘하여 완벽한 방어선을 구축했습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 자원 확보를 위해 위험한 원정을 강행했습니다.`, hp: -5, kill: 2, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 나약한 소리를 하는 동료를 강하게 질책하여 분위기를 얼어붙게 했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 새로운 거점을 확보하기 위한 대담한 전략을 짰습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 리더십을 발휘하여 폭동 조짐을 사전에 제압했습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 쓸모없는 짐을 버리고 이동 속도를 높이기로 결정했습니다.`, sanity: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 감염 의심자를 격리해야 한다고 냉정하게 주장했습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 주변 지형을 완전히 장악하고 요새화 계획을 세웠습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 식량 배급 통제권을 쥐고 철저하게 관리했습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 선두에 서서 좀비 무리를 뚫고 길을 열었습니다.`, hp: -5, kill: 3, fatigue: 25 }),
        (n, p) => ({ text: `${n}은(는) 비효율적인 행동을 하는 동료에게 업무를 재배당했습니다.`, sanity: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 미래를 위해 인재 양성이 필요하다며 생존 기술을 가르쳤습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 자신의 명령에 불복종하는 것을 용납하지 않았습니다.`, sanity: -5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 최상의 컨디션을 유지하기 위해 추가 배급을 챙겼습니다.`, hp: 10, fatigue: -15 })
    ],
    ENTP: [
        (n, p) => ({ text: `${n}은(는) 좀비를 유인하는 위험하지만 기발한 방법을 시험했습니다.`, hp: -5, kill: 3, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 절망적인 상황에서도 농담을 던져 분위기를 환기했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) "좀비도 수영을 할 수 있을까?"라는 엉뚱한 토론을 시작했습니다.`, sanity: 2, fatigue: 2 }),
        (n, p) => ({ text: `${n}은(는) 즉흥적으로 만든 무기로 위기를 모면했습니다.`, kill: 1, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 기존의 생존 수칙에 의문을 제기하며 새로운 방법을 제안했습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 좀비 한 마리를 생포해서 길들이려다 혼날 뻔했습니다.`, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 적대적인 생존자 그룹에게 말빨로 사기를 쳐서 물자를 얻어냈습니다.`, sanity: 10, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 폭발물을 제조하여 화려한 불꽃놀이를 계획했습니다.`, hp: -5, kill: 5, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 악마의 대변인 역할을 자처하며 회의를 길어지게 만들었습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 이상한 재료를 섞어 새로운 에너지 드링크를 만들었습니다.`, hp: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 위기 상황을 게임처럼 즐기며 대담하게 행동했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 아무도 생각하지 못한 기상천외한 탈출법을 생각해냈습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 지루하다며 일부러 위험한 내기를 제안했습니다.`, hp: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 수상한 약을 먹어봤는데 의외로 효과가 좋았습니다.`, hp: 10, sanity: 5, fatigue: -20 })
    ],

    INFJ: [
        (n, p) => ({ text: `${n}은(는) 악몽을 꾸었지만, 그것이 불길한 예지몽이라 느꼈습니다.`, sanity: -10, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 절망에 빠진 동료를 조용히 위로하며 상담해주었습니다.`, sanity: 10, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 그룹을 위해 몰래 자신의 몫인 식량을 양보했습니다.`, hp: -5, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 좀비가 된 옛 이웃을 보고 깊은 슬픔에 잠겼습니다.`, sanity: -15, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 인간성을 잃지 않기 위해 철학적인 고민을 했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 다가올 위기를 직감하고 미리 피난 짐을 쌌습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 그룹 내의 보이지 않는 갈등을 감지하고 해결하려 노력했습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 자신을 희생해서라도 아이들을 지키겠다고 다짐했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 조용한 곳에서 명상을 하며 마음을 다스렸습니다.`, sanity: 5, fatigue: -10 }),
        (n, p) => ({ text: `${n}은(는) 누군가의 거짓말을 눈치챘지만 모른 척 해주었습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 말하지 않아도 동료의 아픔을 알아채고 곁을 지켰습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 세상이 멸망해도 지켜야 할 가치가 있다고 믿었습니다.`, sanity: 5, fatigue: 0 }),
        (n, p) => ({ text: `${n}은(는) 혼란스러운 상황 속에서도 평정심을 유지하려 애썼습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) "미안해..."라고 작게 속삭이며 달려드는 좀비의 숨통을 끊었습니다.`, kill: 1, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 명상을 통해 몸과 마음의 고통을 잊었습니다.`, hp: 5, sanity: 15, fatigue: -20 })
    ],
    INFP: [
        (n, p) => ({ text: `${n}은(는) 폐허 속에서도 피어난 꽃을 보고 희망을 찾았습니다.`, sanity: 10, fatigue: 0 }),
        (n, p) => ({ text: `${n}은(는) 현실의 참혹함을 견디지 못하고 구석에 숨어버렸습니다.`, sanity: -5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 낡은 일기장에 현재의 감정을 시로 기록했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 다친 길고양이를 치료하려다 긁혔습니다.`, hp: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 모두가 행복하게 사는 이상적인 은신처를 상상했습니다.`, fatigue: 0 }),
        (n, p) => ({ text: `${n}은(는) 소중한 물건을 잃어버리고 하루 종일 우울해했습니다.`, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 좀비에게도 영혼이 남아있을지 모른다고 생각했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 숲속의 작은 오두막을 발견하고 그곳에서 살고 싶어했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 싸움을 피하기 위해 자신의 의견을 숨겼습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 우연히 발견한 책 한 권에 깊이 빠져들었습니다.`, sanity: 5, fatigue: -5 }),
        (n, p) => ({ text: `${n}은(는) 아무도 없는 곳에서 조용히 눈물을 흘렸습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 아름다운 노을을 보며 잠시 모든 시름을 잊었습니다.`, sanity: 5, fatigue: -10 }),
        (n, p) => ({ text: `${n}은(는) 삭막한 세상에서도 자신만의 낭만을 찾으려 했습니다.`, sanity: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 공포에 질려 눈을 감고 마구 휘두른 쇠지렛대에 좀비가 쓰러졌습니다.`, kill: 1, sanity: -5, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 따뜻한 햇살 아래서 낮잠을 잤습니다.`, hp: 5, sanity: 10, fatigue: -30 })
    ],
    ENFJ: [
        (n, p) => ({ text: `${n}은(는) 모두의 사기를 북돋우기 위해 열정적인 연설을 했습니다.`, sanity: 10, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 갈등이 생긴 생존자들 사이를 중재하여 화해시켰습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 동료를 구하기 위해 위험을 무릅쓰고 뛰어들었습니다.`, hp: -15, sanity: 10, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 그룹의 화합을 위해 작은 캠프파이어 자리를 마련했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 타인의 고통을 자신의 것처럼 느껴 괴로워했습니다.`, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 낯선 생존자를 발견하고 그를 그룹에 받아들여야 한다고 설득했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 모두에게 역할을 부여하여 소속감을 느끼게 했습니다.`, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 리더의 부담감 때문에 남몰래 힘들어했습니다.`, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 죽은 동료를 위해 작은 장례식을 치러주었습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 이기적인 행동을 하는 사람에게 크게 실망했습니다.`, sanity: -5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) "우린 할 수 있어!"라며 끊임없이 격려했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 자신의 안위보다 집단의 이익을 최우선으로 생각했습니다.`, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 따뜻한 말 한마디로 얼어붙은 분위기를 녹였습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 모두가 탈출할 시간을 벌기 위해 홀로 남아서 좀비 무리를 막아냈습니다.`, kill: 2, hp: -10, fatigue: 30 }),
        (n, p) => ({ text: `${n}은(는) 서로의 어깨를 주물러주며 피로를 풀었습니다.`, hp: 5, sanity: 10, fatigue: -20 })
    ],
    ENFP: [
        (n, p) => ({ text: `${n}은(는) 버려진 악기를 발견하고 서툰 연주를 시작했습니다.`, sanity: 10, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 충동적으로 낯선 건물에 들어갔다가 뜻밖의 물자를 발견했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 좀비 아포칼립스 이후의 세상을 긍정적으로 상상하며 이야기했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 한 곳에 머무르는 것을 답답해하며 위험한 정찰을 자처했습니다.`, hp: -5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 특이한 장난감을 주워와서 모두에게 보여주며 웃었습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 우울해하는 친구를 위해 깜짝 이벤트를 준비했습니다.`, sanity: 10, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 호기심을 참지 못하고 금지된 구역에 들어갔다 왔습니다.`, hp: -2, sanity: -2, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 좀비 분장을 하고 동료를 놀래키다 맞을 뻔했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) "우린 반드시 살아서 바다를 보러 갈 거야!"라고 외쳤습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 감정 기복이 심해져서 울다가 웃다가 했습니다.`, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 기발한 아이디어로 고장 난 장비를 고쳤습니다(아마도 운으로).`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 새로운 사람을 만나자마자 친구가 되었습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 쏟아지는 비를 맞으며 춤을 추었습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 무거운 간판을 실수로 떨어뜨렸는데, 그 아래 있던 좀비가 깔려버렸습니다!`, kill: 1, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 비타민을 발견하고 아이처럼 기뻐하며 먹었습니다.`, hp: 5, sanity: 10, fatigue: -10 })
    ],

    ISTJ: [
        (n, p) => ({ text: `${n}은(는) 재고 조사를 철저히 하여 식량이 부족함을 정확히 알렸습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 정해진 수칙대로 한치의 오차도 없이 경계 근무를 섰습니다.`, sanity: 0, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 무질서하고 계획 없는 상황에 극심한 스트레스를 받았습니다.`, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 과거의 경험을 되살려 오래된 발전기를 수리했습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 안전이 확인된 경로만을 고집하여 이동 시간을 지체시켰습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 탄약 수를 하나하나 세어 장부에 기록했습니다.`, sanity: 2, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 약속된 시간을 지키지 않은 동료에게 잔소리를 했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 부실한 벽을 하루 종일 보강 공사했습니다.`, hp: -2, sanity: 5, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 만약의 사태를 대비해 플랜 B, C까지 세워두었습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 감정에 휘둘리지 않고 냉정하게 좀비를 처치했습니다.`, kill: 1, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 유통기한이 지난 약품을 분류하여 폐기했습니다.`, sanity: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 정해진 식사량을 정확하게 배분했습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 흐트러진 짐을 다시 정리하며 마음의 안정을 찾았습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 구급상자를 매뉴얼대로 사용하여 상처를 치료했습니다.`, hp: 15, fatigue: -10 })
    ],
    ISFJ: [
        (n, p) => ({ text: `${n}은(는) 부상당한 동료들의 상처를 정성껏 소독하고 돌봤습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 모두가 잠든 사이 조용히 주변을 청소하고 정리했습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 잃어버린 가족의 사진을 보며 눈물을 흘렸습니다.`, sanity: -5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 구할 수 있는 재료로 따뜻한 스튜를 만들었습니다.`, hp: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 위기의 순간 자신의 안위보다 동료의 방패가 되기를 자처했습니다.`, hp: -10, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 모두의 생일을 기억하고 작은 선물을 챙겨주었습니다.`, sanity: 10, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 거절을 못해서 자신의 몫보다 더 많은 일을 떠맡았습니다.`, hp: -5, sanity: -2, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 구석에 핀 야생화를 꺾어 테이블을 장식했습니다.`, sanity: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 다툰 사람들 사이에서 눈치를 보며 어쩔 줄 몰라했습니다.`, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 과거의 평화로웠던 시절을 회상하며 이야기를 나누었습니다.`, sanity: 5, fatigue: -5 }),
        (n, p) => ({ text: `${n}은(는) 동료가 잠들 때까지 곁에서 지켜주었습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 자신의 식량을 몰래 배고픈 동료 가방에 넣어두었습니다.`, hp: -2, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 누군가의 거친 말에 상처받았지만 내색하지 않았습니다.`, sanity: -5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 떨리는 손으로 프라이팬을 휘둘러 소중한 사람에게 다가가는 좀비를 쓰러뜨렸습니다.`, kill: 1, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 따뜻한 물수건으로 몸을 닦으며 기력을 회복했습니다.`, hp: 10, sanity: 5, fatigue: -20 })
    ],
    ESTJ: [
        (n, p) => ({ text: `${n}은(는) 캠프의 보안 상태를 점검하고 즉각적인 보강 공사를 지시했습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 게으름을 피우는 동료에게 따끔하게 훈계를 했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 효율적인 좀비 처리 메뉴얼을 만들고 훈련시켰습니다.`, kill: 2, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 전통적인 방식의 훈제 보존식을 만들어 식량을 비축했습니다.`, hp: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 그룹의 규율을 확립하기 위해 긴급 회의를 소집했습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 식량 배급 원칙을 엄격하게 적용하여 불만을 샀습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 조직적인 수색 작전을 펼쳐 많은 물자를 확보했습니다.`, sanity: 5, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 권위에 도전하는 사람과 충돌했습니다.`, hp: -2, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 모두가 잠든 새벽, 홀로 장비 점검을 마쳤습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) "우리는 살아남아야 할 의무가 있다"고 강조했습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 감염 예방 수칙을 어긴 사람을 격리 조치했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 모든 결정에 책임을 지며 앞장섰습니다.`, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 혼란스러운 상황을 통제하며 질서를 부여했습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 규칙적인 휴식으로 컨디션을 회복했습니다.`, hp: 10, fatigue: -25 })
    ],
    ESFJ: [
        (n, p) => ({ text: `${n}은(는) 생존자들의 생일을 기억해내고 작게나마 축하해주었습니다.`, sanity: 10, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 모두의 상태를 일일이 확인하며 안부를 물었습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 그룹 내의 불화를 잠재우기 위해 동분서주했습니다.`, sanity: -5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 누군가 자신을 소외시킨다고 느껴 우울해했습니다.`, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 보급품을 공평하게 나누어 주며 불만을 잠재웠습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 빨래를 모아 세탁하며 위생을 관리했습니다.`, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 힘들어하는 동료의 손을 잡고 끝까지 들어주었습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 사소한 소문을 퍼뜨려 분위기를 묘하게 만들었습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 모두가 모여 식사하는 시간을 중요하게 여겼습니다.`, hp: 2, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) "우리 모두 다 같이 살아야 해"라며 팀워크를 강조했습니다.`, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 맛없는 비상식량을 어떻게든 맛있게 요리하려 노력했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 그룹의 사기를 위해 재미있는 이야기를 주도했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 누군가가 자신을 싫어할까 봐 전전긍긍했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 식량 창고를 습격한 좀비를 국자로 쫓아내며 처치했습니다.`, kill: 1, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 맛있는 요리를 만들어 배불리 먹었습니다.`, hp: 10, sanity: 5, fatigue: -15 })
    ],

    ISTP: [
        (n, p) => ({ text: `${n}은(는) 고장난 차량을 수리하여 이동 수단을 확보했습니다.`, sanity: 10, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 쇠파이프를 깎아 날카로운 창을 만들었습니다.`, kill: 1, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 혼자 정찰을 나갔다가 좀비 무리를 따돌리고 무사히 돌아왔습니다.`, hp: -2, sanity: 5, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 복잡한 감정 싸움에 휘말리기 싫어 자리를 피했습니다.`, sanity: 2, fatigue: -5 }),
        (n, p) => ({ text: `${n}은(는) 위기의 순간 놀라운 반사신경으로 좀비의 머리를 날렸습니다.`, kill: 3, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 가장 효율적인 살상 방법을 연구했습니다.`, kill: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 말없이 구석에서 고장 난 라디오를 고쳤습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 지루함을 참지 못하고 혼자 위험한 스턴트를 감행했습니다.`, hp: -5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 상황을 분석하기보다 몸으로 부딪혀 해결했습니다.`, kill: 1, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 필요한 말만 골라서 하여 에너지를 아꼈습니다.`, fatigue: -5 }),
        (n, p) => ({ text: `${n}은(는) 빈 병을 이용해 소음기를 만들었습니다.`, kill: 1, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 닫힌 금고를 옷핀 하나로 열어 사람들을 놀라게 했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 맨손으로 물고기를 잡아와 저녁 거리를 마련했습니다.`, hp: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 붕대를 감고 빠르게 회복했습니다.`, hp: 10, fatigue: -10 })
    ],
    ISFP: [
        (n, p) => ({ text: `${n}은(는) 벽에 그림을 그리며 삭막한 곳에서 마음의 평화를 찾았습니다.`, sanity: 10, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 갑자기 나타난 좀비에게서 숨막히는 은신 능력을 보여주었습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 숲속에서 먹을 수 있는 열매를 찾아왔습니다.`, hp: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 계속되는 갈등 상황을 견디지 못하고 뛰쳐나갈 뻔했습니다.`, sanity: -10, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) ${p}의 독특한 감각으로 주변 지형지물을 이용한 위장막을 만들었습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 다친 사슴을 발견하고 치료해주려 노력했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 무기를 아름답게 장식하며 시간을 보냈습니다.`, sanity: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 아무도 모르게 좀비 한 마리를 조용히 처치했습니다.`, kill: 1, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 쏟아지는 별을 보며 눈물을 흘렸습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 자신의 가치관에 어긋나는 명령을 거부했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 동물의 뼈로 작은 장신구를 만들었습니다.`, sanity: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 예기치 못한 순간에 용기를 발휘해 동료를 구했습니다.`, hp: -5, sanity: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 조용히 콧노래를 흥얼거려 주변을 안심시켰습니다.`, fatigue: 0 }),
        (n, p) => ({ text: `${n}은(는) 숲에서 약초를 찾아 상처에 발랐습니다.`, hp: 15, fatigue: -10 })
    ],
    ESTP: [
        (n, p) => ({ text: `${n}은(는) 위험한 상황을 즐기며 좀비와 추격전을 벌였습니다.`, hp: -10, kill: 2, fatigue: 25 }),
        (n, p) => ({ text: `${n}은(는) 누가 더 많은 좀비를 잡나 내기를 걸어 식량을 따냈습니다.`, sanity: 5, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 직관적인 판단으로 무너지는 건물에서 가장 먼저 탈출했습니다.`, hp: -2, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 답답함을 참지 못하고 오토바이를 찾아 주변을 질주했습니다.`, sanity: 5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 즉석에서 화염병을 만들어 좀비 무리에 던져버렸습니다.`, kill: 5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 좀비 떼 한가운데로 뛰어들어 무쌍을 찍었습니다.`, hp: -20, kill: 10, fatigue: 40 }),
        (n, p) => ({ text: `${n}은(는) 우연히 발견한 술을 마시며 호탕하게 웃었습니다.`, sanity: 10, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 계획보다는 임기응변으로 위기를 모면했습니다.`, sanity: 2, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 지루하다며 위험한 사격 연습을 제안했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 협상보다는 주먹이 빠르다는 것을 보여주었습니다.`, hp: -5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 버려진 스포츠카를 발견하고 환호성을 질렀습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 벌레를 잡아먹는 내기를 하여 사람들을 경악하게 했습니다.`, sanity: 2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 위험한 구역에 가장 먼저 뛰어들었습니다.`, hp: -5, fatigue: 20 }),
        (n, p) => ({ text: `${n}은(는) 고단백 통조림을 발견하고 혼자 다 먹었습니다.`, hp: 20, fatigue: -10 })
    ],
    ESFP: [
        (n, p) => ({ text: `${n}은(는) 춤과 노래로 칙칙한 캠프의 분위기를 반전시켰습니다.`, sanity: 10, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 충동적으로 닫힌 문을 열었다가 좀비를 마주쳤습니다.`, hp: -10, sanity: -5, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 백화점 폐허에서 화려한 옷을 발견하고 입어보며 즐거워했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 모두의 주목을 받으며 용감하게 소리를 질러 좀비를 유인했습니다.`, hp: -5, kill: 1, fatigue: 15 }),
        (n, p) => ({ text: `${n}은(는) 현재의 순간에 집중하며 유통기한이 남은 맛있는 통조림을 발견해 환호했습니다.`, fatigue: 0 }),
        (n, p) => ({ text: `${n}은(는) 무서운 이야기를 실감 나게 해서 모두를 공포에 떨게 했습니다.`, sanity: -2, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 우연히 발견한 화장품으로 치장하며 즐거워했습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 심각한 회의 시간에 딴청을 피우다 지적받았습니다.`, sanity: -2, fatigue: 0 }),
        (n, p) => ({ text: `${n}은(는) 좀비 흉내를 내며 장난치다가 진짜 좀비에게 들킬 뻔했습니다.`, hp: -2, sanity: -5, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 파티를 열자고 제안하며 숨겨둔 과자를 꺼냈습니다.`, sanity: 10, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 그림자 놀이로 아이들을 즐겁게 해주었습니다.`, sanity: 5, fatigue: 5 }),
        (n, p) => ({ text: `${n}은(는) 거울이 없다며 불평했지만 금세 웃어넘겼습니다.`, sanity: 2, fatigue: 2 }),
        (n, p) => ({ text: `${n}은(는) 분위기 메이커 역할을 톡톡히 해냈습니다.`, fatigue: 10 }),
        (n, p) => ({ text: `${n}은(는) 잘 먹고 잘 자는 것이 생존 비결이라며 푹 잤습니다.`, hp: 10, sanity: 10, fatigue: -30 })
    ]
};

// Detailed actions for each of the 16 MBTI types
export const MBTI_SPECIFIC_ACTIONS: Record<MBTI, (name: string, gender: Gender) => ActionEffect> = Object.keys(MBTI_EVENT_POOL).reduce((acc, key) => {
    const mbti = key as MBTI;
    acc[mbti] = (name: string, gender: Gender) => {
        const pool = MBTI_EVENT_POOL[mbti];
        const generator = pool[Math.floor(Math.random() * pool.length)];
        return generator(name, getPronoun(gender));
    };
    return acc;
}, {} as Record<MBTI, (name: string, gender: Gender) => ActionEffect>);
