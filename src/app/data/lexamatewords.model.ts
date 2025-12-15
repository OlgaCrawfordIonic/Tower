// src/app/models/vocab.ts

export type CEFR = 'A1'|'A2'|'B1'|'B2'|'C1'|'C2';
export type Locale = 'en-GB' | 'en-US';

/**
 * One piece of text (word or example) with an optional audio URL.
 */
export interface TextWithAudio {
  text: string;
  audioUrl?: string | null;
}

/**
 * Localised short description per locale.
 */
export interface ShortDescription {
  'en-GB': string;
  'en-US': string;
}

/**
 * Localised examples (each sentence can have its own audio).
 */
export interface LocalisedExamples {
  'en-GB': TextWithAudio[];
  'en-US': TextWithAudio[];
}

/**
 * One sense (meaning) of the word.
 * - definition: the meaning text
 * - url: optional audio for the whole definition
 * - examples: GB/US examples with audio
 */
export interface DefinitionSense {
  senseId: string;
  definition: string;
  url?: string | null;           // audio for definition (optional)
  examples: LocalisedExamples;   // GB/US examples with audio
}

/**
 * Part of speech entry.
 */
export interface PartOfSpeech {
  partOfSpeech: string;          // 'verb', 'noun', etc.
  definitions: DefinitionSense[];
}

/**
 * Phonetic info + audio for the headword in a given locale.
 */
export interface Phonetics {
  ipa: string;
  audioUrl?: string | null;      // main headword audio for this locale
  voice?: string;                // TTS voice id or description
}

/**
 * Topic usage:
 * - topicKey: canonical topic id (e.g. "literature", "education")
 * - lessons: lesson numbers where THIS word appears in this topic
 * - examples: GB/US example sentences with audio
 */
export interface TopicUsage {
  topicKey: string;
  lessons: number[];
  examples: LocalisedExamples;
}

/**
 * Variant-specific data for each locale.
 * Right now only phonetics, but can grow later.
 */
export interface VariantSection {
  phonetics?: Phonetics;
}

/**
 * Main word document shape.
 * - english / american: surface headwords for each variant
 * - enUrl / amUrl: main audio for each headword
 */
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
}
