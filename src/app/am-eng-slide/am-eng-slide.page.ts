import { Component, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,IonHeader, IonTitle, IonToolbar ,
  IonSegment,
  IonSegmentButton,
  IonLabel,
   IonButton,
  IonicSlides
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Swiper } from 'swiper';
import { WordDoc, CEFR, Locale } from  '../data/lexamatewords.model';
import { BehaviorSubject } from 'rxjs';
// For each question: which option (index) was chosen & was it correct
type QuizSelection = { selectedIndex: number; isCorrect: boolean };



// Strongly typed segments

 interface Lessons {
  lesson: number;
  lemmas: {
    part1: string[];
    activeWordsBritish1:string[];
    activeWordsAmerican1:string[];
    part2: string[];
    activeWordsBritish2:string[];
    activeWordsAmerican2:string[];
  };
  text: {
    part1: { american: string; british: string; };
    part2: { american: string; british: string; };
  };
};
type Segment = {
  type: 'text' | 'kw';
  text?: string;   // for plain text segments
  lemma?: string;  // for keyword segments (matches words[].lemma)
  label?: string;  // what is shown in the text
};
type SenseView = {
  senseId: string;
  definition: string;
  examples: string[];
};

type PartOfSpeechView = {
  partOfSpeech: string;
  senses: SenseView[];
};

type SlideWord = {
  lemma: string;     // canonical key
  display: string;   // english/american form
  ipa: string;
  parts: PartOfSpeechView[];
};

// ---------- 2. Build quiz questions from FIRST group ----------
type QuizOption = { label: string; isCorrect: boolean };

