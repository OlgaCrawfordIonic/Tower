// src/app/models/vocab.ts
export type CEFR = 'A1'|'A2'|'B1'|'B2'|'C1'|'C2';
export type Locale = 'en-GB' | 'en-US';

/** Sense (meaning) stays as you had it */
export interface DefinitionSense {
  senseId: string;
  definition: string;
  examples: {
    'en-GB': string[];                   // GB-specific examples
    'en-US': string[]; 
                    }                  // US-specific examples // optional tags per sense
}

export interface PartOfSpeech {
  partOfSpeech: string;
  definitions: DefinitionSense[];
}

export interface Phonetics {
  ipa: string;
  audioUrl?: string | null;
  voice?: string;
}

/**
 * Locale-aware topic usage.
 * - topicKey: canonical key for querying (e.g., 'literature')
 * - topicLabels: optional localized display names (if 'theater/theatre' type issues ever arise)
 * - lessons: all lesson numbers in which THIS word appears inside this topic
 * - examples: shared examples + GB/US overrides
 */
export interface TopicUsage {
  topicKey: string;                       // canonical ID for queries (e.g., 'literature')
 
  lessons: number[];                      // lesson refs for this topic
  examples: {
   
    'en-GB': string[];                   // GB-specific examples
    'en-US': string[];                   // US-specific examples
  };
}

/** Variant-specific data (keeps your legacy per-sense examples) */
export interface VariantSection {
  phonetics?: Phonetics;

 
}

/** Main word document */
export interface WordDoc {
  lemma: string;
  english:string;
  american:string;
  language: 'en';

  // Word may appear in many lessons overall
  lessons: number[];

  shortDescription: {
    'en-GB': string[];
    'en-US': string[];
  };
  levels?: CEFR[];

  /**
   * Topic usages (now locale-aware).
   * Each entry carries its own lessons + examples with GB/US overrides.
   */
  topics?: TopicUsage[];

 partsOfSpeech: PartOfSpeech[],

  // GB/US phonetics + (legacy) sense-based examples live here
  variants: Partial<Record<Locale, VariantSection>>;

  createdAt?: any;
  updatedAt?: any;

  
}
