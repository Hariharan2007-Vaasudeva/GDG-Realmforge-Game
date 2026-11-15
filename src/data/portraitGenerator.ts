import { CharacterClass, FantasyCharacter } from './fantasyGenerator';

export type EyeExpression = 'determined' | 'arcane' | 'smirk' | 'fierce' | 'serene';
export type MouthExpression = 'confident' | 'stoic' | 'mischievous' | 'battleReady';
export type FaceMark = 'none' | 'cheekScar' | 'warpaint' | 'arcaneRune' | 'freckles';

export interface TonePalette {
  base: string;
  shadow: string;
  highlight: string;
}

export interface PortraitConfig {
  seed: number;
  skin: TonePalette;
  hairStyle: number;
  hairColor: TonePalette;
  eyeExpression: EyeExpression;
  eyeColor: string;
  mouthExpression: MouthExpression;
  outfitVariant: number;
  bgPalette: {
    outer: string;
    inner: string;
    burst: string;
  };
  propVariant: number;
  faceMark: FaceMark;
  hasBeard: boolean;
}

const NATURAL_SKIN_TONES: TonePalette[] = [
  { base: '#F7D3BA', shadow: '#D8A484', highlight: '#FFE7D6' },
  { base: '#E8B896', shadow: '#C28A67', highlight: '#F7D1B5' },
  { base: '#C98C63', shadow: '#9D6440', highlight: '#DFAA84' },
  { base: '#8D583B', shadow: '#663B24', highlight: '#AB7252' },
  { base: '#633C29', shadow: '#442618', highlight: '#7E513B' },
];

const TIEFLING_SKIN_TONES: TonePalette[] = [
  { base: '#C74957', shadow: '#912A39', highlight: '#E26C78' },
  { base: '#88549E', shadow: '#5D3370', highlight: '#A875BD' },
  { base: '#4D5C7E', shadow: '#313D59', highlight: '#6D7EA3' },
];

const DRAGONBORN_SKIN_TONES: TonePalette[] = [
  { base: '#B5483A', shadow: '#7D2920', highlight: '#D66B5B' },
  { base: '#3A7D6C', shadow: '#225447', highlight: '#59A18E' },
  { base: '#C7923E', shadow: '#8F6320', highlight: '#E5B45F' },
  { base: '#44689C', shadow: '#29446E', highlight: '#658BC2' },
];

const ORC_SKIN_TONES: TonePalette[] = [
  { base: '#7B9462', shadow: '#556B40', highlight: '#9CB582' },
  { base: '#697F6B', shadow: '#475949', highlight: '#89A18B' },
  { base: '#8D966B', shadow: '#646C47', highlight: '#AEB88B' },
];

const HAIR_COLORS: TonePalette[] = [
  { base: '#272936', shadow: '#161822', highlight: '#454A61' },
  { base: '#5C3826', shadow: '#3D2215', highlight: '#82543D' },
  { base: '#A6542B', shadow: '#783615', highlight: '#CC7447' },
  { base: '#D9AE57', shadow: '#AD8232', highlight: '#F2CE7E' },
  { base: '#D7DCE6', shadow: '#9EA6B8', highlight: '#F4F7FC' },
  { base: '#3C5F80', shadow: '#243E57', highlight: '#5D85AB' },
  { base: '#7B3C63', shadow: '#522240', highlight: '#A15B86' },
];

