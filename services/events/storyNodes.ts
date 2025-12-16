
import { StoryNode } from "../../types";
import { HOSPITAL_NODES } from "./stories/hospital";
import { WINTER_NODES } from "./stories/winter";
import { METRO_NODES } from "./stories/metro";
import { RADIO_NODES } from "./stories/radio";
import { WANDER_NODES } from "./stories/wander";
import { CULT_NODES } from "./stories/cult";
import { ONE_OFF_NODES } from "./stories/oneOffs";
import { BUNKER_NODES } from "./stories/bunker";

// =================================================================
// Story Arcs Aggregation
// =================================================================

export const STORY_NODES: Record<string, StoryNode> = {
    ...HOSPITAL_NODES,
    ...WINTER_NODES,
    ...METRO_NODES,
    ...RADIO_NODES,
    ...WANDER_NODES,
    ...CULT_NODES,
    ...ONE_OFF_NODES,
    ...BUNKER_NODES
};

// 시작 가능한 메인 아크의 첫 번째 노드 ID 목록
export const STARTER_NODE_IDS = [
    // Main Arcs
    'hospital_0_start',
    'winter_0_start',
    'metro_0_start',
    'radio_0_start',
    'wander_0_start',
    'cult_0_start',
    'bunker_0_signal', // New Bunker Story
    
    // One-offs (Expanded)
    'sunny_day',
    'foggy_day',
    'heavy_rain',
    'heatwave',
    'thunderstorm',
    'full_moon',
    'starry_night',
    'quiet_day',
    'horde_pass',
    'helicopter',
    'nightmare_shared',
    'old_music',
    'board_game',
    'stray_dog',
    'rat_swarm',
    'abandoned_truck',
    'pharmacy_ruin',
    'creepy_doll',
    'flower_field',
    'weapon_maintenance'
];
