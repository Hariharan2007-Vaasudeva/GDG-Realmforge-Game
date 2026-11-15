import { CharacterClass, FantasyCharacter } from '../data/fantasyGenerator';
import { PortraitConfig, TonePalette } from '../data/portraitGenerator';

interface CharacterPortraitProps {
  character: FantasyCharacter;
  config: PortraitConfig;
}

const CLASS_OUTFIT_PALETTES: Record<CharacterClass, TonePalette[]> = {
  Warrior: [
    { base: '#64748B', shadow: '#475569', highlight: '#94A3B8' },
    { base: '#8B3A3A', shadow: '#5E2323', highlight: '#B55555' },
    { base: '#4A5568', shadow: '#2D3748', highlight: '#718096' },
  ],
  Mage: [
    { base: '#2B4C8C', shadow: '#1B315E', highlight: '#4470C4' },
    { base: '#5E3473', shadow: '#3D204D', highlight: '#854FA1' },
    { base: '#215B63', shadow: '#133B40', highlight: '#36828C' },
  ],
  Rogue: [
    { base: '#2D333B', shadow: '#1B1F24', highlight: '#464F5C' },
    { base: '#4B2838', shadow: '#2E1722', highlight: '#6E3C53' },
    { base: '#263B32', shadow: '#16241E', highlight: '#3C5C4E' },
  ],
  Ranger: [
    { base: '#2F573D', shadow: '#1D3826', highlight: '#487D5A' },
    { base: '#5E462D', shadow: '#3D2D1B', highlight: '#856544' },
    { base: '#314D54', shadow: '#1F3237', highlight: '#4B727C' },
  ],
  Paladin: [
    { base: '#CBD5E1', shadow: '#94A3B8', highlight: '#F1F5F9' },
    { base: '#967736', shadow: '#6B5221', highlight: '#C49F4D' },
    { base: '#3B5685', shadow: '#243757', highlight: '#5A7CB5' },
  ],
  Cleric: [
    { base: '#E2E8F0', shadow: '#B0BCCB', highlight: '#FFFFFF' },
    { base: '#3F6289', shadow: '#28405C', highlight: '#5E88B8' },
    { base: '#6B4C7A', shadow: '#483054', highlight: '#916CA3' },
  ],
  Bard: [
    { base: '#8C2D49', shadow: '#5C1B2E', highlight: '#B84668' },
    { base: '#364982', shadow: '#212D54', highlight: '#536BB5' },
    { base: '#7A4D28', shadow: '#4F3017', highlight: '#A66C3B' },
  ],
  Druid: [
    { base: '#436339', shadow: '#2A4023', highlight: '#608A53' },
    { base: '#6E4E34', shadow: '#4A3320', highlight: '#946C4C' },
    { base: '#2F5950', shadow: '#1C3832', highlight: '#478074' },
  ],
};

const INK = '#0E1018';

