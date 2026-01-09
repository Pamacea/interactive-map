/**
 * Pin type definitions and color mappings
 * Inspired by League of Legends, Chrono Odyssey, Aion 2
 */

export enum PinType {
  CITY = 'CITY',
  VILLAGE = 'VILLAGE',
  POI = 'POI',
  CHARACTER = 'CHARACTER',
  DUNGEON = 'DUNGEON',
  SHOP = 'SHOP',
  QUEST = 'QUEST',
  TREASURE = 'TREASURE',
}

export interface PinTypeConfig {
  primary: string;
  glow: string;
  icon: string;
  label: string;
  description: string;
}

export const PIN_TYPE_CONFIG: Record<PinType, PinTypeConfig> = {
  [PinType.CITY]: {
    primary: '#c9a227',
    glow: 'rgba(201, 162, 39, 0.4)',
    icon: '🏰',
    label: 'Golden City',
    description: 'Major settlements and capitals',
  },
  [PinType.VILLAGE]: {
    primary: '#8b7355',
    glow: 'rgba(139, 115, 85, 0.4)',
    icon: '🏘️',
    label: 'Earthy Village',
    description: 'Small towns and hamlets',
  },
  [PinType.POI]: {
    primary: '#4a9eff',
    glow: 'rgba(74, 158, 255, 0.4)',
    icon: '📍',
    label: 'Azure Point',
    description: 'Points of interest',
  },
  [PinType.CHARACTER]: {
    primary: '#9b59b6',
    glow: 'rgba(155, 89, 182, 0.4)',
    icon: '👤',
    label: 'Mystic Character',
    description: 'NPCs and story characters',
  },
  [PinType.DUNGEON]: {
    primary: '#e74c3c',
    glow: 'rgba(231, 76, 60, 0.4)',
    icon: '⚔️',
    label: 'Crimson Dungeon',
    description: 'Dangerous areas and instances',
  },
  [PinType.SHOP]: {
    primary: '#2ecc71',
    glow: 'rgba(46, 204, 113, 0.4)',
    icon: '🛒',
    label: 'Emerald Trade',
    description: 'Merchants and services',
  },
  [PinType.QUEST]: {
    primary: '#f39c12',
    glow: 'rgba(243, 156, 18, 0.4)',
    icon: '❓',
    label: 'Amber Quest',
    description: 'Quest givers and objectives',
  },
  [PinType.TREASURE]: {
    primary: '#1abc9c',
    glow: 'rgba(26, 188, 156, 0.4)',
    icon: '💎',
    label: 'Teal Treasure',
    description: 'Loot and hidden items',
  },
};

export function getPinTypeColor(type: PinType): string {
  return PIN_TYPE_CONFIG[type].primary;
}

export function getPinTypeGlow(type: PinType): string {
  return PIN_TYPE_CONFIG[type].glow;
}

export function getPinTypeIcon(type: PinType): string {
  return PIN_TYPE_CONFIG[type].icon;
}
