

// src/app/models/vocab.ts

export type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Locale = 'en-GB' | 'en-US';

/**
 * Localised map that lets you omit a locale entirely instead of using "".
 * Runtime fallback idea:
 * - if en-US missing -> fall back to en-GB
 * - if en-GB missing -> fall back to en-US
 */
export type Localised<T> = Partial<Record<Locale, T>>;

/**
 * One piece of text (definition, example, topic sentence) with optional audio.
 */
export interface TextWithAudio {
  text: string;
  audioUrl?: string | null;

  // useful metadata for filtering/grouping
  partOfSpeech?: string;
  senseId?: string;
}

/**
 * Phonetic info + optional audio/voice.
 */
export interface Phonetics {
  ipa: string;
  audioUrl?: string | null;
  voice?: string;
}

/**
 * Headword data for a locale. This is what you display as the word
 * for this sense in that locale (e.g. flat vs apartment).
 */
export interface HeadwordEntry {
  text: string;                 // "flat" / "apartment"
  audioUrl?: string | null;     // optional headword audio
  phonetics?: Phonetics;        // allows: { ipa: "/flæt/" }
}

/**
 * One sense (meaning) of the word.
 * Matches your JSON exactly: senseId + headwords + definition + examples.
 */
export interface DefinitionSense {
  senseId: string;

  /**
   * Optional per-locale headword override for THIS sense.
   * Example:
   * headwords: {
   *   "en-GB": { text:"flat", phonetics:{ipa:"/flæt/"} },
   *   "en-US": { text:"apartment", phonetics:{ipa:"/əˈpɑːrtmənt/"} }
   * }
   */
  headwords?: Localised<HeadwordEntry>;

  /** Localised definition (per locale) */
  definition: Localised<TextWithAudio>;

  /** Localised examples array (per locale) */
  examples: Localised<TextWithAudio[]>;

  /**
   * If undefined → applies to both locales.
   * If ["en-GB"] → GB-only sense.
   * If ["en-US"] → US-only sense.
   */
 // locales?: Locale[];
}

/**
 * Part of speech entry: noun, verb, adjective...
 */
export interface PartOfSpeech {
  partOfSpeech: string;
  definitions: DefinitionSense[];
}

/**
 * Topic usage examples (per locale).
 * Each example can carry partOfSpeech + senseId so you can connect it to a sense.
 */
export interface TopicUsage {
  topicKey: string;
  lessons: number[];
  examples: Localised<TextWithAudio[]>;
}

/**
 * Word-level phonetics (default headword phonetics per locale).
 * This is still useful even if senses also have headword phonetics.
 */
export interface VariantSection {
  phonetics?: Phonetics;
}

/**
 * Main word document shape.
 */
export interface WordDoc {
  id: number;

  lemma: string;
  language: 'en';

  // Default forms used when a sense does NOT provide headwords
  english: string;
  enUrl?: string | null;

  american: string;
  amUrl?: string | null;

  lessons: number[];
  levels?: CEFR[];

  partsOfSpeech: PartOfSpeech[];
  topics?: TopicUsage[];

  // default headword phonetics per locale
  variants: Partial<Record<Locale, VariantSection>>;

  createdAt?: any;
  updatedAt?: any;
}


