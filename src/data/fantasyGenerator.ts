export const CHARACTER_CLASSES = [
  'Warrior',
  'Mage',
  'Rogue',
  'Ranger',
  'Paladin',
  'Cleric',
  'Bard',
  'Druid',
] as const;

export type CharacterClass = (typeof CHARACTER_CLASSES)[number];

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface CardStats {
  health: number;
  mana: number;
  strength: number;
}

export interface FantasyCharacter {
  id: string;
  name: string;
  epithet: string;
  characterClass: CharacterClass;
  lineage: string;
  alignment: string;
  signatureGear: string;
  trait: string;
  attributes: AbilityScores;
  cardStats: CardStats;
  createdAt: number;
}

interface ClassConfig {
  summary: string;
  primaryStats: (keyof AbilityScores)[];
  gear: string[];
  epithets: string[];
  traits: string[];
}

export const CLASS_CONFIG: Record<CharacterClass, ClassConfig> = {
  Warrior: {
    summary: 'Frontline tactician forged in steel and discipline.',
    primaryStats: ['str', 'con'],
    gear: [
      'Notched Longsword & Kite Shield',
      'Tempered Halberd & Brigandine Mail',
      'Twin Broadaxes & Iron Gauntlets',
      'Greatsword of the Border Watch',
    ],
    epithets: [
      'Shield of the Red Pass',
      'the Ironbound',
      'Veteran of Ashwall',
      'Breaker of Spears',
    ],
    traits: [
      'Refuses to leave a fallen comrade behind, even when outnumbered.',
      'Keeps a tally of every broken blade in a worn leather ledger.',
      'Speaks softly before battle and never makes a threat twice.',
      'Trained the town militia of a border village before taking to the road.',
    ],
  },
  Mage: {
    summary: 'Scholar of arcane geometry and volatile incantations.',
    primaryStats: ['int', 'wis'],
    gear: [
      'Runed Ashwood Staff & Spellbook',
      'Brass Astrolabe & Silvered Wand',
      'Star-Chart Grimoire & Obsidian Focus',
      'Crystal Rod & Ink-Stained Satchel',
    ],
    epithets: [
      'of the Astral Spire',
      'the Candle-Scholar',
      'Weaver of Cinders',
      'Keeper of Unbound Tomes',
    ],
    traits: [
      'Annotates every tavern menu with hasty arcane diagrams.',
      'Believes every ancient ruin still holds one overlooked footnote.',
      'Speaks three dead dialects better than the common tongue.',
      'Carries a pocket lantern lit by an unquenchable blue ember.',
    ],
  },
  Rogue: {
    summary: 'Opportunist thriving in alleyways, vaults, and whispers.',
    primaryStats: ['dex', 'cha'],
    gear: [
      'Twin Stiletto Daggers & Lockpicks',
      'Silenced Hand Crossbow & Dark Cloak',
      'Hooked Grapnel & Poisoner’s Satchel',
      'Silvered Shortsword & Loaded Dice',
    ],
    epithets: [
      'the Velvet Step',
      'of Seven Keys',
      'Shadow of the Quay',
      'the Ledger-Thief',
    ],
    traits: [
      'Counts exits and loose floorboards before sitting down in any room.',
      'Never steals from anyone who cannot afford the loss twice over.',
      'Always knows which city guard takes bribes in silver instead of coin.',
      'Fidgets with an old brass coin stamped with an unrecognizable crest.',
    ],
  },
  Ranger: {
    summary: 'Tracker of wild frontiers, beast trails, and distant horizons.',
    primaryStats: ['dex', 'wis'],
    gear: [
      'Yew Longbow & Fletcher’s Quiver',
      'Hunting Spear & Weatherproof Cloak',
      'Twin Curved Knives & Compass',
      'Recurve Bow & Snare Kit',
    ],
    epithets: [
      'Warden of the Grey Woods',
      'the Far-Tracker',
      'of the Thorn Ridge',
      'the Quiet Arrow',
    ],
    traits: [
      'Reads storm fronts and hoofprints faster than most read parchment.',
      'Prefers sleeping beneath open pine branches to any feather bed.',
      'Keeps a whistle carved from elk bone to call distant scouts.',
      'Marks safe trail crossings with subtle notches in roadside bark.',
    ],
  },
  Paladin: {
    summary: 'Sworn champion bound by sacred oath and unwavering resolve.',
    primaryStats: ['str', 'cha'],
    gear: [
      'Sun-Engraved Warhammer & Tabard',
      'Silvered Bastard Sword & Heater Shield',
      'Consecrated Mace & Chain Hauberk',
      'Banner Lance & Oath-Scroll',
    ],
    epithets: [
      'Oathkeeper of Dawn',
      'the Unyielding',
      'Shield of the Sanctuary',
      'the Silver Vow',
    ],
    traits: [
      'Starts every dawn polishing armor and reciting a single sworn promise.',
      'Offers mercy first, but never pardons cruelty toward the helpless.',
      'Wears a faded ribbon tied around the hilt in memory of an older mentor.',
      'Speaks with calm certainty that steadies panicked crowds.',
    ],
  },
  Cleric: {
    summary: 'Devoted vessel of restorative grace and solemn rites.',
    primaryStats: ['wis', 'con'],
    gear: [
      'Flanged Mace & Silver Reliquary',
      'Cedar Censer & Herb Poultice Kit',
      'Bronze Shield & Prayer Missal',
      'Lantern Staff & Vial of Sacred Oil',
    ],
    epithets: [
      'of the Quiet Chapel',
      'the Hearth-Mender',
      'Voice of the Bell',
      'Bearer of Lanterns',
    ],
    traits: [
      'Tends wounds of friend and foe alike before asking questions.',
      'Collects pressed wildflowers from every parish visited along the road.',
      'Hums old abbey chants while brewing bitter healing draughts.',
      'Never passes a wayside shrine without leaving a single copper coin.',
    ],
  },
  Bard: {
    summary: 'Chronicler weaving folklore, wit, and resonant cadence.',
    primaryStats: ['cha', 'dex'],
    gear: [
      'Inlaid Lute & Rapier',
      'Silver Flute & Travelers’ Chronicle',
      'Violin Case & Concealed Dagger',
      'Lyre of Polished Maple & Velvet Cape',
    ],
    epithets: [
      'of the Gilded Verse',
      'the Ballad-Maker',
      'Silver-Tongue of Highport',
      'Chronicler of Taverns',
    ],
    traits: [
      'Remembers every local rumor, wedding scandal, and forgotten ballad.',
      'Exaggerates only the parts of a story that make allies look braver.',
      'Trades songs for warm meals and clean stables in every town.',
      'Never lets a tense negotiation pass without a disarming remark.',
    ],
  },
  Druid: {
    summary: 'Custodian of ancient groves, tides, and seasonal balance.',
    primaryStats: ['wis', 'int'],
    gear: [
      'Gnarled Oak Quarterstaff & Sickle',
      'Mistletoe Totem & Hide Jerkin',
      'Amber Focus & Satchel of Seeds',
      'Rowan Wand & Carved Antler Mask',
    ],
    epithets: [
      'Speaker of Root and Rain',
      'of the Moss Circle',
      'the Frost-Watcher',
      'Keeper of Stone Cairns',
    ],
    traits: [
      'Notices subtle shifts in wind direction hours before clouds gather.',
      'Distrusts walled cities and feels claustrophobic beneath slate roofs.',
      'Leaves small offerings of grain beside crossroads stones.',
      'Knows the medicinal and venomous properties of every hedgerow leaf.',
    ],
  },
};

