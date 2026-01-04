
import { Character, CharacterUpdate, GameSettings, MentalState } from '../../types';
import { MAX_INFECTION } from '../../constants';
import { getCharacterUpdate } from './utils';

export const processStatusChanges = (characters: Character[], updates: CharacterUpdate[], events: string[], settings: GameSettings) => {
    characters.forEach(c => {
        const u = getCharacterUpdate(updates, c.id);
        
        // Mental State Logic
        if (settings.useMentalStates) {
            if (c.mentalState === 'Normal' && c.sanity <= 50 && Math.random() < 0.4) {
                const possibleStates: MentalState[] = ['Trauma', 'Despair', 'Delusion', 'Anxiety', 'Madness'];
                const newState = possibleStates[Math.floor(Math.random() * possibleStates.length)];
                u.mentalState = newState;
                events.push(`🧠 [정신 붕괴] ${c.name}은(는) 계속되는 악몽을 견디지 못하고 [${newState}] 상태에 빠졌습니다.`);
            }
            else if (c.mentalState !== 'Normal' && c.sanity >= 70 + (((c.maxSanity/10) - 10) *10)  && Math.random() < 0.1) {
                u.mentalState = 'Normal';
                events.push(`✨ [정신 회복] ${c.name}은(는) 안정을 되찾고 정신적 고통에서 벗어났습니다.`);
            }
        } else {
            if (c.mentalState !== 'Normal') u.mentalState = 'Normal';
        }

        // Zombie Hunger Logic
        if (c.status === 'Zombie') {
            if (c.hunger <= 10) {
                u.hpChange = (u.hpChange || 0) - 5;
                events.push(`🦴 [굶주림] 좀비가 된 ${c.name}이(가) 심한 허기로 인해 신체 조직이 썩어갑니다.`);
            }
        }

        // Alive -> Infected State Change
        if (c.status === 'Alive' && (c.infection + (u.infectionChange || 0)) > 0) {
            u.status = 'Infected';
            events.push(`🦠 [감염] ${c.name}의 상처 부위가 곪아 들어가며 감염 증세가 나타납니다.`);
        }
        
        // Infected -> Alive State Change (Cure)
        if (c.status === 'Infected' && (c.infection + (u.infectionChange || 0)) <= 0) {
            u.status = 'Alive';
            events.push(`✨ [완치] ${c.name}의 감염 증세가 기적적으로 호전되었습니다.`);
        }

        // Infection Crisis (Vote)
        if (c.status === 'Infected' || (c.infection > 0 && c.status === 'Alive')) {
            const currentInfection = c.infection + (u.infectionChange || 0);
            if (currentInfection >= MAX_INFECTION) {
                let voteScore = 0;
                // 감염자 본인을 제외하고, 생존(Alive)하거나 감염된(Infected) 동료들이 투표에 참여
                const voters = characters.filter(v => v.id !== c.id && (v.status === 'Alive' || v.status === 'Infected'));
                
                voters.forEach(v => {
                    if (v.mbti.includes('F')) voteScore += 2; else voteScore -= 2;
                    const affinity = v.relationships[c.id] || 0;
                    if (affinity >= 50) voteScore += 4;
                    if (affinity <= -20) voteScore -= 3;
                    const rel = v.relationshipStatuses[c.id];
                    if (['Lover', 'Spouse', 'Parent', 'Child', 'Sibling', 'Family', 'Savior', 'Guardian', 'Ward'].includes(rel || '')) {
                        voteScore += 15;
                    }
                });

                if (voteScore > 0 || voters.length === 0) {
                    u.status = 'Zombie';
                    events.push(`🧟 [전환 투표] ${c.name}이(가) 끝내 좀비로 변했습니다. 동료들은 차마 그를 버리지 못하고 구속하여 데리고 가기로 했습니다.`);
                    voters.forEach(v => {
                        const vu = getCharacterUpdate(updates, v.id);
                        vu.griefLogAdd = `${c.name}이(가) 우리 곁을 떠나 괴물이 되었습니다. 그 눈빛을 잊을 수 없습니다.`;
                    });
                } else {
                    u.status = 'Dead';
                    u.hpChange = -999;
                    events.push(`💀 [전환 투표] ${c.name}이(가) 좀비로 변하려 하자, 동료들이 안전을 위해 그를 안식에 들게 했습니다.`);
                    voters.forEach(v => {
                        const vu = getCharacterUpdate(updates, v.id);
                        vu.griefLogAdd = `결국 우리 손으로 ${c.name}을(를) 보냈습니다. 이것이 최선이었을까요?`;
                    });
                }
            }
        }

        // Missing Logic
        if (c.status === 'Missing') {
            const rand = Math.random();
            if (rand < 0.05) { u.status = 'Alive'; events.push(`✨ [귀환] 실종되었던 ${c.name}이(가) 기적적으로 돌아왔습니다!`); }
            else if (rand < 0.08) { u.status = 'Dead'; events.push(`💀 [사망 확인] 실종된 ${c.name}의 유품이 발견되었습니다.`); }
        }

        // Death Logic
        const currentHp = c.hp + (u.hpChange || 0);
        const isDeadAlready = c.status === 'Dead' || c.status === 'Missing';
        const isInstantDeath = u.status === 'Dead';
        const isVoteDeath = u.hpChange === -999;
        const isTurningZombie = u.status === 'Zombie';

        if (!isDeadAlready && (currentHp <= 0 || isInstantDeath) && !isTurningZombie && !isVoteDeath) {
            u.status = 'Dead';
            events.push(`💀 [사망] ${c.name}이(가) 고통 끝에 숨을 거두었습니다.`);
            characters.filter(v => v.id !== c.id && v.status !== 'Dead' && v.status !== 'Missing').forEach(v => {
                const vu = getCharacterUpdate(updates, v.id);
                if (!vu.griefLogAdd) {
                    const affinity = v.relationships[c.id] || 0;
                    const relStatus = v.relationshipStatuses[c.id];
                    if (['Spouse', 'Parent', 'Child', 'Sibling', 'Family'].includes(relStatus || '') && affinity > 50) {
                        vu.griefLogAdd = `사랑하는 가족 ${c.name}이(가) 떠났습니다. 하늘이 무너지는 슬픔을 느낍니다.`
                    }
                    else if (['Spouse', 'Parent', 'Child', 'Sibling', 'Family'].includes(relStatus || '') && affinity <= 50 && affinity >= 0) {
                        vu.griefLogAdd = `가족 ${c.name}이(가) 떠났습니다. 그리 슬프진 않지만, 어째서인지 눈물이 새어나옵니다.`
                    }
                    else if (relStatus === 'Lover') {
                        vu.griefLogAdd = `사랑하는 연인 ${c.name}을(를) 잃었습니다. 더 이상 살아갈 이유를 모르겠습니다.`
                    }
                    else if (relStatus === 'Rival') {
                        vu.griefLogAdd = `라이벌인 ${c.name}을(를) 잃었습니다. 어딘가 복잡한 기분이 듭니다.`
                    }
                    else if (affinity > 50) vu.griefLogAdd = `나의 소중한 친구 ${c.name}을(를) 잃었습니다. 가슴 한구석이 텅 빈 것 같습니다.`;
                    else vu.griefLogAdd = `동료였던 ${c.name}의 죽음을 목격했습니다. 죽음은 언제나 우리 곁에 있습니다.`;
                }
            });
        }
    });
};
