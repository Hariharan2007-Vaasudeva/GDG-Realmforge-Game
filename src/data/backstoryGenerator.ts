import { CharacterClass, FantasyCharacter } from './fantasyGenerator';

const HOMELANDS = [
  'the terraced slate roofs of Highport',
  'a wind-scoured monastery above the Red Pass',
  'the lantern-lit canals of Old Mire',
  'an isolated frontier forge in the Ironcrags',
  'the sunken library beneath Ashwall',
  'a cedar-timbered hamlet along the Grey River',
  'the glassblowers’ quarter of Sunspire',
  'a snowbound watchtower on the northern ridge',
  'the salt-stained docks of Amber Cove',
  'a moss-covered abbey deep in the Thornwood',
  'the copper mines below Silverhold',
  'a wandering caravan crossing the Ashen Wastes',
];

const CLASS_INCIDENTS: Record<CharacterClass, string[]> = {
  Warrior: [
    'held a crumbling bridge alone until the village militia escaped',
    'won freedom from a mercenary company in a dawn duel',
    'stood watch through a three-day siege without yielding a single step',
    'claimed a fallen captain’s crest after breaking an ambush in the pass',
  ],
  Mage: [
    'decoded a sealed celestial ledger that others dismissed as gibberish',
    'survived an unstable crucible blast that left sparks dancing in their shadow',
    'stole three forbidden folios before the tower archivist noticed the missing seal',
    'awakened an ancient astrolabe beneath the ruins of a sunken conservatory',
  ],
  Rogue: [
    'lifted the governor’s signet ring during a crowded solstice banquet',
    'mapped every smuggler’s grate beneath the harbor before turning sixteen',
    'escaped a locked debtors’ barge using nothing more than a bent hairpin',
    'blackmailed a corrupt magistrate into erasing an entire guild’s bounties',
  ],
  Ranger: [
    'tracked a winter wyvern across forty miles of frozen scree without losing the trail',
    'guided a lost merchant train safely out of the mist-choked fens',
    'saved an injured timber wolf from iron snares and earned a silent guide',
    'mapped the shifting footpaths of the Briarwoods when seasoned scouts failed',
  ],
  Paladin: [
    'swore a bloodless vigil beside a ruined shrine until dawn broke the storm',
    'shielded a fleeing caravan with a splintered oak door and an unbroken oath',
    'refused a baron’s bribe and exposed the garrison’s quiet extortion',
    'rekindled the cold brazier of an abandoned sanctuary in midwinter',
  ],
  Cleric: [
    'tended an entire mining camp through a winter fever using boiled root-draughts',
    'heard a quiet bell toll beneath empty floorboards and uncovered a buried relic',
    'stood between panicked villagers and a rampaging river flood',
    'spent seven years copying fading healing rites by tallow candlelight',
  ],
  Bard: [
    'won a noble’s favor by improvising a satire that ended a decade-long feud',
    'recovered a lost ballad from a shipwrecked chest and set it to new strings',
    'talked their way out of a border dungeon by convincing the jailer of a royal pardon',
    'chronicled the fall of three rival houses while posing as a cellar minstrel',
  ],
  Druid: [
    'spoke the old names of the rain to save a parched valley from famine',
    'found a petrified heartwood seed that sprouted at the touch of their palm',
    'guided herds away from a poisoned spring long before the elders smelled sulfur',
    'kept a three-century truce between the forest circles and the border stonecutters',
  ],
};

const MOTIVATIONS = [
  'Guided by a {alignment} conscience, {firstName} now travels the roads in search of the missing seal that sparked their exile.',
  'Carrying their {gear}, they roam the realm to settle an old debt before winter closes the mountain passes.',
  'Now walking with a {alignment} resolve, {firstName} seeks the forgotten name etched beneath their {gear}.',
  'With only their {gear} and a battered travel map, they hunt for proof of a vanished mentor.',
  'Bound by a {alignment} code, {firstName} trades hard-won skill for coin and clues to an heirloom stolen years ago.',
  'Ever watchful, they follow faint rumors across border taverns hoping to outrun the bounty on their true name.',
  'Driven by curiosity and a {alignment} heart, {firstName} tests every rumor of ancient vaults against hard steel and wit.',
  'Since that night, they keep their {gear} within arm’s reach while piecing together fragments of a shattered cipher.',
];

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function indefiniteArticle(word: string): string {
  return /^[aeiou]/i.test(word.trim()) ? 'an' : 'a';
}

function buildCandidateBackstory(character: FantasyCharacter): string {
  const firstName = character.name.split(' ')[0];
  const lineageLower = character.lineage.toLowerCase();
  const classLower = character.characterClass.toLowerCase();
  const alignmentLower = character.alignment.toLowerCase();
  const gearLower = character.signatureGear.toLowerCase();

  const homeland = pickRandom(HOMELANDS);
  const incident = pickRandom(CLASS_INCIDENTS[character.characterClass]);
  const motiveTemplate = pickRandom(MOTIVATIONS);

  const article = indefiniteArticle(lineageLower);

  const sentenceOneTemplates = [
    `Raised near ${homeland}, ${character.name} became ${article} ${lineageLower} ${classLower} after they ${incident}.`,
    `Before taking the road as ${article} ${lineageLower} ${classLower}, ${firstName} left ${homeland} behind when they ${incident}.`,
    `Once an overlooked apprentice in ${homeland}, ${character.name} forged a name as ${article} ${lineageLower} ${classLower} the night they ${incident}.`,
  ];

  const sentenceOne = pickRandom(sentenceOneTemplates);
  const sentenceTwo = motiveTemplate
    .replaceAll('{firstName}', firstName)
    .replaceAll('{alignment}', alignmentLower)
    .replaceAll('{gear}', gearLower);

  return `${sentenceOne} ${sentenceTwo}`;
}

export function generateUniqueBackstory(
  character: FantasyCharacter,
  usedBackstories: Set<string>,
  currentBackstory?: string,
): string {
  for (let attempt = 0; attempt < 100; attempt++) {
    const candidate = buildCandidateBackstory(character);
    if (candidate !== currentBackstory && !usedBackstories.has(candidate)) {
      return candidate;
    }
  }
  return buildCandidateBackstory(character);
}