const FIRST_SYLLABLES_A = [
  'Ael', 'Al', 'Ar', 'Bael', 'Bran', 'Cael', 'Cor', 'Dae', 'Dor', 'Eir',
  'El', 'Fae', 'Fen', 'Gal', 'Gar', 'Hal', 'Ira', 'Jor', 'Kael', 'Kor',
  'Lira', 'Lor', 'Mae', 'Mal', 'Mor', 'Nae', 'Nor', 'Or', 'Pael', 'Quin',
  'Rae', 'Ren', 'Sael', 'Ser', 'Syl', 'Tael', 'Thal', 'Tor', 'Val', 'Vey',
  'Wren', 'Yor', 'Zae', 'Zor',
];

const FIRST_SYLLABLES_B = [
  'a', 'an', 'ar', 'ath', 'en', 'eth', 'ian', 'iel', 'ik', 'il',
  'in', 'ion', 'ir', 'is', 'ith', 'on', 'or', 'os', 'ric', 'yn',
  'yr', 'ven', 'mir', 'kas', 'len', 'dris', 'vorn', 'thas',
];

const SURNAME_PREFIXES = [
  'Ash', 'Black', 'Bright', 'Cold', 'Dawn', 'Deep', 'Dusk', 'Elder',
  'Ember', 'Fair', 'Frost', 'Gold', 'Grey', 'Grim', 'Hawk', 'High',
  'Iron', 'Moss', 'Night', 'Oak', 'Raven', 'Red', 'River', 'Shadow',
  'Silver', 'Star', 'Stone', 'Storm', 'Sun', 'Swift', 'Thorn', 'Vale',
  'West', 'White', 'Wild', 'Winter',
];

