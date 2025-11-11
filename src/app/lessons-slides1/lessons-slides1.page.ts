import { Component, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonicSlides, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/angular/standalone';
import { Swiper } from 'swiper';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { WordDoc, CEFR, Locale } from  '../data/lexamatewords.model';
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
}
type Segment = {
  type: 'text' | 'kw';
  text?: string;
  lemma?: string; // maps to words[].lemma, e.g. "dialog"
  label?: string; // what is shown in the text, e.g. "dialogue"
};

@Component({
  selector: 'app-lessons-slides1',
  standalone: true,
  imports: [CommonModule, IonContent, IonSegment, IonSegmentButton, IonLabel],
  templateUrl: './lessons-slides1.page.html',
  styleUrls: ['./lessons-slides1.page.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LessonsSlides1Page {
  @ViewChild('swiper', { static: false }) swiperRef?: ElementRef;
  swiperModules = [IonicSlides];
  slides?: Swiper;
  
  // Bubble state --------------------------------------------
  activeWord: string | null = null;
activeShortDesc = '';


  // assets
  waveUrl = new URL('/assets/voyage/waves-watercolor.svg', import.meta.url).href;
  boatUrl = new URL('/assets/voyage/boat-mini.svg', import.meta.url).href;

  // your existing data (already defined in your file):
  // readonly lessons = signal<Lessons[]>([ ... ]);
  // readonly words   = signal<WordDoc[]>([ ... ]);
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
    shortDescription: "create music or writing",
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
    shortDescription: "devote time or effort",
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
    english: "dialogue", // UK display
    american: "dialog",  // US display
    language: "en",
    lessons: [10, 24],
    shortDescription: "conversation between characters",
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
    shortDescription: "write words on a surface",
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
    shortDescription: "tell a story formally",
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
    shortDescription: "story or account of events",
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
    shortDescription: "say aloud from memory",
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
    shortDescription: "tell again in new way",
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
    shortDescription: "write again to improve",
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
    shortDescription: "place and time of story",
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
    shortDescription: "deep sadness or regret",
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


 

introSegmentsBritishPart1 = computed<Segment[]>(() => {
  const lesson = this.lessons()[0];
  const text = lesson.text.part1.british || '';
  const activeWords = lesson.lemmas.activeWordsBritish1 || [];

  if (!text || activeWords.length === 0) {
    return [{ type: 'text', text }];
  }

  // Build regex from visible active words
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = activeWords.map(escape).join('|');
  const re = new RegExp(`\\b(${pattern})\\b`, 'gi');

  const segs: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const word = match[1];         // matched visible word (e.g. "compose" / "dialogue")
    const start = match.index;

    // text before the keyword
    if (start > lastIndex) {
      segs.push({ type: 'text', text: text.slice(lastIndex, start) });
    }

    // map visible word to lemma used in words[]
    const lower = word.toLowerCase();
    const lemma =
      lower === 'dialogue'
        ? 'dialog'
        : lower; // others match directly

    segs.push({
      type: 'kw',
      lemma,
      label: word
    });

    lastIndex = start + word.length;
  }

  // trailing text
  if (lastIndex < text.length) {
    segs.push({ type: 'text', text: text.slice(lastIndex) });
  }

  return segs;
});


// from your words[] array (lemma -> shortDescription)
descByLemma = computed<Record<string, string>>(() => {
  const out: Record<string, string> = {};
  this.words().forEach(w => {
    if (w.lemma && w.shortDescription) {
      out[w.lemma] = w.shortDescription;
    }
  });
  return out;
});

showDesc(lemma: string) {
  const desc = this.descByLemma()[lemma] ?? '';
  this.activeWord = lemma;
  this.activeShortDesc = desc;
}

clearDesc() {
  this.activeWord = null;
  this.activeShortDesc = '';
}


  // Swiper lifecycle ----------------------------------------
  onSwiperInit() {
    setTimeout(() => this.swiperRef?.nativeElement?.swiper?.update(), 0);
  }
}