export function CharacterPortrait({ character, config }: CharacterPortraitProps) {
  const outfit = CLASS_OUTFIT_PALETTES[character.characterClass][config.outfitVariant % 3];
  const { skin, hairColor, bgPalette } = config;
  const lineage = character.lineage;
  const cls = character.characterClass;

  const isElf = lineage === 'High Elf' || lineage === 'Wood Elf' || lineage === 'Half-Elf';
  const isTiefling = lineage === 'Tiefling';
  const isDragonborn = lineage === 'Dragonborn';
  const isOrc = lineage === 'Half-Orc';
  const isHalfling = lineage === 'Halfling';

  const headScale = isHalfling ? 0.94 : 1;

  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label={`Cartoon video game style portrait of ${character.name}, ${lineage} ${cls}`}
      className="w-full h-full block select-none"
    >
      <defs>
        <radialGradient id={`bg-${config.seed}`} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor={bgPalette.inner} />
          <stop offset="100%" stopColor={bgPalette.outer} />
        </radialGradient>
        <clipPath id={`frame-${config.seed}`}>
          <rect x="0" y="0" width="320" height="320" rx="14" />
        </clipPath>
      </defs>

      <g clipPath={`url(#frame-${config.seed})`}>
        {/* Backdrop */}
        <rect x="0" y="0" width="320" height="320" fill={`url(#bg-${config.seed})`} />

        {/* Video-game comic radial burst */}
        <g opacity="0.22" fill={bgPalette.burst}>
          <polygon points="160,145 10,0 65,0" />
          <polygon points="160,145 135,0 185,0" />
          <polygon points="160,145 255,0 310,0" />
          <polygon points="160,145 320,75 320,135" />
          <polygon points="160,145 0,85 0,145" />
          <polygon points="160,145 0,210 0,260" />
          <polygon points="160,145 320,200 320,255" />
        </g>

        {/* Subtle halo ring behind head */}
        <circle
          cx="160"
          cy="142"
          r="92"
          fill="none"
          stroke={bgPalette.burst}
          strokeWidth="3"
          strokeDasharray="10 8"
          opacity="0.45"
        />

        {/* Back hair / hood / cape layer */}
        {(cls === 'Rogue' || cls === 'Ranger') && (
          <path
            d="M78,240 C74,155 96,74 160,72 C224,74 246,155 242,240 Z"
            fill={outfit.shadow}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        )}

        {!isDragonborn && config.hairStyle === 3 && (
          <path
            d="M96,125 C84,185 88,245 102,272 L218,272 C232,245 236,185 224,125 Z"
            fill={hairColor.shadow}
            stroke={INK}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}

        {/* Back Weapon / Prop silhouettes */}
        {cls === 'Ranger' && (
          <g stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
            <path d="M242,42 C276,105 276,195 242,262" fill="none" stroke="#8C5A32" strokeWidth="7" />
            <path d="M242,42 C276,105 276,195 242,262" fill="none" stroke={INK} strokeWidth="2.5" />
            <line x1="242" y1="45" x2="242" y2="258" stroke="#E2E8F0" strokeWidth="2" />
          </g>
        )}

        {cls === 'Warrior' && (
          <g stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
            <polygon points="244,36 266,36 258,215 236,215" fill="#CBD5E1" />
            <polygon points="255,36 266,36 258,215 247,215" fill="#94A3B8" />
            <rect x="226" y="205" width="44" height="10" rx="3" fill="#D97706" />
          </g>
        )}

        {/* Torso & Shoulders */}
        <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
          {/* Base Tunic / Armor */}
          <path
            d="M52,324 C56,246 95,214 160,214 C225,214 264,246 268,324 Z"
            fill={outfit.base}
          />
          {/* Cel-shaded shadow side */}
          <path
            d="M160,214 C225,214 264,246 268,324 L195,324 C192,265 178,228 160,214 Z"
            fill={outfit.shadow}
            stroke="none"
          />
          {/* Re-stroke torso outline cleanly */}
          <path
            d="M52,324 C56,246 95,214 160,214 C225,214 264,246 268,324 Z"
            fill="none"
            stroke={INK}
            strokeWidth="4"
          />

          {/* Class-specific Armor / Collar Details */}
          {(cls === 'Warrior' || cls === 'Paladin') && (
            <>
              <path
                d="M58,255 C68,220 98,208 118,222 L106,266 C82,266 64,264 58,255 Z"
                fill={outfit.highlight}
              />
              <path
                d="M262,255 C252,220 222,208 202,222 L214,266 C238,266 256,264 262,255 Z"
                fill={outfit.highlight}
              />
              {cls === 'Paladin' && (
                <path
                  d="M142,235 L160,222 L178,235 L160,282 Z"
                  fill="#F59E0B"
                />
              )}
            </>
          )}

          {(cls === 'Mage' || cls === 'Cleric') && (
            <>
              <path
                d="M104,218 L128,275 L160,256 L192,275 L216,218"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="5"
              />
              <circle cx="160" cy="258" r="9" fill={cls === 'Mage' ? '#38BDF8' : '#FBBF24'} />
            </>
          )}

          {(cls === 'Rogue' || cls === 'Ranger') && (
            <>
              <path
                d="M100,216 L160,268 L220,216 L205,204 L160,242 L115,204 Z"
                fill={outfit.highlight}
              />
              <line x1="112" y1="240" x2="205" y2="320" stroke="#784C2A" strokeWidth="10" />
              <line x1="112" y1="240" x2="205" y2="320" stroke={INK} strokeWidth="3" />
            </>
          )}

          {cls === 'Bard' && (
            <>
              <path d="M122,216 L160,276 L198,216 Z" fill="#F8FAFC" />
              <path d="M98,224 L132,274 L110,286 L82,240 Z" fill="#F59E0B" />
            </>
          )}

          {cls === 'Druid' && (
            <>
              <path
                d="M90,235 C110,220 135,235 160,238 C185,235 210,220 230,235 L215,264 C190,255 130,255 105,264 Z"
                fill="#7B5636"
              />
              <circle cx="132" cy="248" r="6" fill="#84CC16" />
              <circle cx="188" cy="248" r="6" fill="#84CC16" />
            </>
          )}
        </g>

        {/* Neck */}
        <path
          d="M138,188 L138,226 C138,236 182,236 182,226 L182,188 Z"
          fill={skin.shadow}
          stroke={INK}
          strokeWidth="3.5"
        />

        {/* Head & Facial Features */}
        <g transform={`translate(160, 140) scale(${headScale}) translate(-160, -140)`}>
          {/* Ears */}
          {isElf ? (
            <g fill={skin.base} stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
              <path d="M104,132 L64,114 L98,154 Z" />
              <path d="M216,132 L256,114 L222,154 Z" />
            </g>
          ) : !isDragonborn ? (
            <g fill={skin.base} stroke={INK} strokeWidth="3.5">
              <ellipse cx="100" cy="144" rx="10" ry="15" />
              <ellipse cx="220" cy="144" rx="10" ry="15" />
            </g>
          ) : null}

          {/* Tiefling Horns / Druid Antlers */}
          {isTiefling && (
            <g fill="#3B2D38" stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
              <path d="M122,94 C104,64 106,36 126,24 C118,46 126,68 138,88 Z" />
              <path d="M198,94 C216,64 214,36 194,24 C202,46 194,68 182,88 Z" />
            </g>
          )}

          {cls === 'Druid' && !isTiefling && (
            <g fill="none" stroke="#8C6239" strokeWidth="7" strokeLinecap="round">
              <path d="M126,86 C112,62 104,42 114,24 M110,54 L94,44" />
              <path d="M194,86 C208,62 216,42 206,24 M210,54 L226,44" />
            </g>
          )}

          {/* Dragonborn Crests */}
          {isDragonborn && (
            <g fill={skin.shadow} stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
              <path d="M118,92 L92,58 L134,82 Z" />
              <path d="M202,92 L228,58 L186,82 Z" />
              <path d="M148,74 L160,40 L172,74 Z" fill={skin.highlight} />
            </g>
          )}

          {/* Face Shape */}
          <path
            d={
              isDragonborn
                ? 'M105,120 C105,84 215,84 215,120 L208,174 C204,196 184,210 160,210 C136,210 116,196 112,174 Z'
                : 'M104,124 C104,80 216,80 216,124 L212,164 C208,194 184,208 160,208 C136,208 112,194 108,164 Z'
            }
            fill={skin.base}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Cel-shaded cheek & chin shadow */}
          <path
            d="M174,88 C202,92 215,108 215,126 L211,164 C207,192 184,206 160,206 C178,196 194,174 196,144 C198,118 190,98 174,88 Z"
            fill={skin.shadow}
            opacity="0.55"
          />

          {/* Nose */}
          <path
            d={isDragonborn ? 'M152,150 L160,158 L168,150' : 'M158,136 L154,154 L164,156'}
            fill="none"
            stroke={INK}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Face Marks */}
          {config.faceMark === 'cheekScar' && (
            <path
              d="M126,146 L142,166"
              stroke="#7F1D1D"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.75"
            />
          )}
          {config.faceMark === 'warpaint' && (
            <g fill="#DC2626" opacity="0.7">
              <rect x="116" y="150" width="22" height="5" rx="2" />
              <rect x="182" y="150" width="22" height="5" rx="2" />
            </g>
          )}
          {config.faceMark === 'arcaneRune' && (
            <path
              d="M160,96 L165,106 L160,116 L155,106 Z"
              fill="#38BDF8"
              stroke={INK}
              strokeWidth="1.5"
            />
          )}
          {config.faceMark === 'freckles' && (
            <g fill={skin.shadow}>
              <circle cx="126" cy="154" r="1.8" />
              <circle cx="133" cy="157" r="1.8" />
              <circle cx="187" cy="157" r="1.8" />
              <circle cx="194" cy="154" r="1.8" />
            </g>
          )}

          {/* Eyes */}
          <g>
            {/* Eye Whites */}
            <ellipse cx="134" cy="136" rx="12" ry="9" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
            <ellipse cx="186" cy="136" rx="12" ry="9" fill="#FFFFFF" stroke={INK} strokeWidth="3" />

            {/* Irises */}
            <circle cx="136" cy="136" r="5.5" fill={config.eyeColor} stroke={INK} strokeWidth="2" />
            <circle cx="184" cy="136" r="5.5" fill={config.eyeColor} stroke={INK} strokeWidth="2" />

            {/* Pupils + Game-Style Catchlights */}
            <circle cx="136" cy="136" r="2.5" fill={INK} />
            <circle cx="184" cy="136" r="2.5" fill={INK} />
            <circle cx="138.5" cy="133.5" r="2" fill="#FFFFFF" />
            <circle cx="186.5" cy="133.5" r="2" fill="#FFFFFF" />

            {/* Eyebrows */}
            {config.eyeExpression === 'determined' || config.eyeExpression === 'fierce' ? (
              <g stroke={INK} strokeWidth="4.2" strokeLinecap="round">
                <path d="M119,120 L147,126" />
                <path d="M201,120 L173,126" />
              </g>
            ) : config.eyeExpression === 'smirk' ? (
              <g stroke={INK} strokeWidth="4" strokeLinecap="round">
                <path d="M120,123 Q134,116 146,123" fill="none" />
                <path d="M174,125 L199,119" />
              </g>
            ) : (
              <g stroke={INK} strokeWidth="3.8" strokeLinecap="round" fill="none">
                <path d="M120,122 Q134,116 146,122" />
                <path d="M174,122 Q186,116 200,122" />
              </g>
            )}
          </g>

          {/* Beard (optional for dwarves & bearded builds) */}
          {config.hasBeard && !isDragonborn && (
            <path
              d="M108,162 C110,204 134,228 160,232 C186,228 210,204 212,162 C196,174 180,174 160,174 C140,174 124,174 108,162 Z"
              fill={hairColor.base}
              stroke={INK}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          )}

          {/* Mouth */}
          {config.mouthExpression === 'confident' && (
            <path
              d="M144,174 Q160,185 178,172"
              fill="none"
              stroke={INK}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {config.mouthExpression === 'stoic' && (
            <path
              d="M146,176 L174,176"
              fill="none"
              stroke={INK}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {config.mouthExpression === 'mischievous' && (
            <path
              d="M146,176 Q164,182 178,169"
              fill="none"
              stroke={INK}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
          {config.mouthExpression === 'battleReady' && (
            <path
              d="M143,173 Q160,168 177,173 Q175,185 160,185 Q145,185 143,173 Z"
              fill="#FFFFFF"
              stroke={INK}
              strokeWidth="3"
            />
          )}

          {/* Half-Orc Tusks */}
          {isOrc && (
            <g fill="#FEF3C7" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
              <path d="M140,176 L136,163 L146,173 Z" />
              <path d="M180,176 L184,163 L174,173 Z" />
            </g>
          )}

          {/* Hair Styles (non-Dragonborn) */}
          {!isDragonborn && (
            <g fill={hairColor.base} stroke={INK} strokeWidth="3.8" strokeLinejoin="round">
              {config.hairStyle === 0 && (
                /* Swept Heroic Locks */
                <path d="M100,128 C96,82 132,62 166,66 C204,68 224,92 220,128 C206,104 186,98 164,102 C142,92 116,106 100,128 Z" />
              )}
              {config.hairStyle === 1 && (
                /* Spiky Action / Anime Game Hair */
                <path d="M100,128 L88,98 L114,94 L118,64 L146,80 L170,56 L184,82 L214,68 L208,98 L230,104 L218,128 C202,108 184,102 160,104 C136,102 116,108 100,128 Z" />
              )}
              {config.hairStyle === 2 && (
                /* Tousled Side-Swept Bangs */
                <path d="M102,132 C98,78 136,64 172,68 C208,72 222,96 218,132 C202,102 170,96 130,114 C118,120 110,124 102,132 Z" />
              )}
              {config.hairStyle === 3 && (
                /* Regal Parted Crown */
                <path d="M102,126 C100,80 132,66 160,68 C188,66 220,80 218,126 C200,100 176,94 160,108 C144,94 120,100 102,126 Z" />
              )}
              {config.hairStyle === 4 && (
                /* Short Cropped Top */
                <path d="M104,118 C108,78 134,68 160,68 C186,68 212,78 216,118 C196,98 124,98 104,118 Z" />
              )}
              {config.hairStyle === 5 && (
                /* Braided Topknot / Warrior Crest */
                <>
                  <circle cx="160" cy="54" r="18" fill={hairColor.shadow} />
                  <path d="M104,122 C106,82 134,70 160,70 C186,70 214,82 216,122 C194,100 126,100 104,122 Z" />
                </>
              )}
            </g>
          )}

          {/* Class Headgear */}
          {cls === 'Mage' && (
            <g stroke={INK} strokeWidth="3.8" strokeLinejoin="round">
              <path
                d="M78,94 Q160,76 242,94 Q208,108 160,104 Q112,108 78,94 Z"
                fill={outfit.base}
              />
              <path
                d="M110,92 L152,22 L192,42 L206,92 Q160,84 110,92 Z"
                fill={outfit.base}
              />
              <path d="M114,88 Q160,78 202,88" fill="none" stroke="#F59E0B" strokeWidth="5" />
            </g>
          )}

          {cls === 'Bard' && (
            <g stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
              <path d="M106,90 C124,62 192,62 214,94 C180,98 132,96 106,90 Z" fill={outfit.highlight} />
              <path d="M196,76 C220,52 246,44 256,56 C236,68 218,78 196,76 Z" fill="#F59E0B" />
            </g>
          )}

          {(cls === 'Rogue' || cls === 'Ranger') && (
            <path
              d="M84,142 C84,78 124,56 160,56 C196,56 236,78 236,142 C222,100 198,84 160,84 C122,84 98,100 84,142 Z"
              fill={outfit.base}
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          )}
        </g>

        {/* Foreground Magic / Weapon Flourishes */}
        {cls === 'Mage' && (
          <g>
            <circle cx="66" cy="224" r="24" fill="#38BDF8" opacity="0.28" />
            <circle cx="66" cy="224" r="13" fill="#7DD3FC" stroke={INK} strokeWidth="3" />
            <circle cx="62" cy="220" r="4" fill="#FFFFFF" />
          </g>
        )}

        {cls === 'Rogue' && (
          <g stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
            <path d="M52,294 L82,216 L90,256 L66,300 Z" fill="#E2E8F0" />
            <rect x="46" y="290" width="24" height="7" rx="2" transform="rotate(24 58 293)" fill="#D97706" />
          </g>
        )}

        {cls === 'Cleric' && (
          <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
            <circle cx="256" cy="230" r="18" fill="#FDE68A" opacity="0.3" stroke="none" />
            <path d="M256,210 L262,226 L278,232 L262,238 L256,254 L250,238 L234,232 L250,226 Z" fill="#FBBF24" />
          </g>
        )}

        {cls === 'Bard' && (
          <g stroke={INK} strokeWidth="3" strokeLinejoin="round" fill="#FDE047">
            <path d="M56,210 L56,178 L76,172 L76,204" fill="none" stroke="#FDE047" strokeWidth="4" />
            <circle cx="51" cy="210" r="6" />
            <circle cx="71" cy="204" r="6" />
          </g>
        )}
      </g>
    </svg>
  );
}
