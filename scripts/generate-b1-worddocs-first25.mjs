// scripts/generate-b1-worddocs-first25.mjs



import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

// ESM helpers to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- CONFIG ----------

// Use gpt-5-mini as you decided
const MODEL = 'gpt-5-mini';

// INPUT: b1-words-openai-input.json in project root
const INPUT_JSON_PATH = path.resolve(
  __dirname,
  '../src/assets/b1-words-openai-input.json'
);

// OUTPUT: we’ll write directly into src/assets so Angular can load it
const OUTPUT_JSON_PATH = path.resolve(
  __dirname,
  '../src/assets/b1-words-openai-output-first25.json'
);

// ---------- OpenAI INITIALISATION ----------

const apiKey = process.env['OPENAI_API_KEY'];
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set in .env');
}

const openai = new OpenAI({
  apiKey,
  timeout: 500000,   // timeout in ms (here: 300000 = 5 minutes)
  maxRetries: 2,      // optional: retry on transient issues
});


// ---------- SYSTEM PROMPT ----------

const SYSTEM_PROMPT = `
You are an ESL lexicographer creating dictionary entries for B1 learners of English.

For each input word (lemma), you must return a JSON object in this top-level format:

{
  "words": [ WordDoc, WordDoc, ... ]
}

Each WordDoc MUST have exactly these fields and no extras:

- lemma: string                     // canonical key from input
- english: string                   // main UK spelling
- enUrl: string                     // may be empty ""
- american: string                  // main US spelling (can be same as english)
- amUrl: string                     // may be empty ""
- language: string                  // always "en"
- lessons: number[]                 // lesson numbers from input, no new numbers
- shortDescription: {
    "en-GB": string;                // short phrase, A1–A2 level, 3–8 words, no full stop
    "en-US": string;                // short phrase, A1–A2 level, 3–8 words, no full stop
  }
- levels: string[]                  // always ["B1"]
- partsOfSpeech: [
    {
      partOfSpeech: string;         // e.g. "verb", "noun", "adjective", "adverb", "preposition"
      definitions: [
        {
          senseId: string;          // "s1", "s2", "s3" ... within that lemma
          definition: string;       // 12–18 words, A1–A2 level
          url: string;              // may be empty ""
          examples: {
            "en-GB": [{ "text": string, "audioUrl": string }];
            "en-US": [{ "text": string, "audioUrl": string }];
          }
        }
      ]
    }
  ]
- topics: [
    {
      topicKey: string;             // topic from input, do NOT invent new topic names
      lessons: number[];            // subset or all of the top-level lessons, no new numbers
      examples: {
        "en-GB": [{ "text": string, "audioUrl": string }];
        "en-US": [{ "text": string, "audioUrl": string }];
      }
    }
  ]
- variants: {
    "en-GB"?: {
      phonetics?: {
        ipa: string;                // British IPA
        audioUrl: string;           // may be empty ""
        voice: string;              // always "en-GB"
      }
    };
    "en-US"?: {
      phonetics?: {
        ipa: string;                // American IPA
        audioUrl: string;           // may be empty ""
        voice: string;              // always "en-US"
      }
    };
  }

PHONETICS REQUIREMENTS

- Always include BOTH "en-GB" and "en-US" variants with phonetics.
- The ipa field MUST:
  - be surrounded by slashes, e.g. "/ˈestɪmeɪt/"
  - contain no spaces inside the slashes
  - contain no syllable dots, no stress marks on monosyllables
  - use exactly ONE primary stress mark (ˈ) in multi-syllable words
  - NOT use secondary stress (ˌ)

- For "en-GB" ipa, use a non-rhotic British standard (RP-style) with this vowel system:
  
  - IMPORTANT: use /e/ (NOT /ɛ/) for the DRESS vowel
    - e.g. "/ˈestɪmeɪt/", "/ʌpˈsteəz/"
  
INSTRUCTIONS

- Use only A1–A2 grammar and vocabulary in:
  - shortDescription
  - ALL example sentences
  - and, as far as possible, in definitions (avoid abstract or technical words if a simpler phrase exists).

- Definitions:
  - 12–18 words.
  - One simple main clause, avoid complex relative clauses when possible.
  - Start with a capital letter and end with a full stop.

- Senses and parts of speech:
  - Give 1–3 brief senses per lemma.
  - Usually use ONE main partOfSpeech (e.g. "verb"); only add a second when clearly needed.
  - In each partOfSpeech, definitions[] MUST have senseIds "s1", "s2", "s3" in order.

- Examples:
  - For each sense, write exactly:
    - one "en-GB" example sentence
    - one "en-US" example sentence
  - Each example:
    - 12–18 words
    - A1–A2 level
    - One sentence, starting with a capital letter and ending with ".", "?" or "!"
    - No contractions (write "do not", not "don't").
  - Keep spelling consistent:
    - GB: "favourite", "neighbour", "travelling"
    - US: "favorite", "neighbor", "traveling"

- Topics:
  - For each topic in topics[], write ONE GB and ONE US example.
  - Topic examples must clearly connect the lemma to that topic.
  - If the topic refers to part of speech (e.g. "Adjectives", "Common verbs"), you should use real-world usage sentences
    with this part of speech.
  - prefer real-world usage sentences.

- Spelling:
  - If the GB and US spelling are the same, repeat the same spelling in "english" and "american".
  - If they differ, give the correct main spelling in each.

- Lessons and topics:
  - Do NOT invent new lesson numbers.
  - The top-level "lessons" array must come directly from the input.
  - Each topic's "lessons" array must use only numbers from the top-level lessons.

- Audio:
  - Set ALL "audioUrl" fields and ALL "url" fields to "" (empty string).

OUTPUT RULES

- Return ONLY valid JSON.
- Do NOT include comments.
- Do NOT include trailing commas.
- Do NOT include explanations outside the JSON.
`;

// ---------- HELPERS ----------

async function callOpenAIForBatch(batch) {
  const userPayload = { words: batch };

  const completion = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: JSON.stringify(userPayload) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned no content');
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error('Failed to parse JSON from OpenAI:', content);
    throw err;
  }

  if (!parsed.words || !Array.isArray(parsed.words)) {
    throw new Error('OpenAI JSON has no "words" array');
  }

  return parsed.words;
}

// ---------- MAIN ----------

async function main() {
  console.log('Reading input JSON from', INPUT_JSON_PATH);
  const fileText = await fs.readFile(INPUT_JSON_PATH, 'utf8');
  const input = JSON.parse(fileText);

  if (!input.words || !Array.isArray(input.words) || input.words.length === 0) {
    throw new Error('Input JSON has no "words" array');
  }

  // ✅ Only first 25 words for now
  const first25 = input.words.slice(0, 25);
  console.log(`Processing first ${first25.length} words...`);

  // 1) Call OpenAI
  const wordDocs = await callOpenAIForBatch(first25);

  // 2) Save output to JSON file (in src/assets)
  const outputPayload = { words: wordDocs };
  await fs.writeFile(
    OUTPUT_JSON_PATH,
    JSON.stringify(outputPayload, null, 2),
    'utf8'
  );
  console.log('Saved OpenAI output to', OUTPUT_JSON_PATH);

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