const BG_PALETTES: Record<CharacterClass, { outer: string; inner: string; burst: string }[]> = {
  Warrior: [
    { outer: '#3D1D1E', inner: '#732C2C', burst: '#C44D3D' },
    { outer: '#222836', inner: '#3B4863', burst: '#D97724' },
    { outer: '#2F241D', inner: '#5E422E', burst: '#D1913C' },
  ],
  Mage: [
    { outer: '#1B2242', inner: '#2E4082', burst: '#4DA6E8' },
    { outer: '#2A1D3D', inner: '#4F3075', burst: '#E07BE0' },
    { outer: '#142F38', inner: '#205B6B', burst: '#4DD4B0' },
  ],
  Rogue: [
    { outer: '#181E24', inner: '#2D3A47', burst: '#8B9EB3' },
    { outer: '#241B29', inner: '#452E52', burst: '#D95B7A' },
    { outer: '#1B2923', inner: '#2D4F40', burst: '#63B88C' },
  ],
  Ranger: [
    { outer: '#1A2E22', inner: '#2D543C', burst: '#72B865' },
    { outer: '#262B1D', inner: '#475231', burst: '#C7A94C' },
    { outer: '#1C2930', inner: '#2D4B59', burst: '#64B6AC' },
  ],
  Paladin: [
    { outer: '#2E2516', inner: '#614D24', burst: '#F2C14E' },
    { outer: '#1D293D', inner: '#334E78', burst: '#F2B84B' },
    { outer: '#301E28', inner: '#61354D', burst: '#E8A84C' },
  ],
  Cleric: [
    { outer: '#1E2A38', inner: '#364F6B', burst: '#E8D595' },
    { outer: '#2B2538', inner: '#50426E', burst: '#F0C967' },
    { outer: '#1E302C', inner: '#345950', burst: '#A3E0C6' },
  ],
  Bard: [
    { outer: '#381B2C', inner: '#6E2E52', burst: '#EB8F52' },
    { outer: '#242140', inner: '#433C7A', burst: '#F0B64D' },
    { outer: '#2E1E22', inner: '#663640', burst: '#F27979' },
  ],
  Druid: [
    { outer: '#1B2B1E', inner: '#345439', burst: '#8CCF67' },
    { outer: '#29221A', inner: '#544330', burst: '#7AB874' },
    { outer: '#1A2A2E', inner: '#2E5059', burst: '#65C9B0' },
  ],
};

const EYE_COLORS = ['#38BDF8', '#F59E0B', '#34D399', '#A78BFA', '#F87171', '#E2E8F0'];
const EYE_EXPRESSIONS: EyeExpression[] = ['determined', 'arcane', 'smirk', 'fierce', 'serene'];
const MOUTH_EXPRESSIONS: MouthExpression[] = ['confident', 'stoic', 'mischievous', 'battleReady'];
const FACE_MARKS: FaceMark[] = ['none', 'none', 'cheekScar', 'warpaint', 'arcaneRune', 'freckles'];

function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getSkinPoolForLineage(lineage: string): TonePalette[] {
  if (lineage === 'Tiefling') return TIEFLING_SKIN_TONES;
  if (lineage === 'Dragonborn') return DRAGONBORN_SKIN_TONES;
  if (lineage === 'Half-Orc') return ORC_SKIN_TONES;
  return NATURAL_SKIN_TONES;
}

export function generatePortraitConfig(
  character: FantasyCharacter,
  previousConfig?: PortraitConfig,
): PortraitConfig {
  const skinPool = getSkinPoolForLineage(character.lineage);
  const bgPool = BG_PALETTES[character.characterClass];

  let nextHairStyle = Math.floor(Math.random() * 6);
  let nextOutfitVariant = Math.floor(Math.random() * 3);
  let nextMouth = pickOne(MOUTH_EXPRESSIONS);
  let nextBg = pickOne(bgPool);

  // Guarantee noticeable visual variation on Regenerate
  if (previousConfig) {
    if (nextHairStyle === previousConfig.hairStyle) {
      nextHairStyle = (nextHairStyle + 1 + Math.floor(Math.random() * 4)) % 6;
    }
    if (nextOutfitVariant === previousConfig.outfitVariant) {
      nextOutfitVariant = (nextOutfitVariant + 1) % 3;
    }
    const otherMouths = MOUTH_EXPRESSIONS.filter((m) => m !== previousConfig.mouthExpression);
    nextMouth = pickOne(otherMouths);
    const otherBgs = bgPool.filter((b) => b.burst !== previousConfig.bgPalette.burst);
    if (otherBgs.length > 0) {
      nextBg = pickOne(otherBgs);
    }
  }

  const isDwarf = character.lineage === 'Mountain Dwarf';
  const hasBeard = isDwarf
    ? Math.random() > 0.2
    : character.lineage !== 'High Elf' && character.lineage !== 'Dragonborn' && Math.random() > 0.65;

  return {
    seed: Date.now() + Math.floor(Math.random() * 10000),
    skin: pickOne(skinPool),
    hairStyle: nextHairStyle,
    hairColor: pickOne(HAIR_COLORS),
    eyeExpression: pickOne(EYE_EXPRESSIONS),
    eyeColor: character.characterClass === 'Mage' ? '#38BDF8' : pickOne(EYE_COLORS),
    mouthExpression: nextMouth,
    outfitVariant: nextOutfitVariant,
    bgPalette: nextBg,
    propVariant: Math.floor(Math.random() * 2),
    faceMark: pickOne(FACE_MARKS),
    hasBeard,
  };
}