/* Old  src/app/models/vocab.ts

export type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Locale = 'en-GB' | 'en-US';

/**
 * One piece of text (word, definition, example) with an optional audio URL.

export interface TextWithAudio {
  text: string;
  audioUrl?: string | null;
  partOfSpeech?: string;  // e.g. "verb", "adjective"
  senseId?: string;       // e.g. "s1", "s2"
}

/**
 * Localised examples (each sentence can have its own audio).

export interface LocalisedExamples {
  'en-GB': TextWithAudio[];
  'en-US': TextWithAudio[];
}

/**
 * Localised definition: exactly one definition text per locale, each with its own audio.
 * This REPLACES the old "definition: string" + "url?: string" pair.
 
export interface LocalisedDefinition {
  'en-GB': TextWithAudio; // definition text + audio for GB
  'en-US': TextWithAudio; // definition text + audio for US
}

/**
 * Optional per-locale override for a given SENSE:
 * - headword: what to display as the word for that sense (e.g. "apartment" in US, "flat" in GB)
 * - ipa / audioUrl: sense-level phonetics/audio if you want to differ from the main ones
 
export interface SenseVariant {
  headword?: string;
  ipa?: string;
  audioUrl?: string | null;
   locales?: Locale[];
}

/**
 * One sense (meaning) of the word.
 * - definition: localised, with audio per locale
 * - examples: localised examples with audio
 * - locales: if set, this sense only applies to these locales
 *            e.g. ["en-US"] for a US-only meaning, ["en-GB"] for GB-only
 * - variants: per-locale overrides for this sense (e.g. "flat" vs "apartment")
 
export interface DefinitionSense {
  senseId: string;

  // Localised definition text + audio
  definition: LocalisedDefinition;

  // Localised examples for this sense
  examples: LocalisedExamples;

  /**
   * If undefined → applies to both locales.
   * If ["en-GB"] → GB-only sense.
   * If ["en-US"] → US-only sense.
   
  locales?: Locale[];

  /**
   * Per-locale override for this sense:
   * e.g. { "en-US": { headword: "apartment" } }
   
  variants?: Partial<Record<Locale, SenseVariant>>;
}

/**
 * Part of speech entry: e.g. verb, noun, adjective.
 * Each has one or more senses (DefinitionSense).
 
export interface PartOfSpeech {
  partOfSpeech: string;          // 'verb', 'noun', 'adjective', etc.
  definitions: DefinitionSense[];
}

/**
 * Phonetic info + audio for the HEADWORD in a given locale.
 * This is word-level, not per-sense.
 
export interface Phonetics {
  ipa: string;
  audioUrl?: string | null;      // main headword audio for this locale
  voice?: string;                // TTS voice id or description
}

/**
 * Topic usage:
 * - topicKey: canonical topic id (e.g. "House", "Adjectives")
 * - lessons: lesson numbers where THIS word appears in this topic
 * - examples: GB/US example sentences with audio
 
export interface TopicUsage {
  topicKey: string;
  lessons: number[];
  examples: LocalisedExamples;
}

/**
 * Variant-specific data for each locale.
 * Right now only phonetics, but can grow later.
 
export interface VariantSection {
  phonetics?: Phonetics;
}

/**
 * Main word document shape.
 * - lemma: canonical key (usually GB form, but you choose)
 * - english / american: main forms shown in the UI
 * - enUrl / amUrl: OPTIONAL main headword audio URLs (you can also ignore them and
 *   just use variants["en-GB"].phonetics.audioUrl if you prefer).
 
export interface WordDoc {
  id: number;

  lemma: string;                 // canonical key (often the GB spelling)
  english: string;               // UK form shown in UI (e.g. 'flat')
  enUrl?: string | null;         // UK headword audio url (optional, can be empty)

  american: string;              // US form shown in UI (e.g. 'apartment')
  amUrl?: string | null;         // US headword audio url (optional, can be empty)

  language: 'en';

  lessons: number[];             // all lessons where this word appears

  levels?: CEFR[];

  // All meanings for this lemma grouped by part of speech
  partsOfSpeech: PartOfSpeech[];

  // Topic-specific usage (examples per topic)
  topics?: TopicUsage[];

  // Per-locale phonetics for the headword
  variants: Partial<Record<Locale, VariantSection>>;

  createdAt?: any;               // Firestore Timestamp
  updatedAt?: any;               // Firestore Timestamp
}

/*. Old
// src/app/models/vocab.ts

export type CEFR = 'A1'|'A2'|'B1'|'B2'|'C1'|'C2';
export type Locale = 'en-GB' | 'en-US';

export interface TextWithAudio {
  text: string;
  audioUrl?: string | null;
}



export interface ShortDescription {
  'en-GB': TextWithAudio[];
  'en-US': TextWithAudio[];
}




export interface LocalisedExamples {
  'en-GB': TextWithAudio[];
  'en-US': TextWithAudio[];
}



export interface DefinitionSense {
  senseId: string;
  definition: string;
  url?: string | null;           // audio for definition (optional)
  examples: LocalisedExamples;   // GB/US examples with audio
}



export interface PartOfSpeech {
  partOfSpeech: string;          // 'verb', 'noun', etc.
  definitions: DefinitionSense[];
}



export interface Phonetics {
  ipa: string;
  audioUrl?: string | null;      // main headword audio for this locale
  voice?: string;                // TTS voice id or description
}



export interface TopicUsage {
  topicKey: string;
  lessons: number[];
  examples: LocalisedExamples;
}



export interface VariantSection {
  phonetics?: Phonetics;
}



export interface WordDoc {
  id:number;
  lemma: string;                 // canonical key (usually same as 'english')
  english: string;               // UK form shown in UI (e.g. 'colour')
  enUrl?: string | null;         // UK headword audio url

  american: string;              // US form shown in UI (e.g. 'color')
  amUrl?: string | null;         // US headword audio url

  language: 'en';

  lessons: number[];             // all lessons where this word appears

  shortDescription: ShortDescription; // localised short description

  levels?: CEFR[];

  partsOfSpeech: PartOfSpeech[];

  topics?: TopicUsage[];

  variants: Partial<Record<Locale, VariantSection>>;

  createdAt?: any;               // Firestore Timestamp
  updatedAt?: any;               // Firestore Timestamp
}*/
