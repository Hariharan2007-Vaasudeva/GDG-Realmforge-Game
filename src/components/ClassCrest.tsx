import { CharacterClass } from '../data/fantasyGenerator';

interface ClassCrestProps {
  characterClass: CharacterClass;
  className?: string;
}

export function ClassCrest({ characterClass, className = 'w-11 h-11' }: ClassCrestProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg border border-[#c89b54]/30 bg-[#c89b54]/10 text-[#e6b45c] shrink-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        {characterClass === 'Warrior' && (
          <>
            <path d="M14.5 4.5L19.5 9.5L9.5 19.5H4.5V14.5L14.5 4.5Z" />
            <path d="M12.5 6.5L17.5 11.5" />
            <path d="M4.5 19.5L8 16" />
          </>
        )}
        {characterClass === 'Mage' && (
          <>
            <path d="M12 3L14.2 8.2L19.5 10.5L14.2 12.8L12 18L9.8 12.8L4.5 10.5L9.8 8.2L12 3Z" />
            <path d="M12 18V21.5" />
            <circle cx="18.5" cy="5.5" r="1" />
          </>
        )}
        {characterClass === 'Rogue' && (
          <>
            <path d="M19 4L9 14" />
            <path d="M15.5 4.5L19.5 4L19 8" />
            <path d="M5 20L10.5 14.5" />
            <path d="M7.5 12.5L11.5 16.5" />
          </>
        )}
        {characterClass === 'Ranger' && (
          <>
            <path d="M5 19C5 11.268 11.268 5 19 5" />
            <path d="M5 19L19 5" />
            <path d="M14 5H19V10" />
          </>
        )}
        {characterClass === 'Paladin' && (
          <>
            <path d="M12 3L19 6V12C19 16.5 15.8 19.8 12 21C8.2 19.8 5 16.5 5 12V6L12 3Z" />
            <path d="M12 7.5V15.5" />
            <path d="M8.5 11H15.5" />
          </>
        )}
        {characterClass === 'Cleric' && (
          <>
            <circle cx="12" cy="12" r="7.5" />
            <path d="M12 7.5V16.5" />
            <path d="M8.5 12H15.5" />
          </>
        )}
        {characterClass === 'Bard' && (
          <>
            <path d="M9 17.5V6.5L18 4.5V15.5" />
            <circle cx="7" cy="17.5" r="2.5" />
            <circle cx="16" cy="15.5" r="2.5" />
          </>
        )}
        {characterClass === 'Druid' && (
          <>
            <path d="M12 20V10" />
            <path d="M12 13C8 13 5.5 10.5 5.5 6.5C9.5 6.5 12 9 12 13Z" />
            <path d="M12 11C16 11 18.5 8.5 18.5 4.5C14.5 4.5 12 7 12 11Z" />
          </>
        )}
      </svg>
    </div>
  );
}
