import { AbilityScores, CharacterClass, FantasyCharacter } from './fantasyGenerator';

export interface EncounterChallenge {
  id: string;
  title: string;
  description: string;
  ability: keyof AbilityScores;
  abilityLabel: string;
  dc: number;
  xpReward: number;
  successText: string;
  failureText: string;
}

export interface RollResult {
  encounterId: string;
  d20: number;
  modifier: number;
  proficiencyBonus: number;
  total: number;
  dc: number;
  success: boolean;
  isCritSuccess: boolean;
  isCritFail: boolean;
  xpEarned: number;
}

const CLASS_HIT_DIE: Record<CharacterClass, number> = {
  Warrior: 10,
  Paladin: 10,
  Ranger: 10,
  Cleric: 8,
  Rogue: 8,
  Bard: 8,
  Druid: 8,
  Mage: 6,
};

const CLASS_BASE_AC: Record<CharacterClass, number> = {
  Warrior: 15,
  Paladin: 16,
  Cleric: 14,
  Ranger: 13,
  Rogue: 12,
  Druid: 12,
  Bard: 12,
  Mage: 10,
};

export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXpProgressInLevel(xp: number): number {
  return xp % 100;
}

export function getProficiencyBonus(level: number): number {
  return 2 + Math.floor((level - 1) / 4);
}

export function getMaxHp(character: FantasyCharacter, level: number): number {
  const hitDie = CLASS_HIT_DIE[character.characterClass];
  const conMod = Math.floor((character.attributes.con - 10) / 2);
  const perLevelAvg = Math.floor(hitDie / 2) + 1;
  const baseHp = Math.max(4, hitDie + conMod);
  const extraHp = (level - 1) * Math.max(2, perLevelAvg + conMod);
  return baseHp + extraHp;
}

export function getArmorClass(character: FantasyCharacter): number {
  const base = CLASS_BASE_AC[character.characterClass];
  const dexMod = Math.floor((character.attributes.dex - 10) / 2);
  // Heavy armor classes cap DEX bonus at +1 for realistic tabletop balance
  const effectiveDex =
    character.characterClass === 'Paladin' || character.characterClass === 'Warrior'
      ? Math.min(1, dexMod)
      : dexMod;
  return base + effectiveDex;
}

