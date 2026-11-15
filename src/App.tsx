import { useState, useRef, useEffect } from "react";
import {
  Dices,
  Copy,
  Check,
  Trash2,
  Paintbrush,
  RefreshCw,
  Shield,
  Heart,
  Droplet,
  Sword,
  Zap,
  Award,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ScrollText,
  BookmarkPlus,
  BookmarkCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  CHARACTER_CLASSES,
  CLASS_CONFIG,
  CharacterClass,
  FantasyCharacter,
  AbilityScores,
  formatAbilityModifier,
  generateFantasyCharacter,
} from "./data/fantasyGenerator";
import {
  PortraitConfig,
  generatePortraitConfig,
} from "./data/portraitGenerator";
import { generateUniqueBackstory } from "./data/backstoryGenerator";
import {
  EncounterChallenge,
  RollResult,
  getArmorClass,
  getLevelFromXp,
  getProficiencyBonus,
  getXpProgressInLevel,
  pickEncounter,
  resolveEncounterCheck,
} from "./data/encounters";
import { playDiceRollSound, playOutcomeSound } from "./utils/soundFx";
import { ClassCrest } from "./components/ClassCrest";
import { CharacterPortrait } from "./components/CharacterPortrait";

const ABILITY_LABELS: { key: keyof AbilityScores; label: string }[] = [
  { key: "str", label: "STR" },
  { key: "dex", label: "DEX" },
  { key: "con", label: "CON" },
  { key: "int", label: "INT" },
  { key: "wis", label: "WIS" },
  { key: "cha", label: "CHA" },
];

const WORKBENCH_TEXTURE_URL =
  "/src/assets/images/alchemist_workbench_bg_1794512383743.jpg";
const DECK_STORAGE_KEY = "realmforge_my_deck_v1";

interface SavedDeckEntry {
  character: FantasyCharacter;
  portrait: PortraitConfig | null;
  backstory: string | null;
  xp: number;
}

function loadSavedDeck(): SavedDeckEntry[] {
  try {
    const raw = window.localStorage.getItem(DECK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedDeckEntry =>
      Boolean(
        item?.character?.id &&
        item?.character?.name &&
        item?.character?.cardStats,
      ),
    );
  } catch {
    return [];
  }
}