const SURNAME_SUFFIXES = [
  'bane', 'brook', 'crest', 'croft', 'fall', 'field', 'ford', 'forge',
  'guard', 'hart', 'helm', 'hold', 'hollow', 'keep', 'lock', 'march',
  'mere', 'moor', 'ridge', 'river', 'shield', 'song', 'spire', 'stone',
  'stride', 'thorn', 'vale', 'ward', 'watch', 'weaver', 'wind', 'wood',
];

const LINEAGES = [
  'Human',
  'High Elf',
  'Wood Elf',
  'Mountain Dwarf',
  'Half-Elf',
  'Halfling',
  'Tiefling',
  'Dragonborn',
  'Half-Orc',
];

const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
];

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function rollFourD6DropLowest(): number {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

function generateAbilityScores(primaryStats: (keyof AbilityScores)[]): AbilityScores {
  const rolled = Array.from({ length: 6 }, () => rollFourD6DropLowest()).sort((a, b) => b - a);
  const allKeys: (keyof AbilityScores)[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  const secondaryKeys = allKeys.filter((k) => !primaryStats.includes(k));

  // Shuffle secondary stats so non-primary distribution remains varied
  for (let i = secondaryKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [secondaryKeys[i], secondaryKeys[j]] = [secondaryKeys[j], secondaryKeys[i]];
  }

  const orderedKeys = [...primaryStats, ...secondaryKeys];
  const scores: AbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
  orderedKeys.forEach((key, idx) => {
    scores[key] = rolled[idx];
  });
  return scores;
}

function createCandidateName(): string {
  const first = `${pickRandom(FIRST_SYLLABLES_A)}${pickRandom(FIRST_SYLLABLES_B)}`;
  let lastPrefix = pickRandom(SURNAME_PREFIXES);
  let lastSuffix = pickRandom(SURNAME_SUFFIXES);
  while (lastPrefix.toLowerCase() === lastSuffix.toLowerCase()) {
    lastSuffix = pickRandom(SURNAME_SUFFIXES);
  }
  const surname = `${lastPrefix}${lastSuffix}`;
  return `${first} ${surname}`;
}

export function generateUniqueName(usedNames: Set<string>): string {
  for (let attempt = 0; attempt < 200; attempt++) {
    const candidate = createCandidateName();
    if (!usedNames.has(candidate)) {
      return candidate;
    }
  }
  // Fallback with distinct numeral suffix only if exhaustive pool collides
  let fallback = createCandidateName();
  let counter = 2;
  while (usedNames.has(`${fallback} ${counter}`)) {
    counter++;
  }
  return `${fallback} ${counter}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CARD_STAT_RANGES: Record<
  CharacterClass,
  { health: [number, number]; mana: [number, number]; strength: [number, number] }
> = {
  Warrior: { health: [120, 175], mana: [20, 55], strength: [70, 98] },
  Paladin: { health: [115, 165], mana: [55, 95], strength: [65, 92] },
  Mage: { health: [65, 105], mana: [115, 165], strength: [20, 48] },
  Cleric: { health: [90, 135], mana: [95, 145], strength: [40, 68] },
  Druid: { health: [85, 130], mana: [100, 150], strength: [38, 65] },
  Rogue: { health: [80, 120], mana: [45, 85], strength: [48, 76] },
  Ranger: { health: [95, 140], mana: [50, 90], strength: [55, 82] },
  Bard: { health: [80, 120], mana: [85, 130], strength: [35, 62] },
};

function generateCardStats(characterClass: CharacterClass): CardStats {
  const ranges = CARD_STAT_RANGES[characterClass];
  return {
    health: randomInt(ranges.health[0], ranges.health[1]),
    mana: randomInt(ranges.mana[0], ranges.mana[1]),
    strength: randomInt(ranges.strength[0], ranges.strength[1]),
  };
}

export function generateFantasyCharacter(
  usedNames: Set<string>,
  selectedClass?: CharacterClass | 'Any',
): FantasyCharacter {
  const characterClass: CharacterClass =
    selectedClass && selectedClass !== 'Any'
      ? selectedClass
      : pickRandom(CHARACTER_CLASSES);

  const config = CLASS_CONFIG[characterClass];
  const name = generateUniqueName(usedNames);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    epithet: pickRandom(config.epithets),
    characterClass,
    lineage: pickRandom(LINEAGES),
    alignment: pickRandom(ALIGNMENTS),
    signatureGear: pickRandom(config.gear),
    trait: pickRandom(config.traits),
    attributes: generateAbilityScores(config.primaryStats),
    cardStats: generateCardStats(characterClass),
    createdAt: Date.now(),
  };
}

export function formatAbilityModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