export const ENCOUNTER_POOL: Omit<EncounterChallenge, 'id'>[] = [
  {
    title: 'Breach the Ironbound Vault',
    description: 'An ancient apothecary chest sits locked behind a rusted twin-tumbler mechanism.',
    ability: 'dex',
    abilityLabel: 'DEX',
    dc: 13,
    xpReward: 50,
    successText: 'With steady hands, the tumblers click open to reveal rare alchemical reagents.',
    failureText: 'A tension spring snaps inside the lock, jamming the latch shut.',
  },
  {
    title: 'Decipher the Ash-Stained Grimoire',
    description: 'Faded celestial ciphers cover the margin of a charred spell ledger.',
    ability: 'int',
    abilityLabel: 'INT',
    dc: 13,
    xpReward: 50,
    successText: 'You translate the hidden sigils and uncover a forgotten cellar passage.',
    failureText: 'The archaic ink smudges beneath the lantern light before yielding its secret.',
  },
  {
    title: 'Hold the Collapsing Gate',
    description: 'An iron portcullis shudders and begins dropping across the dungeon corridor.',
    ability: 'str',
    abilityLabel: 'STR',
    dc: 14,
    xpReward: 60,
    successText: 'You brace your shoulders beneath the iron bars and wedge the gate open.',
    failureText: 'The heavy grate slams into the flagstones, forcing a longer detour.',
  },
  {
    title: 'Parley with the Bridge Watch',
    description: 'Suspicious lantern-bearers demand tolls and proof of safe passage at midnight.',
    ability: 'cha',
    abilityLabel: 'CHA',
    dc: 12,
    xpReward: 45,
    successText: 'Your calm persuasion wins safe crossing and a tip about patrols ahead.',
    failureText: 'The captain narrows his eyes and turns your party back toward the crossroads.',
  },
  {
    title: 'Track the Mist Stalker',
    description: 'Faint clawed footprints vanish into swirling bog reeds at dusk.',
    ability: 'wis',
    abilityLabel: 'WIS',
    dc: 13,
    xpReward: 50,
    successText: 'You spot broken sedge stems and ambush the creature from higher ground.',
    failureText: 'The fog thickens and the trail goes cold before you reach the ridge.',
  },
  {
    title: 'Resist the Sulfur Fumes',
    description: 'A cracked alchemical retort fills the stone chamber with bitter yellow vapor.',
    ability: 'con',
    abilityLabel: 'CON',
    dc: 13,
    xpReward: 50,
    successText: 'You steady your breathing, seal the cracked flask, and clear the chamber.',
    failureText: 'The acrid fumes force a hasty retreat up the stone stairwell.',
  },
  {
    title: 'Leap the Shattered Span',
    description: 'A ten-foot gap separates the ruined watchtower from the outer parapet.',
    ability: 'dex',
    abilityLabel: 'DEX',
    dc: 14,
    xpReward: 60,
    successText: 'You clear the crumbling masonry in one clean bound and secure a rope.',
    failureText: 'Loose mortar gives way underfoot, leaving you scrambling back to the ledge.',
  },
  {
    title: 'Sense the Ward Trap',
    description: 'Faint silver threads hum quietly along the threshold of the inner sanctum.',
    ability: 'wis',
    abilityLabel: 'WIS',
    dc: 14,
    xpReward: 60,
    successText: 'You trace the ward’s anchor rune and step safely past the trigger line.',
    failureText: 'A chime rings through the hall as the tripwire discharges harmlessly.',
  },
];

export function pickEncounter(excludeTitle?: string): EncounterChallenge {
  const candidates = excludeTitle
    ? ENCOUNTER_POOL.filter((item) => item.title !== excludeTitle)
    : ENCOUNTER_POOL;
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    ...chosen,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
}

export function resolveEncounterCheck(
  character: FantasyCharacter,
  encounter: EncounterChallenge,
  level: number,
): RollResult {
  const d20 = Math.floor(Math.random() * 20) + 1;
  const modifier = Math.floor((character.attributes[encounter.ability] - 10) / 2);
  const isPrimaryAbility =
    (character.characterClass === 'Warrior' && (encounter.ability === 'str' || encounter.ability === 'con')) ||
    (character.characterClass === 'Mage' && (encounter.ability === 'int' || encounter.ability === 'wis')) ||
    (character.characterClass === 'Rogue' && (encounter.ability === 'dex' || encounter.ability === 'cha')) ||
    (character.characterClass === 'Ranger' && (encounter.ability === 'dex' || encounter.ability === 'wis')) ||
    (character.characterClass === 'Paladin' && (encounter.ability === 'str' || encounter.ability === 'cha')) ||
    (character.characterClass === 'Cleric' && (encounter.ability === 'wis' || encounter.ability === 'con')) ||
    (character.characterClass === 'Bard' && (encounter.ability === 'cha' || encounter.ability === 'dex')) ||
    (character.characterClass === 'Druid' && (encounter.ability === 'wis' || encounter.ability === 'int'));

  const proficiencyBonus = isPrimaryAbility ? getProficiencyBonus(level) : 0;
  const total = d20 + modifier + proficiencyBonus;
  const isCritSuccess = d20 === 20;
  const isCritFail = d20 === 1;
  const success = isCritSuccess || (!isCritFail && total >= encounter.dc);
  const xpEarned = success ? (isCritSuccess ? encounter.xpReward + 25 : encounter.xpReward) : 10;

  return {
    encounterId: encounter.id,
    d20,
    modifier,
    proficiencyBonus,
    total,
    dc: encounter.dc,
    success,
    isCritSuccess,
    isCritFail,
    xpEarned,
  };
}