export default function App() {
  const [selectedClassFilter, setSelectedClassFilter] = useState<
    CharacterClass | "Any"
  >("Any");
  const [currentCharacter, setCurrentCharacter] =
    useState<FantasyCharacter | null>(null);
  const [roster, setRoster] = useState<FantasyCharacter[]>([]);
  const [myDeck, setMyDeck] = useState<SavedDeckEntry[]>(() => loadSavedDeck());
  const [portraitsById, setPortraitsById] = useState<
    Record<string, PortraitConfig>
  >({});
  const [backstoriesById, setBackstoriesById] = useState<
    Record<string, string>
  >({});
  const [xpById, setXpById] = useState<Record<string, number>>({});
  const [currentEncounter, setCurrentEncounter] = useState<EncounterChallenge>(
    () => pickEncounter(),
  );
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bgLoadedError, setBgLoadedError] = useState(false);

  // Tracks generated names and backstories in the current session to guarantee uniqueness
  const usedNamesRef = useRef<Set<string>>(new Set());
  const usedBackstoriesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      window.localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(myDeck));
    } catch {
      // Ignore storage quota or private browsing errors
    }
  }, [myDeck]);

  const activePortrait = currentCharacter
    ? (portraitsById[currentCharacter.id] ?? null)
    : null;
  const activeBackstory = currentCharacter
    ? (backstoriesById[currentCharacter.id] ?? null)
    : null;
  const currentXp = currentCharacter ? (xpById[currentCharacter.id] ?? 0) : 0;
  const currentLevel = getLevelFromXp(currentXp);
  const xpIntoLevel = getXpProgressInLevel(currentXp);
  const isSavedInDeck = currentCharacter
    ? myDeck.some((entry) => entry.character.id === currentCharacter.id)
    : false;

  const syncDeckEntryIfSaved = (
    characterId: string,
    updates: Partial<Pick<SavedDeckEntry, "portrait" | "backstory" | "xp">>,
  ) => {
    setMyDeck((prev) =>
      prev.map((entry) =>
        entry.character.id === characterId ? { ...entry, ...updates } : entry,
      ),
    );
  };

  const handleGenerate = () => {
    const nextCharacter = generateFantasyCharacter(
      usedNamesRef.current,
      selectedClassFilter,
    );
    usedNamesRef.current.add(nextCharacter.name);
    setCurrentCharacter(nextCharacter);
    setRoster((prev) => [nextCharacter, ...prev]);
    setRollResult(null);
    setCurrentEncounter((prev) => pickEncounter(prev.title));
    setCopiedId(null);
    playDiceRollSound(soundEnabled);
  };

  const handleGeneratePortrait = () => {
    if (!currentCharacter) return;
    const config = generatePortraitConfig(currentCharacter);
    setPortraitsById((prev) => ({
      ...prev,
      [currentCharacter.id]: config,
    }));
    syncDeckEntryIfSaved(currentCharacter.id, { portrait: config });
  };

  const handleRegeneratePortrait = () => {
    if (!currentCharacter) return;
    const previousConfig = portraitsById[currentCharacter.id];
    const nextConfig = generatePortraitConfig(currentCharacter, previousConfig);
    setPortraitsById((prev) => ({
      ...prev,
      [currentCharacter.id]: nextConfig,
    }));
    syncDeckEntryIfSaved(currentCharacter.id, { portrait: nextConfig });
  };

  const handleGenerateBackstory = () => {
    if (!currentCharacter) return;
    const currentText = backstoriesById[currentCharacter.id];
    const nextBackstory = generateUniqueBackstory(
      currentCharacter,
      usedBackstoriesRef.current,
      currentText,
    );
    usedBackstoriesRef.current.add(nextBackstory);
    setBackstoriesById((prev) => ({
      ...prev,
      [currentCharacter.id]: nextBackstory,
    }));
    syncDeckEntryIfSaved(currentCharacter.id, { backstory: nextBackstory });
  };

  const handleSaveToDeck = () => {
    if (!currentCharacter) return;
    const existing = myDeck.some(
      (item) => item.character.id === currentCharacter.id,
    );
    if (existing) return;
    const entry: SavedDeckEntry = {
      character: currentCharacter,
      portrait: activePortrait,
      backstory: activeBackstory,
      xp: currentXp,
    };
    setMyDeck((prev) => [entry, ...prev]);
  };

  const handleSelectDeckEntry = (entry: SavedDeckEntry) => {
    const { character, portrait, backstory, xp } = entry;
    usedNamesRef.current.add(character.name);
    if (backstory) {
      usedBackstoriesRef.current.add(backstory);
    }
    if (portrait) {
      setPortraitsById((prev) => ({ ...prev, [character.id]: portrait }));
    }
    if (backstory) {
      setBackstoriesById((prev) => ({ ...prev, [character.id]: backstory }));
    }
    if (xp > 0) {
      setXpById((prev) => ({ ...prev, [character.id]: xp }));
    }
    setCurrentCharacter(character);
    setRollResult(null);
    setCopiedId(null);
  };

  const handleRemoveFromDeck = (characterId: string) => {
    setMyDeck((prev) =>
      prev.filter((entry) => entry.character.id !== characterId),
    );
  };

  const handleRollEncounter = () => {
    if (!currentCharacter || rollResult) return;
    playDiceRollSound(soundEnabled);
    const result = resolveEncounterCheck(
      currentCharacter,
      currentEncounter,
      currentLevel,
    );
    const nextXp = (xpById[currentCharacter.id] ?? 0) + result.xpEarned;
    setRollResult(result);
    setXpById((prev) => ({
      ...prev,
      [currentCharacter.id]: nextXp,
    }));
    syncDeckEntryIfSaved(currentCharacter.id, { xp: nextXp });
    window.setTimeout(() => {
      playOutcomeSound(soundEnabled, result.success, result.isCritSuccess);
    }, 110);
  };

  const handleNextEncounter = () => {
    setRollResult(null);
    setCurrentEncounter((prev) => pickEncounter(prev.title));
  };

  const handleSelectRosterCharacter = (character: FantasyCharacter) => {
    setCurrentCharacter(character);
    setRollResult(null);
    setCopiedId(null);
  };

  const handleClearRoster = () => {
    usedNamesRef.current.clear();
    usedBackstoriesRef.current.clear();
    setRoster([]);
    setPortraitsById({});
    setBackstoriesById({});
    setXpById({});
    setCurrentCharacter(null);
    setRollResult(null);
    setCopiedId(null);
  };

  const handleCopySummary = async () => {
    if (!currentCharacter) return;
    const ac = getArmorClass(currentCharacter);
    const statsLine = ABILITY_LABELS.map(
      ({ key, label }) =>
        `${label} ${currentCharacter.attributes[key]} (${formatAbilityModifier(currentCharacter.attributes[key])})`,
    ).join(" | ");

    const summaryLines = [
      `${currentCharacter.name}, ${currentCharacter.epithet}`,
      `Class: ${currentCharacter.characterClass} (Level ${currentLevel}) · Lineage: ${currentCharacter.lineage} · Alignment: ${currentCharacter.alignment}`,
      `Health: ${currentCharacter.cardStats.health} · Mana: ${currentCharacter.cardStats.mana} · Strength: ${currentCharacter.cardStats.strength} · AC: ${ac}`,
      `Attributes: ${statsLine}`,
      `Starting Gear: ${currentCharacter.signatureGear}`,
      `Note: ${currentCharacter.trait}`,
    ];
    if (activeBackstory) {
      summaryLines.push(`Origin Story: ${activeBackstory}`);
    }
    const summary = summaryLines.join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedId(currentCharacter.id);
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === currentCharacter.id ? null : prev));
      }, 2000);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  return (
    <div className="relative min-h-screen workbench-fallback text-[#efe5d2] flex flex-col overflow-x-hidden">
      {/* Dark Textured Ancient Alchemist's Workbench Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        {!bgLoadedError && (
          <img
            src={WORKBENCH_TEXTURE_URL}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setBgLoadedError(true)}
            className="w-full h-full object-cover object-center opacity-55"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a08]/70 via-[#100c09]/75 to-[#0a0806]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,155,56,0.09),transparent_65%)]" />
      </div>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
        {/* Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#c89b54]/20">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-normal tracking-wide text-[#f7eedc] text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Realmforge
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-[#b5a48b]">
              Forge playable fantasy character cards, craft their portraits and
              lore, and save favorites to your deck.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 min-h-[44px] rounded-lg bg-[#d99b38] hover:bg-[#e6aa47] active:bg-[#c28627] text-[#140e08] font-semibold text-sm shadow-lg shadow-black/40 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6aa47] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Dices
              className="w-4 h-4 shrink-0"
              aria-hidden="true"
            />
            <span>Generate Character</span>
          </button>
        </div>

        {/* Interactive Class Filter Strip */}
        <section
          aria-label="Class filter"
          className="pt-5 pb-7"
        >
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-[#17120e]/90 border border-[#c89b54]/20 shadow-md shadow-black/40 w-fit max-w-full">
            <button
              type="button"
              onClick={() => setSelectedClassFilter("Any")}
              className={`px-3 py-1.5 min-h-[36px] text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47] ${
                selectedClassFilter === "Any"
                  ? "bg-[#c89b54]/20 text-[#f3c778] border border-[#c89b54]/40"
                  : "text-[#b5a48b] hover:text-[#efe5d2] border border-transparent"
              }`}
            >
              Any Class
            </button>
            {CHARACTER_CLASSES.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClassFilter(cls)}
                className={`px-3 py-1.5 min-h-[36px] text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47] ${
                  selectedClassFilter === cls
                    ? "bg-[#c89b54]/20 text-[#f3c778] border border-[#c89b54]/40"
                    : "text-[#b5a48b] hover:text-[#efe5d2] border border-transparent"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </section>

        {/* Two-Column Card Table Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary Bordered Player Card */}
          <section
            aria-label="Player Card"
            className="lg:col-span-7 border-2 border-[#c89b54]/60 rounded-2xl bg-[#140f0c]/95 p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
          >
            <div className="rounded-[10px] border border-[#c89b54]/25 bg-gradient-to-b from-[#1d1712] via-[#17120e] to-[#130f0b] p-5 sm:p-7">
              {currentCharacter ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCharacter.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Card Nameplate Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#c89b54]/20">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <ClassCrest
                          characterClass={currentCharacter.characterClass}
                          className="w-11 h-11 mt-0.5"
                        />
                        <div className="min-w-0">
                          <h2
                            data-testid="character-name"
                            className="text-2xl sm:text-3xl font-normal tracking-wide text-[#faf2e1] text-balance leading-tight"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {currentCharacter.name}
                          </h2>
                          <p className="text-xs sm:text-sm text-[#b5a48b] mt-0.5">
                            {currentCharacter.epithet}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm">
                            <span className="text-[#a89984]">
                              Class:{" "}
                              <strong
                                data-testid="character-class"
                                className="font-semibold text-[#e6b45c]"
                              >
                                {currentCharacter.characterClass}
                              </strong>
                            </span>
                            <span
                              className="text-[#6e5f4b]"
                              aria-hidden="true"
                            >
                              ·
                            </span>
                            <span className="text-[#e3d6be]">
                              {currentCharacter.lineage}
                            </span>
                            <span
                              className="text-[#6e5f4b]"
                              aria-hidden="true"
                            >
                              ·
                            </span>
                            <span className="text-[#b5a48b]">
                              Lv. {currentLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start">
                        <button
                          type="button"
                          onClick={handleSaveToDeck}
                          disabled={isSavedInDeck}
                          className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e6aa47] ${
                            isSavedInDeck
                              ? "bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 cursor-default"
                              : "bg-[#d99b38] hover:bg-[#e6aa47] text-[#140e08] cursor-pointer"
                          }`}
                        >
                          {isSavedInDeck ? (
                            <>
                              <BookmarkCheck
                                className="w-3.5 h-3.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>Saved in Deck</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus
                                className="w-3.5 h-3.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>Save to Deck</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopySummary}
                          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[#c89b54]/25 bg-[#efe5d2]/[0.03] hover:bg-[#efe5d2]/[0.08] text-xs font-medium text-[#d8cbb5] hover:text-[#faf2e1] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                        >
                          {copiedId === currentCharacter.id ? (
                            <>
                              <Check
                                className="w-3.5 h-3.5 text-emerald-400"
                                aria-hidden="true"
                              />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Featured Card Artwork Frame */}
                    <div className="my-5 flex flex-col sm:flex-row items-center sm:items-stretch gap-5">
                      <div className="w-full max-w-[240px] sm:w-52 shrink-0 flex flex-col gap-2.5">
                        <div className="w-full aspect-square rounded-xl border-2 border-[#c89b54]/35 bg-[#0e0b08] overflow-hidden flex items-center justify-center shadow-inner shadow-black/80">
                          {activePortrait ? (
                            <motion.div
                              key={activePortrait.seed}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.18,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="w-full h-full"
                            >
                              <CharacterPortrait
                                character={currentCharacter}
                                config={activePortrait}
                              />
                            </motion.div>
                          ) : (
                            <div className="p-4 text-center flex flex-col items-center gap-2.5">
                              <ClassCrest
                                characterClass={currentCharacter.characterClass}
                                className="w-12 h-12"
                              />
                              <span className="text-xs text-[#a89984]">
                                Cartoon / Game Portrait
                              </span>
                            </div>
                          )}
                        </div>

                        {!activePortrait ? (
                          <button
                            type="button"
                            onClick={handleGeneratePortrait}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 min-h-[40px] rounded-lg bg-[#c89b54]/15 hover:bg-[#c89b54]/25 border border-[#c89b54]/40 text-[#f3c778] text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                          >
                            <Paintbrush
                              className="w-3.5 h-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>Generate Portrait</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleRegeneratePortrait}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 min-h-[40px] rounded-lg bg-[#efe5d2]/[0.05] hover:bg-[#efe5d2]/[0.1] border border-[#c89b54]/25 text-[#efe5d2] text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                          >
                            <RefreshCw
                              className="w-3.5 h-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>Regenerate Portrait</span>
                          </button>
                        )}
                      </div>

                      {/* Card Lore & Trait Overview Beside Portrait */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-4 w-full">
                        <div>
                          <p className="text-sm text-[#c9b99e] leading-relaxed">
                            {
                              CLASS_CONFIG[currentCharacter.characterClass]
                                .summary
                            }
                          </p>
                          <div className="mt-4 space-y-3">
                            <div>
                              <h3 className="text-xs font-medium tracking-wide text-[#a89984]">
                                Starting Gear
                              </h3>
                              <p className="mt-0.5 text-sm text-[#efe5d2] leading-relaxed">
                                {currentCharacter.signatureGear}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-xs font-medium tracking-wide text-[#a89984]">
                                Character Note
                              </h3>
                              <p className="mt-0.5 text-sm text-[#d8cbb5] leading-relaxed">
                                {currentCharacter.trait}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#c89b54]/15 flex items-center justify-between gap-4 text-xs text-[#a89984]">
                          <span className="inline-flex items-center gap-1.5">
                            <Shield
                              className="w-3.5 h-3.5 text-[#e6b45c]"
                              aria-hidden="true"
                            />
                            <span>AC {getArmorClass(currentCharacter)}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Zap
                              className="w-3.5 h-3.5 text-[#e6b45c]"
                              aria-hidden="true"
                            />
                            <span>
                              Init{" "}
                              {formatAbilityModifier(
                                currentCharacter.attributes.dex,
                              )}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                            <Award
                              className="w-3.5 h-3.5 text-[#e6b45c]"
                              aria-hidden="true"
                            />
                            <span>{xpIntoLevel}/100 XP</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Core Player Card Stats: Health, Mana, Strength */}
                    <div className="border-y border-[#c89b54]/25 py-4 my-5 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#b5a48b]">
                          <Heart
                            className="w-3.5 h-3.5 text-rose-400"
                            aria-hidden="true"
                          />
                          <span>Health</span>
                        </div>
                        <div
                          data-testid="stat-health"
                          className="mt-1 text-2xl sm:text-3xl font-mono font-semibold tabular-nums text-[#faf2e1]"
                        >
                          {currentCharacter.cardStats.health}
                        </div>
                      </div>

                      <div className="border-x border-[#c89b54]/20 px-2">
                        <div className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#b5a48b]">
                          <Droplet
                            className="w-3.5 h-3.5 text-sky-400"
                            aria-hidden="true"
                          />
                          <span>Mana</span>
                        </div>
                        <div
                          data-testid="stat-mana"
                          className="mt-1 text-2xl sm:text-3xl font-mono font-semibold tabular-nums text-[#faf2e1]"
                        >
                          {currentCharacter.cardStats.mana}
                        </div>
                      </div>

                      <div>
                        <div className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#b5a48b]">
                          <Sword
                            className="w-3.5 h-3.5 text-[#e6b45c]"
                            aria-hidden="true"
                          />
                          <span>Strength</span>
                        </div>
                        <div
                          data-testid="stat-strength"
                          className="mt-1 text-2xl sm:text-3xl font-mono font-semibold tabular-nums text-[#faf2e1]"
                        >
                          {currentCharacter.cardStats.strength}
                        </div>
                      </div>
                    </div>

                    {/* Tabletop Ability Scores */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3">
                        <h3 className="text-xs font-medium tracking-wide text-[#a89984]">
                          Ability Scores
                        </h3>
                        <span className="text-xs text-[#8e7f6a]">
                          Highlighted stats gain +
                          {getProficiencyBonus(currentLevel)} class proficiency
                        </span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {ABILITY_LABELS.map(({ key, label }) => {
                          const score = currentCharacter.attributes[key];
                          const isPrimary =
                            CLASS_CONFIG[
                              currentCharacter.characterClass
                            ].primaryStats.includes(key);
                          return (
                            <div
                              key={key}
                              className="flex flex-col"
                            >
                              <span className="text-xs font-medium text-[#a89984]">
                                {label}
                              </span>
                              <div className="mt-0.5 flex items-baseline gap-1 font-mono tabular-nums">
                                <span
                                  className={`text-lg font-semibold ${
                                    isPrimary
                                      ? "text-[#f3c778]"
                                      : "text-[#efe5d2]"
                                  }`}
                                >
                                  {score}
                                </span>
                                <span className="text-xs text-[#a89984]">
                                  {formatAbilityModifier(score)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <hr className="border-t border-[#c89b54]/20 my-5" />

                    {/* Origin Story / Lore Section */}
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-2.5">
                        <h3 className="text-xs font-medium tracking-wide text-[#a89984]">
                          Origin Story
                        </h3>
                        <button
                          type="button"
                          onClick={handleGenerateBackstory}
                          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg bg-[#c89b54]/15 hover:bg-[#c89b54]/25 border border-[#c89b54]/40 text-[#f3c778] text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                        >
                          <ScrollText
                            className="w-3.5 h-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>Generate Backstory</span>
                        </button>
                      </div>

                      {activeBackstory ? (
                        <motion.p
                          key={activeBackstory}
                          data-testid="character-backstory"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.16,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="text-sm text-[#efe5d2] leading-relaxed"
                        >
                          {activeBackstory}
                        </motion.p>
                      ) : (
                        <p className="text-sm text-[#8e7f6a] leading-relaxed">
                          Click Generate Backstory to write a unique origin
                          story for {currentCharacter.name}.
                        </p>
                      )}
                    </div>

                    <hr className="border-t border-[#c89b54]/20 my-5" />

                    {/* Interactive Tabletop Encounter Check */}
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-2.5">
                        <h3 className="text-xs font-medium tracking-wide text-[#a89984]">
                          Encounter Check
                        </h3>
                        <button
                          type="button"
                          onClick={() => setSoundEnabled((prev) => !prev)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-md text-xs font-medium text-[#b5a48b] hover:text-[#efe5d2] hover:bg-[#efe5d2]/[0.06] transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                          aria-label={
                            soundEnabled
                              ? "Mute dice sound effects"
                              : "Enable dice sound effects"
                          }
                        >
                          {soundEnabled ? (
                            <>
                              <Volume2
                                className="w-3.5 h-3.5 text-[#e6b45c]"
                                aria-hidden="true"
                              />
                              <span>Sound On</span>
                            </>
                          ) : (
                            <>
                              <VolumeX
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                              <span>Muted</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                            <h4 className="text-sm font-semibold text-[#faf2e1]">
                              {currentEncounter.title}
                            </h4>
                            <span className="text-xs font-mono tabular-nums text-[#e6b45c]">
                              {currentEncounter.abilityLabel} · DC{" "}
                              {currentEncounter.dc} · +
                              {currentEncounter.xpReward} XP
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-[#b5a48b] leading-relaxed">
                            {currentEncounter.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {!rollResult ? (
                            <button
                              type="button"
                              onClick={handleRollEncounter}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-[#d99b38] hover:bg-[#e6aa47] text-[#140e08] font-semibold text-xs transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                            >
                              <Dices
                                className="w-3.5 h-3.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>Roll d20 Check</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleNextEncounter}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] rounded-lg bg-[#c89b54]/15 hover:bg-[#c89b54]/25 border border-[#c89b54]/40 text-[#f3c778] font-semibold text-xs transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                            >
                              <span>Next Encounter</span>
                              <ArrowRight
                                className="w-3.5 h-3.5 shrink-0"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {rollResult && (
                        <motion.div
                          key={rollResult.encounterId}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.16,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="mt-4 pt-3.5 border-t border-[#c89b54]/15"
                        >
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span
                              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                                rollResult.success
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {rollResult.success ? (
                                <CheckCircle2
                                  className="w-4 h-4 shrink-0"
                                  aria-hidden="true"
                                />
                              ) : (
                                <XCircle
                                  className="w-4 h-4 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span>
                                {rollResult.isCritSuccess
                                  ? "Critical Success"
                                  : rollResult.isCritFail
                                    ? "Critical Failure"
                                    : rollResult.success
                                      ? "Success"
                                      : "Failed"}
                              </span>
                            </span>
                            <span className="text-xs font-mono tabular-nums text-[#d8cbb5]">
                              d20 ({rollResult.d20}){" "}
                              {rollResult.modifier >= 0
                                ? `+ ${rollResult.modifier}`
                                : `- ${Math.abs(rollResult.modifier)}`}
                              {rollResult.proficiencyBonus > 0
                                ? ` + ${rollResult.proficiencyBonus} prof`
                                : ""}{" "}
                              = {rollResult.total} vs DC {rollResult.dc}
                            </span>
                            <span className="text-xs font-mono tabular-nums text-[#e6b45c]">
                              +{rollResult.xpEarned} XP
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm text-[#efe5d2] leading-relaxed">
                            {rollResult.success
                              ? currentEncounter.successText
                              : currentEncounter.failureText}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="py-12 sm:py-16 max-w-md mx-auto text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg border border-[#c89b54]/30 bg-[#c89b54]/10 flex items-center justify-center text-[#e6b45c]">
                    <Dices
                      className="w-6 h-6"
                      aria-hidden="true"
                    />
                  </div>
                  <h2
                    className="mt-5 text-2xl text-[#f7eedc]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Draw Your First Character Card
                  </h2>
                  <p className="mt-2 text-sm text-[#b5a48b] leading-relaxed">
                    Click Generate Character above to forge a player card with
                    unique Health, Mana, Strength, portrait art, and lore.
                  </p>

                  <div className="mt-8 pt-6 border-t border-[#c89b54]/15 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
                    <div>
                      <div className="text-xs font-semibold text-[#e6b45c]">
                        01. Roll Card
                      </div>
                      <p className="mt-1 text-xs text-[#b5a48b] leading-relaxed">
                        Generate random Health, Mana, Strength, and class
                        attributes.
                      </p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#e6b45c]">
                        02. Craft & Lore
                      </div>
                      <p className="mt-1 text-xs text-[#b5a48b] leading-relaxed">
                        Render a cartoon portrait and generate a unique origin
                        story.
                      </p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#e6b45c]">
                        03. Save to Deck
                      </div>
                      <p className="mt-1 text-xs text-[#b5a48b] leading-relaxed">
                        Store favorite cards in My Deck and test them in d20
                        encounters.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Sidebar: My Deck & Recent Rolls */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* My Deck Saved Cards */}
            <aside
              aria-label="My Deck"
              className="border-2 border-[#c89b54]/40 bg-[#18130f]/92 backdrop-blur-[2px] rounded-xl p-6 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#c89b54]/20">
                <div className="flex items-baseline gap-2">
                  <h2
                    className="text-lg text-[#faf2e1]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    My Deck
                  </h2>
                  <span
                    data-testid="my-deck-count"
                    className="text-xs font-mono tabular-nums text-[#e6b45c]"
                  >
                    {myDeck.length}
                  </span>
                </div>
                <span className="text-xs text-[#8e7f6a]">Saved Favorites</span>
              </div>

              {myDeck.length === 0 ? (
                <p className="pt-5 text-sm text-[#b5a48b] leading-relaxed">
                  Click Save to Deck on any character card to keep your favorite
                  heroes ready here.
                </p>
              ) : (
                <ul
                  data-testid="my-deck-list"
                  className="divide-y divide-[#c89b54]/15 max-h-[340px] overflow-y-auto mt-1"
                >
                  {myDeck.map((entry) => {
                    const isActive =
                      currentCharacter?.id === entry.character.id;
                    const entryLevel = getLevelFromXp(entry.xp);
                    return (
                      <li
                        key={entry.character.id}
                        className="py-2 flex items-center gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectDeckEntry(entry)}
                          className={`flex-1 min-w-0 text-left py-2 px-2.5 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47] ${
                            isActive
                              ? "bg-[#c89b54]/15 text-[#faf2e1]"
                              : "hover:bg-[#efe5d2]/[0.05] text-[#e3d6be]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-base truncate"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {entry.character.name}
                            </span>
                            <span
                              className={`text-xs font-medium shrink-0 ${
                                isActive ? "text-[#e6b45c]" : "text-[#a89984]"
                              }`}
                            >
                              {entry.character.characterClass} · Lv.{" "}
                              {entryLevel}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs font-mono tabular-nums text-[#b5a48b]">
                            <span>HP {entry.character.cardStats.health}</span>
                            <span aria-hidden="true">·</span>
                            <span>MP {entry.character.cardStats.mana}</span>
                            <span aria-hidden="true">·</span>
                            <span>
                              STR {entry.character.cardStats.strength}
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveFromDeck(entry.character.id)
                          }
                          aria-label={`Remove ${entry.character.name} from My Deck`}
                          className="p-2 min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-md text-[#8e7f6a] hover:text-rose-300 hover:bg-rose-500/10 transition-colors duration-150 cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                        >
                          <X
                            className="w-4 h-4"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </aside>

            {/* Session Roster */}
            <aside
              aria-label="Recent Rolls"
              className="bg-[#18130f]/92 backdrop-blur-[2px] border border-[#c89b54]/25 rounded-xl p-6 shadow-2xl shadow-black/60"
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#c89b54]/20">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-sm font-semibold text-[#efe5d2]">
                    Recent Rolls
                  </h2>
                  <span className="text-xs font-mono tabular-nums text-[#a89984]">
                    {roster.length}
                  </span>
                </div>
                {roster.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearRoster}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] rounded-md text-xs font-medium text-[#b5a48b] hover:text-[#efe5d2] hover:bg-[#efe5d2]/[0.06] transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e6aa47]"
                  >
                    <Trash2
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                    />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {roster.length === 0 ? (
                <p className="pt-4 text-sm text-[#b5a48b] leading-relaxed">
                  Characters rolled during this session appear here for quick
                  comparison before saving to your deck.
                </p>
              ) : (
                <ul className="divide-y divide-[#c89b54]/15 max-h-[260px] overflow-y-auto mt-1">
                  {roster.map((entry) => {
                    const isActive = currentCharacter?.id === entry.id;
                    const entryLevel = getLevelFromXp(xpById[entry.id] ?? 0);
                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectRosterCharacter(entry)}
                          className={`w-full text-left py-2.5 px-2.5 -mx-2.5 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e6aa47] ${
                            isActive
                              ? "bg-[#c89b54]/15 text-[#faf2e1]"
                              : "hover:bg-[#efe5d2]/[0.05] text-[#e3d6be]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium truncate">
                              {entry.name}
                            </span>
                            <span
                              className={`text-xs font-medium shrink-0 ${
                                isActive ? "text-[#e6b45c]" : "text-[#a89984]"
                              }`}
                            >
                              {entry.characterClass}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-[#a89984] truncate">
                            Lv. {entryLevel} · HP {entry.cardStats.health} · MP{" "}
                            {entry.cardStats.mana} · STR{" "}
                            {entry.cardStats.strength}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