type QuizQuestion = {
  id: string;                // use lemma as stable id
  shortDescription: string;  // from WordDoc.shortDescription
  options: QuizOption[];     // [correct, wrong]
};
@Component({
  selector: 'app-am-eng-slide',
  templateUrl: './am-eng-slide.page.html',
  styleUrls: ['./am-eng-slide.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,   CommonModule,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonButton,
    IonLabel],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AmEngSlidePage  {
  @ViewChild('swiper', { static: false }) swiperRef?: ElementRef;
  swiperModules = [IonicSlides];

  waveUrl = new URL('/assets/voyage/waves-watercolor.svg', import.meta.url).href;
  boatUrl = new URL('/assets/voyage/boat-mini.svg', import.meta.url).href;
quizState = signal<Record<string, QuizSelection | undefined>>({});

// BehaviorSubject to collect *shortDescriptions* where the user made an error
quizMistakes$ = new BehaviorSubject<string[]>([]);
quizMistakes = signal<string[]>([]);
  // your existing data:
   readonly lessons = signal<Lessons[]>([
        {
          lesson: 1,
          lemmas: {
            part1: ['compose', 'dedicate', 'dialog', 'inscribe', 'narrate'],
            activeWordsBritish1: ['compose', 'dedicate', 'dialogue', 'inscribe', 'narrate'],
            activeWordsAmerican1: ['compose', 'dedicate', 'dialog', 'inscribe', 'narrate'],
            part2: ['narrative', 'recite', 'retell', 'rewrite', 'setting', 'sorrow'],
            activeWordsBritish2:[],
            activeWordsAmerican2:[],
          },
          text: {
            part1: {
              american:
                'Maria loves books. She likes to compose short poems in her notebook. She wants to dedicate her first poem to her teacher, who helps her read every day. In class, she and her friend have a dialog about their favorite stories. They talk about the writers who inscribe kind words at the front of their books.',
                
              british:
                'Maria loves books. She likes to compose short poems in her notebook. She wants to dedicate her first poem to her teacher, who helps her read every day. In class, she and her friend have a dialogue about their favourite stories. They talk about the writers who inscribe kind words at the front of their books.',
            },
            part2: {
              american:
                'The narrative begins in a quiet setting, where the children recite poems and retell old tales. Later, they rewrite the ending to make it happier, so there is less sorrow.',
              british:
                'The narrative begins in a quiet setting, where the children recite poems and retell old tales. Later, they rewrite the ending to make it happier, so there is less sorrow.',
            },
          },
        },
        // add more lessons here...
      ]);
    
      
   readonly words = signal<WordDoc[]>([
  {
    lemma: "compose",
    english: "compose",
    american: "compose",
    language: "en",
    lessons: [12, 18, 29],
    shortDescription: {
      "en-GB": ["create music or writing"],
      "en-US": ["create music or writing Am"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            senseId: "s1",
            definition: "to create music, writing, or art",
            examples: {
              "en-GB": ["She composed a hymn for the service."],
              "en-US": ["She composed a song for the school band."]
            }
          },
          {
            senseId: "s2",
            definition: "to form or make up something",
            examples: {
              "en-GB": ["The team is composed of five players."],
              "en-US": ["The team is composed of five players."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "music",
        lessons: [12],
        examples: {
          "en-GB": ["He will compose a piece for the school concert."],
          "en-US": ["He will compose a piece for the school concert."]
        }
      },
      {
        topicKey: "literature",
        lessons: [18],
        examples: {
          "en-GB": ["The author will compose a short story for the magazine."],
          "en-US": ["The author will compose a short story for the magazine."]
        }
      },
      {
        topicKey: "education",
        lessons: [29],
        examples: {
          "en-GB": ["Students must compose a paragraph about their weekend."],
          "en-US": ["Students must compose a paragraph about their weekend."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/kəmˈpəʊz/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/kəmˈpoʊz/", voice: "en-US" } }
    }
  },
  {
    lemma: "dedicate",
    english: "dedicate",
    american: "dedicate",
    language: "en",
    lessons: [13, 21],
    shortDescription: {
      "en-GB": ["devote time or effort"],
      "en-US": ["devote time or effort"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            senseId: "s1",
            definition: "to devote time or effort to a purpose",
            examples: {
              "en-GB": ["They dedicated hours to revision before exams."],
              "en-US": ["They dedicated hours to studying before exams."]
            }
          },
          {
            senseId: "s2",
            definition: "to formally address a work to someone",
            examples: {
              "en-GB": ["He dedicated the book to his parents."],
              "en-US": ["He dedicated the book to his parents."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "education",
        lessons: [13],
        examples: {
          "en-GB": [
            "You must dedicate time to practise every day.",
            "They dedicated hours to revision before exams."
          ],
          "en-US": [
            "You must dedicate time to practice every day.",
            "They dedicated hours to studying before exams."
          ]
        }
      },
      {
        topicKey: "literature",
        lessons: [21],
        examples: {
          "en-GB": ["The poet decided to dedicate the book to her mentor."],
          "en-US": ["The poet decided to dedicate the book to her mentor."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/ˈdedɪkeɪt/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/ˈdɛdəˌkeɪt/", voice: "en-US" } }
    }
  },
  {
    lemma: "dialog",
    english: "dialogue",
    american: "dialog",
    language: "en",
    lessons: [10, 24],
    shortDescription: {
      "en-GB": ["conversation between characters"],
      "en-US": ["conversation between characters"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            senseId: "s1",
            definition: "a conversation between two or more people",
            examples: {
              "en-GB": ["We analysed the dialogue in Act 2."],
              "en-US": ["We analyzed the dialog in Act 2."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "literature",
        lessons: [10],
        examples: {
          "en-GB": ["The play’s dialogue sounds natural."],
          "en-US": ["The play’s dialog sounds natural."]
        }
      },
      {
        topicKey: "education",
        lessons: [24],
        examples: {
          "en-GB": ["Practise a short dialogue with your partner."],
          "en-US": ["Practice a short dialog with your partner."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/ˈdaɪəlɒɡ/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/ˈdaɪəˌlɔɡ/", voice: "en-US" } }
    }
  },
  {
    lemma: "inscribe",
    english: "inscribe",
    american: "inscribe",
    language: "en",
    lessons: [19, 32],
    shortDescription: {
      "en-GB": ["write words on a surface"],
      "en-US": ["write words on a surface"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            senseId: "s1",
            definition: "to write or carve words on something",
            examples: {
              "en-GB": ["The stone was inscribed with the captain’s name."],
              "en-US": ["The stone was inscribed with the captain's name."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "history",
        lessons: [19],
        examples: {
          "en-GB": [
            "They inscribe dates on the monument to honour the event.",
            "The stone was inscribed with the captain’s name."
          ],
          "en-US": [
            "They inscribe dates on the monument to honor the event.",
            "The stone was inscribed with the captain's name."
          ]
        }
      },
      {
        topicKey: "literature",
        lessons: [32],
        examples: {
          "en-GB": ["She asked the author to inscribe the book to her sister."],
          "en-US": ["She asked the author to inscribe the book to her sister."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/ɪnˈskraɪb/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/ɪnˈskraɪb/", voice: "en-US" } }
    }
  },
  {
    lemma: "narrate",
    english: "narrate",
    american: "narrate",
    language: "en",
    lessons: [11, 28],
    shortDescription: {
      "en-GB": ["tell a story formally"],
      "en-US": ["tell a story formally"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            senseId: "s1",
            definition: "to tell a story or describe events",
            examples: {
              "en-GB": ["A famous actor will narrate the documentary."],
              "en-US": ["A famous actor will narrate the documentary."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "entertainment",
        lessons: [11],
        examples: {
          "en-GB": ["A famous actor will narrate the documentary."],
          "en-US": ["A famous actor will narrate the documentary."]
        }
      },
      {
        topicKey: "literature",
        lessons: [28],
        examples: {
          "en-GB": ["The writer chose to narrate the story in the first person."],
          "en-US": ["The writer chose to narrate the story in the first person."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/nəˈreɪt/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/nəˈreɪt/", voice: "en-US" } }
    }
  },
  {
    lemma: "narrative",
    english: "narrative",
    american: "narrative",
    language: "en",
    lessons: [14, 30],
    shortDescription: {
      "en-GB": ["story or account of events"],
      "en-US": ["story or account of events"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            senseId: "s1",
            definition: "a story or description of events",
            examples: {
              "en-GB": ["The novel’s narrative is clear and engaging."],
              "en-US": ["The novel’s narrative is clear and engaging."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "literature",
        lessons: [14],
        examples: {
          "en-GB": ["The novel’s narrative is clear and engaging."],
          "en-US": ["The novel’s narrative is clear and engaging."]
        }
      },
      {
        topicKey: "education",
        lessons: [30],
        examples: {
          "en-GB": ["Write a short narrative about your childhood home."],
          "en-US": ["Write a short narrative about your childhood home."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/ˈnærətɪv/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/ˈnærətɪv/", voice: "en-US" } }
    }
  },
  {
    lemma: "recite",
    english: "recite",
    american: "recite",
    language: "en",
    lessons: [9, 23],
    shortDescription: {
      "en-GB": ["say aloud from memory"],
      "en-US": ["say aloud from memory"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            senseId: "s1",
            definition: "to say a poem or text from memory",
            examples: {
              "en-GB": ["Please recite the poem to the class."],
              "en-US": ["Please recite the poem to the class."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "education",
        lessons: [9],
        examples: {
          "en-GB": ["Please recite the poem to the class."],
          "en-US": ["Please recite the poem to the class."]
        }
      },
      {
        topicKey: "entertainment",
        lessons: [23],
        examples: {
          "en-GB": ["The actor can recite long lines without mistakes."],
          "en-US": ["The actor can recite long lines without mistakes."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/rɪˈsaɪt/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/rɪˈsaɪt/", voice: "en-US" } }
    }
  },
  {
    lemma: "retell",
    english: "retell",
    american: "retell",
    language: "en",
    lessons: [16, 31],
    shortDescription: {
      "en-GB": ["tell again in new way"],
      "en-US": ["tell again in new way"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            senseId: "s1",
            definition: "to tell a story again, often in a different way",
            examples: {
              "en-GB": ["Retell the story using your own words."],
              "en-US": ["Retell the story using your own words."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "education",
        lessons: [16],
        examples: {
          "en-GB": ["Retell the story using your own words."],
          "en-US": ["Retell the story using your own words."]
        }
      },
      {
        topicKey: "literature",
        lessons: [31],
        examples: {
          "en-GB": ["The film attempts to retell a classic fairy tale."],
          "en-US": ["The film attempts to retell a classic fairy tale."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/ˌriːˈtel/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/ˌriˈtɛl/", voice: "en-US" } }
    }
  },
  {
    lemma: "rewrite",
    english: "rewrite",
    american: "rewrite",
    language: "en",
    lessons: [20, 33],
    shortDescription: {
      "en-GB": ["write again to improve"],
      "en-US": ["write again to improve"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "verb",
        definitions: [
          {
            senseId: "s1",
            definition: "to write something again to improve it or change it",
            examples: {
              "en-GB": ["Rewrite the essay with better structure."],
              "en-US": ["Rewrite the essay with better structure."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "education",
        lessons: [20],
        examples: {
          "en-GB": [
            "Please rewrite the paragraph to make it clearer.",
            "Rewrite the essay with better structure."
          ],
          "en-US": [
            "Please rewrite the paragraph to make it clearer.",
            "Rewrite the essay with better structure."
          ]
        }
      },
      {
        topicKey: "literature",
        lessons: [33],
        examples: {
          "en-GB": ["The editor asked the author to rewrite chapter two."],
          "en-US": ["The editor asked the author to rewrite chapter two."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/ˌriːˈraɪt/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/ˌriˈraɪt/", voice: "en-US" } }
    }
  },
  {
    lemma: "setting",
    english: "setting",
    american: "setting",
    language: "en",
    lessons: [8, 26],
    shortDescription: {
      "en-GB": ["place and time of story"],
      "en-US": ["place and time of story"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            senseId: "s1",
            definition: "the time and place where a story happens",
            examples: {
              "en-GB": ["The novel’s setting is a small coastal town."],
              "en-US": ["The novel’s setting is a small coastal town."]
            }
          },
          {
            senseId: "s2",
            definition: "the surroundings or environment of something",
            examples: {
              "en-GB": ["The restaurant has a relaxed setting."],
              "en-US": ["The restaurant has a relaxed setting."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "literature",
        lessons: [8],
        examples: {
          "en-GB": ["The novel’s setting is a small coastal town."],
          "en-US": ["The novel’s setting is a small coastal town."]
        }
      },
      {
        topicKey: "entertainment",
        lessons: [26],
        examples: {
          "en-GB": ["The film’s setting changes from city to desert."],
          "en-US": ["The movie’s setting changes from city to desert."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/ˈsetɪŋ/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/ˈsɛtɪŋ/", voice: "en-US" } }
    }
  },
  {
    lemma: "sorrow",
    english: "sorrow",
    american: "sorrow",
    language: "en",
    lessons: [22, 34],
    shortDescription: {
      "en-GB": ["deep sadness or regret"],
      "en-US": ["deep sadness or regret"]
    },
    levels: ["B1"],
    partsOfSpeech: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            senseId: "s1",
            definition: "a feeling of deep sadness or regret",
            examples: {
              "en-GB": ["The poem expresses deep sorrow after the loss."],
              "en-US": ["The poem expresses deep sorrow after the loss."]
            }
          }
        ]
      }
    ],
    topics: [
      {
        topicKey: "literature",
        lessons: [22],
        examples: {
          "en-GB": ["The poem expresses deep sorrow after the loss."],
          "en-US": ["The poem expresses deep sorrow after the loss."]
        }
      },
      {
        topicKey: "health-and-wellbeing",
        lessons: [34],
        examples: {
          "en-GB": ["Talking to a friend can ease sorrow."],
          "en-US": ["Talking to a friend can ease sorrow."]
        }
      }
    ],
    variants: {
      "en-GB": { phonetics: { ipa: "/ˈsɒrəʊ/", voice: "en-GB" } },
      "en-US": { phonetics: { ipa: "/ˈsɑːroʊ/", voice: "en-US" } }
    }
  }
]);




  // variety toggle: 'british' or 'american'
  variety = signal<'british' | 'american'>('british');

  onVarietyChange(ev: CustomEvent) {
    const value = (ev.detail as any)?.value as string | undefined;
    if (value === 'british' || value === 'american') {
      this.setVariety(value);
    }
  }

  setVariety(v: 'british' | 'american') {
    if (this.variety() !== v) {
      this.variety.set(v);
      this.clearDesc();
      // optional reset
    // this.quizMistakes$.next([]);
    // this.quizMistakes.set([]);
    // this.quizState.set({});
    }
  }

 

// lemma -> first short description string for the active variety
descByLemma = computed<Record<string, string>>(() => {
  const out: Record<string, string> = {};
  const locale = this.getVariantCode();

  for (const w of this.words()) {
    const list = (w.shortDescription as any)?.[locale] as string[] | undefined;
    out[w.lemma] = (Array.isArray(list) && list.length ? list[0] : '') ?? '';
  }
  return out;
});

// (optional) reverse lookup: shortDesc string -> lemma (for extra tests)
descToLemma = computed<Record<string, string>>(() => {
  const m: Record<string, string> = {};
  const map = this.descByLemma();
  for (const lemma of Object.keys(map)) {
    const d = map[lemma];
    if (d) m[d] = lemma;  // assumes descriptions are unique per variety
  }
  return m;
});

showDesc(lemma: string) {
  this.activeWord = lemma;
  this.activeShortDesc = this.descByLemma()[lemma] ?? '';
}


  // Build segments for Lesson 1 Part 1 based on current variety
  introSegmentsLesson1Part1 = computed<Segment[]>(() => {
    const lesson = this.lessons()[0];
    if (!lesson) return [];

    const variety = this.variety();
    const text = lesson.text.part1[variety] || '';

    const activeWords =
      variety === 'british'
        ? lesson.lemmas.activeWordsBritish1 || []
        : lesson.lemmas.activeWordsAmerican1 || [];

    if (!text || activeWords.length === 0) {
      return [{ type: 'text', text }];
    }

    // regex with the *visible* active words
    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = activeWords.map(escape).join('|');
    const re = new RegExp(`\\b(${pattern})\\b`, 'gi');

    const segments: Segment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(text)) !== null) {
      const word = match[1];          // actual text match, e.g. "dialogue" or "dialog"
      const start = match.index;

      // plain text before the keyword
      if (start > lastIndex) {
        segments.push({ type: 'text', text: text.slice(lastIndex, start) });
      }

      const lower = word.toLowerCase();

      // map visible word -> lemma for lookup in `words`
      let lemma = lower;
      if (lower === 'dialogue') {
        lemma = 'dialog'; // important: British visible, American lemma
      }

      segments.push({
        type: 'kw',
        lemma,
        label: word
      });

      lastIndex = start + word.length;
    }

    // trailing text
    if (lastIndex < text.length) {
      segments.push({ type: 'text', text: text.slice(lastIndex) });
    }

    return segments;
  });

  // bubble state
  activeWord: string | null = null;
  activeShortDesc = '';

  

  clearDesc() {
    this.activeWord = null;
    this.activeShortDesc = '';
  }

  // swiper init
  onSwiperInit() {
    setTimeout(() => this.swiperRef?.nativeElement?.swiper?.update(), 0);
  }
 


private getVariantCode(): 'en-GB' | 'en-US' {
  return this.variety() === 'british' ? 'en-GB' : 'en-US';
}

/** Split lemmas.part1 into:
 *  - first: first 3 lemmas (or fewer if total < 3)
 *  - rest: remaining lemmas (programmatic, for later use)
 */
lesson1Part1Groups = computed(() => {
  const lesson = this.lessons()[0];
  if (!lesson) {
    return { first: [] as string[], rest: [] as string[] };
  }

  const lemmas = lesson.lemmas.part1 || [];
  const firstCount = Math.min(3, lemmas.length);

  const first = lemmas.slice(0, firstCount);
  const rest = lemmas.slice(firstCount);

  return { first, rest };
});

/** Build ONE-WORD-PER-SLIDE for the FIRST group only (first 3 lemmas).
 *  Uses:
 *   - english/american for display
 *   - variants[locale].phonetics.ipa for IPA
 *   - definitions shared
 *   - examples only from DefinitionSense.examples[locale]
 */
lesson1Part1SlidesFirst = computed<SlideWord[]>(() => {
  const { first } = this.lesson1Part1Groups();
  if (!first.length) return [];

  const locale = this.getVariantCode();
  const docs = this.words();

  return first
    .map(lemma => {
      const doc = docs.find(w => w.lemma === lemma);
      if (!doc) return null;

      const display =
        locale === 'en-GB'
          ? (doc.english || doc.lemma)
          : (doc.american || doc.lemma);

      const ipa =
        doc.variants?.[locale]?.phonetics?.ipa
        ?? doc.variants?.['en-GB']?.phonetics?.ipa
        ?? doc.variants?.['en-US']?.phonetics?.ipa
        ?? '';

      const parts: PartOfSpeechView[] = (doc.partsOfSpeech || []).map(pos => {
        const senses: SenseView[] = (pos.definitions || []).map(def => {
          const examples = def.examples?.[locale] || [];
          return {
            senseId: def.senseId,
            definition: def.definition,
            examples: examples.slice(0, 3), // only sense examples, no topics
          };
        });

        return {
          partOfSpeech: pos.partOfSpeech,
          senses,
        };
      });

      return {
        lemma: doc.lemma,
        display,
        ipa,
        parts,
      } as SlideWord;
    })
    .filter((w): w is SlideWord => !!w);
});

/** Optional: you now ALSO have the remaining lemmas for later slides */
lesson1Part1SlidesRest = computed<SlideWord[]>(() => {
  const { rest } = this.lesson1Part1Groups();
  if (!rest.length) return [];

  const locale = this.getVariantCode();
  const docs = this.words();

  return rest
    .map(lemma => {
      const doc = docs.find(w => w.lemma === lemma);
      if (!doc) return null;

      const display =
        locale === 'en-GB'
          ? (doc.english || doc.lemma)
          : (doc.american || doc.lemma);

      const ipa =
        doc.variants?.[locale]?.phonetics?.ipa
        ?? doc.variants?.['en-GB']?.phonetics?.ipa
        ?? doc.variants?.['en-US']?.phonetics?.ipa
        ?? '';

      const parts: PartOfSpeechView[] = (doc.partsOfSpeech || []).map(pos => {
        const senses: SenseView[] = (pos.definitions || []).map(def => {
          const examples = def.examples?.[locale] || [];
          return {
            senseId: def.senseId,
            definition: def.definition,
            examples: examples.slice(0, 3),
          };
        });

        return {
          partOfSpeech: pos.partOfSpeech,
          senses,
        };
      });

      return {
        lemma: doc.lemma,
        display,
        ipa,
        parts,
      } as SlideWord;
    })
    .filter((w): w is SlideWord => !!w);
});



// Reuse your existing:
// variety = signal<'british' | 'american'>('british');
// lessons = signal<Lessons[]>(...);
// words = signal<WordDoc[]>(...);

// ---------- helpers ----------


private getDisplayWord(doc: WordDoc): string {
  return this.variety() === 'british'
    ? (doc.english || doc.lemma)
    : (doc.american || doc.lemma);
}

// ---------- 1. Split lemmas.part1 into first (3) and rest ----------




quizQuestionsFirst = computed<QuizQuestion[]>(() => {
  const { first } = this.lesson1Part1Groups();
  const docs = this.words();
  const descMap = this.descByLemma();

  const candidates = first
    .map(lemma => docs.find(w => w.lemma === lemma))
    .filter((d): d is WordDoc => !!d);

  return candidates.map((doc, idx, arr) => {
    const correct = this.getDisplayWord(doc);
    const wrongDoc = arr[(idx + 1) % arr.length];
    const wrong = this.getDisplayWord(wrongDoc);

    const id = `l1p1-first-${doc.lemma}`;
    const rawOptions: QuizOption[] = [
      { label: correct, isCorrect: true },
      { label: wrong,   isCorrect: false },
    ];

    return {
      id,
      shortDescription: descMap[doc.lemma] ?? '',
      options: this.shuffleOptions(id, rawOptions),
    };
  });
});


// ---------- 3. Track answers + mistakes ----------


onQuizAnswer(q: QuizQuestion, optIndex: number) {
  const state = this.quizState();
  if (state[q.id]) return; // lock after first answer

  const chosen = q.options[optIndex];
  const newState = {
    ...state,
    [q.id]: {
      selectedIndex: optIndex,
      isCorrect: chosen.isCorrect,
    },
  };
  this.quizState.set(newState);

  if (!chosen.isCorrect) {
    const current = this.quizMistakes$.value;
    if (!current.includes(q.shortDescription)) {
      const updated = [...current, q.shortDescription];
      this.quizMistakes$.next(updated);
      this.quizMistakes.set(updated); // keep signal in sync
    }
  }
}


// ---------- REST group quiz (NEW) ----------
quizQuestionsRest = computed<QuizQuestion[]>(() => {
  const { rest } = this.lesson1Part1Groups();
  const docs = this.words();
  const descMap = this.descByLemma();

  const candidates = rest
    .map(lemma => docs.find(w => w.lemma === lemma))
    .filter((d): d is WordDoc => !!d);

  if (!candidates.length) return [];

  const pool = docs;

  return candidates.map((doc, idx, arr) => {
    const correct = this.getDisplayWord(doc);
    const wrongDoc = arr.length > 1
      ? arr[(idx + 1) % arr.length]
      : (pool.find(d => d.lemma !== doc.lemma) || doc);
    const wrong = this.getDisplayWord(wrongDoc);

    const id = `l1p1-rest-${doc.lemma}`;
    const rawOptions: QuizOption[] = [
      { label: correct, isCorrect: true },
      { label: wrong,   isCorrect: false },
    ];

    return {
      id,
      shortDescription: descMap[doc.lemma] ?? '',
      options: this.shuffleOptions(id, rawOptions),
    };
  });
});



private shuffleOptions(id: string, options: QuizOption[]): QuizOption[] {
  if (options.length <= 1) return options;

  // Simple deterministic hash from id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }

  // If just 2 options, flip based on hash parity
  if (options.length === 2) {
    return (hash & 1) === 0
      ? options
      : [options[1], options[0]];
  }

  // For more options: hash-based Fisher-Yates
  const arr = options.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) | 0;
    const j = Math.abs(hash) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

extraQuizQuestions = computed<QuizQuestion[]>(() => {
  const mistakes = Array.from(new Set(this.quizMistakes())); // strings
  if (!mistakes.length) return [];

  const desc2lemma = this.descToLemma();
  const docs = this.words();

  const mistakeDocs = mistakes
    .map(d => desc2lemma[d])
    .filter((lem): lem is string => !!lem)
    .map(lem => docs.find(w => w.lemma === lem))
    .filter((d): d is WordDoc => !!d);

  if (!mistakeDocs.length) return [];

  return mistakeDocs.map((doc, idx) => {
    const correct = this.getDisplayWord(doc);
    const pool = docs;
    const wrongDoc = pool.find(w => w.lemma !== doc.lemma) || doc;
    const wrong = this.getDisplayWord(wrongDoc);

    const id = `l1p1-extra-${doc.lemma}-${idx}`;
    const rawOptions: QuizOption[] = [
      { label: correct, isCorrect: true },
      { label: wrong,   isCorrect: false },
    ];

    return {
      id,
      shortDescription: this.descByLemma()[doc.lemma] ?? '',
      options: this.shuffleOptions(id, rawOptions),
    };
  });
});




// ---------- total slide count helper ----------
totalSlides = computed(() => {
  const intro = 1;
  const firstWords = this.lesson1Part1SlidesFirst().length;
  const firstQuiz = this.quizQuestionsFirst().length;
  const restWords = this.lesson1Part1SlidesRest().length;
  const restQuiz = this.quizQuestionsRest().length;
  return intro + firstWords + firstQuiz + restWords + restQuiz;
});



}
