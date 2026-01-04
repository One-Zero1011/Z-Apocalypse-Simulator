
import { Character, CharacterUpdate, Ending, GameSettings, Status } from '../types';

/**
 * 시뮬레이션 결과를 바탕으로 엔딩 조건을 검사하는 함수
 */
export const checkEnding = (
    day: number,
    characters: Character[],
    updates: CharacterUpdate[],
    currentInventory: string[],
    storyNodeId: string | null,
    settings: GameSettings,
    viewedEndings: string[] = [] // 이미 본 엔딩 목록
): Ending | null => {
    if (!settings.enableEndings) return null;

    // Helper to check if ending was already viewed
    const isNew = (id: string) => !viewedEndings.includes(id);

    // 1. 이번 턴의 업데이트가 반영된 가상 상태 계산
    const nextStateChars = characters.map(c => {
        const u = updates.find(up => up.id === c.id);
        if (!u) return c;
        return {
            ...c,
            status: u.status || c.status,
            hp: (c.hp + (u.hpChange || 0)),
            sanity: (c.sanity + (u.sanityChange || 0)),
            fatigue: (c.fatigue + (u.fatigueChange || 0)),
            killCount: c.killCount + (u.killCountChange || 0),
            hasMuzzle: u.hasMuzzle !== undefined ? u.hasMuzzle : c.hasMuzzle
        };
    });

    const aliveHumans = nextStateChars.filter(c => c.status === 'Alive' || c.status === 'Infected');
    const zombies = nextStateChars.filter(c => c.status === 'Zombie');
    const totalLivingCount = aliveHumans.length + zombies.length;

    // 통계 계산
    const totalKills = nextStateChars.reduce((sum, c) => sum + c.killCount, 0);
    const avgSanity = aliveHumans.length > 0 ? aliveHumans.reduce((sum, c) => sum + c.sanity, 0) / aliveHumans.length : 0;
    const avgFatigue = aliveHumans.length > 0 ? aliveHumans.reduce((sum, c) => sum + c.fatigue, 0) / aliveHumans.length : 100;

    // 조건 판별 변수
    const hasMedicalExpert = aliveHumans.some(c => ['의사', '연구원', '약사'].includes(c.job));
    const hasTechExpert = aliveHumans.some(c => ['목수', '기술자(엔지니어)', '건축가'].includes(c.job));
    const vaccineCount = currentInventory.filter(i => i === '백신').length;
    const hasRadio = currentInventory.includes('무전기');
    const hasMap = currentInventory.includes('지도');
    const muzzledZombiesCount = zombies.filter(z => z.hasMuzzle).length;

    // --- 엔딩 조건 검사 ---

    // 1. [BAD] 인류의 황혼 (전멸) - 최우선 순위 (항상 발동 가능)
    if (totalLivingCount === 0 && isNew('extinction')) {
        return {
            id: 'extinction',
            title: '인류의 황혼',
            description: '모든 생존자가 사망하거나 사라졌습니다. 고요한 폐허 속에 인류의 흔적만이 바람에 흩날립니다.',
            icon: '💀',
            type: 'BAD'
        };
    }

    // 2. [GOOD] 안전 지대로 (스토리 이벤트)
    if (storyNodeId && storyNodeId.includes('rescue_success') && isNew('rescue_success')) {
        return {
            id: 'rescue_success',
            title: '안전 지대로',
            description: '극적인 구조 끝에 안전한 곳으로 이송되었습니다. 지옥 같던 날들은 이제 기억 속에만 남을 것입니다.',
            icon: '🚁',
            type: 'GOOD'
        };
    }

    // 3. [GOOD] 치료제 개발
    // 조건: 30일 이상, 의료 전문가 생존, 백신 3개 이상 보유
    if (day >= 30 && hasMedicalExpert && vaccineCount >= 3 && isNew('cure_found')) {
        return {
            id: 'cure_found',
            title: '치료제 개발',
            description: '당신들의 끈질긴 노력 끝에 바이러스 치료제를 개발했습니다. 인류 구원의 열쇠가 당신들 손에 있습니다.',
            icon: '🧬',
            type: 'GOOD'
        };
    }

    // 4. [GOOD] 외부와의 교신
    // 조건: 40일 이상, 무전기와 지도 보유
    if (day >= 40 && hasRadio && hasMap && isNew('global_contact')) {
        return {
            id: 'global_contact',
            title: '외부와의 교신',
            description: '지도를 보고 무전 주파수를 맞추자 잡음 너머로 사람의 목소리가 들려옵니다. 우리는 혼자가 아니었습니다.',
            icon: '📡',
            type: 'GOOD'
        };
    }

    // 5. [GOOD] 완벽한 요새
    // 조건: 60일 이상, 기술 전문가 생존, 평균 피로도 20 미만 (안락함)
    if (day >= 60 && hasTechExpert && avgFatigue < 20 && isNew('fortress')) {
        return {
            id: 'fortress',
            title: '완벽한 요새',
            description: '폐허 위에 난공불락의 요새를 건설했습니다. 이곳에서라면 좀비도, 추위도, 굶주림도 두렵지 않습니다.',
            icon: '🏰',
            type: 'GOOD'
        };
    }

    // 6. [SPECIAL] 기묘한 공존
    // 조건: 50일 이상, 입마개한 좀비 2명 이상, 생존자 2명 이상
    if (day >= 50 && muzzledZombiesCount >= 2 && aliveHumans.length >= 2 && isNew('coexistence')) {
        return {
            id: 'coexistence',
            title: '기묘한 공존',
            description: '우리는 그들을 죽이지 않기로 했습니다. 비록 모습은 변했지만, 그들은 여전히 우리의 가족이자 동료입니다.',
            icon: '🧟❤️🧑',
            type: 'SPECIAL'
        };
    }

    // 7. [NEUTRAL] 황무지의 학살자
    // 조건: 40일 이상, 누적 킬 수 100 이상
    if (day >= 40 && totalKills >= 100 && isNew('slayers')) {
        return {
            id: 'slayers',
            title: '황무지의 학살자',
            description: '더 이상 좀비를 두려워하지 않습니다. 우리는 이 죽음의 땅에서 최상위 포식자로 거듭났습니다.',
            icon: '⚔️',
            type: 'NEUTRAL'
        };
    }

    // 8. [BAD] 광기의 숭배
    // 조건: 30일 이상, 생존자 3명 이상, 평균 정신력 10 이하
    if (day >= 30 && aliveHumans.length >= 3 && avgSanity <= 10 && isNew('cult_madness')) {
        return {
            id: 'cult_madness',
            title: '광기의 숭배',
            description: '이성이 마비된 집단은 새로운 신을 찾았습니다. "우리는 깨달았습니다. 좀비가 된 것이 아니라, 진화한 것임을..."',
            icon: '👁️',
            type: 'BAD'
        };
    }

    // 9. [BAD] 고독한 생존자
    // 조건: 365일 이상, 생존자 단 1명, 좀비 동료 없음
    // (조건이 365일로 상향 조정됨)
    if (day >= 365 && aliveHumans.length === 1 && zombies.length === 0 && isNew('lone_survivor')) {
        return {
            id: 'lone_survivor',
            title: '고독한 생존자',
            description: '1년이라는 시간이 지났습니다. 모두가 떠나고 혼자 남았습니다. 좀비보다 더 무서운 것은 뼈에 사무치는 고독입니다.',
            icon: '🚶',
            type: 'BAD'
        };
    }

    // 10. [GOOD] 새로운 시작 (기본 생존 엔딩)
    // 조건: 365일 도달 (고독한 생존자가 아닐 경우)
    if (day >= 365 && isNew('survival_1year')) {
        return {
            id: 'survival_1year',
            title: '새로운 시작',
            description: '1년이라는 긴 시간 동안 지옥에서 살아남았습니다. 당신들은 이제 단순한 생존자가 아닌, 새로운 세계의 개척자입니다.',
            icon: '🌅',
            type: 'GOOD'
        };
    }

    return null;
};
