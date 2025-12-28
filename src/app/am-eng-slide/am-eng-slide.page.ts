import { Component, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonicSlides
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Swiper } from 'swiper';
import { WordDoc } from '../data/lexamatewords.model';
import { BehaviorSubject } from 'rxjs';

// For each question: which option (index) was chosen & was it correct
type QuizSelection = { selectedIndex: number; isCorrect: boolean };

// ---------- Types ----------

interface Lessons {
  lesson: number;
  lemmas: {
    part1: string[];
    activeWordsBritish1: string[];
    activeWordsAmerican1: string[];
    part2: string[];
    activeWordsBritish2: string[];
    activeWordsAmerican2: string[];
  };
  text: {
    part1: { american: string; british: string };
    part2: { american: string; british: string };
  };
}

type Segment = {
  type: 'text' | 'kw';
  text?: string;   // for plain text segments
  lemma?: string;  // for keyword segments (matches words[].lemma)
  label?: string;  // what is shown in the text
};

type TextWithAudio = {
  text: string;
  audioUrl?: string | null;
};

type SenseView = {
  senseId: string;
  definition: string;                 // localised definition text
  definitionAudioUrl?: string | null; // localised definition audio (if used later)
  examples: TextWithAudio[];
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

// ---------- Quiz types ----------

type QuizOption = { label: string; isCorrect: boolean };

type QuizQuestion = {
  id: string;                // use lemma as stable id
  shortDescription: string;  // now = main definition text for active variety
  options: QuizOption[];     // [correct, wrong]
};

@Component({
  selector: 'app-am-eng-slide',
  templateUrl: './am-eng-slide.page.html',
  styleUrls: ['./am-eng-slide.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonSegment,
    IonSegmentButton,
    IonButton,
    IonLabel
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AmEngSlidePage {
  @ViewChild('swiper', { static: false }) swiperRef?: ElementRef;
  swiperModules = [IonicSlides];

  waveUrl = new URL('/assets/voyage/waves-watercolor.svg', import.meta.url).href;
  boatUrl = new URL('/assets/voyage/boat-mini.svg', import.meta.url).href;

  quizState = signal<Record<string, QuizSelection | undefined>>({});

  // BehaviorSubject to collect *descriptions* (now: definition texts) where the user made an error
  quizMistakes$ = new BehaviorSubject<string[]>([]);
  quizMistakes = signal<string[]>([]);

  // ---------------- DATA ----------------

  readonly lessons = signal<Lessons[]>([
    {
      lesson: 1,
      lemmas: {
        part1: ['compose', 'dedicate', 'dialog', 'inscribe', 'narrate'],
        activeWordsBritish1: ['compose', 'dedicate', 'dialogue', 'inscribe', 'narrate'],
        activeWordsAmerican1: ['compose', 'dedicate', 'dialog', 'inscribe', 'narrate'],
        part2: ['narrative', 'recite', 'retell', 'rewrite', 'setting', 'sorrow'],
        activeWordsBritish2: [],
        activeWordsAmerican2: [],
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

  // NOTE: WordDoc model is now updated: definition is localised, no shortDescription
  readonly words = signal<WordDoc[]>([
    {
      id: 1,
      lemma: 'compose',
      english: 'compose',
      enUrl: '',
      american: 'compose',
      amUrl: '',
      language: 'en',
      lessons: [12, 18, 29],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'to create music, writing, or art',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to create music, writing, or art',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  { text: 'She composed a hymn for the service.', audioUrl: '' }
                ],
                'en-US': [
                  { text: 'She composed a song for the school band.', audioUrl: '' }
                ]
              }
            },
            {
              senseId: 's2',
              definition: {
                'en-GB': {
                  text: 'to form or make up something',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to form or make up something',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  { text: 'The team is composed of five players.', audioUrl: '' }
                ],
                'en-US': [
                  { text: 'The team is composed of five players.', audioUrl: '' }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'music',
          lessons: [12],
          examples: {
            'en-GB': [
              {
                text: 'He will compose a piece for the school concert.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'He will compose a piece for the school concert.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'literature',
          lessons: [18],
          examples: {
            'en-GB': [
              {
                text: 'The author will compose a short story for the magazine.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The author will compose a short story for the magazine.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'education',
          lessons: [29],
          examples: {
            'en-GB': [
              {
                text: 'Students must compose a paragraph about their weekend.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'Students must compose a paragraph about their weekend.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/kəmˈpəʊz/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/kəmˈpoʊz/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 2,
      lemma: 'dedicate',
      english: 'dedicate',
      enUrl: '',
      american: 'dedicate',
      amUrl: '',
      language: 'en',
      lessons: [13, 21],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'to devote time or effort to a purpose',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to devote time or effort to a purpose',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'They dedicated hours to revision before exams.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'They dedicated hours to studying before exams.',
                    audioUrl: ''
                  }
                ]
              }
            },
            {
              senseId: 's2',
              definition: {
                'en-GB': {
                  text: 'to formally address a work to someone',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to formally address a work to someone',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  { text: 'He dedicated the book to his parents.', audioUrl: '' }
                ],
                'en-US': [
                  { text: 'He dedicated the book to his parents.', audioUrl: '' }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'education',
          lessons: [13],
          examples: {
            'en-GB': [
              {
                text: 'You must dedicate time to practise every day.',
                audioUrl: ''
              },
              {
                text: 'They dedicated hours to revision before exams.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'You must dedicate time to practice every day.',
                audioUrl: ''
              },
              {
                text: 'They dedicated hours to studying before exams.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'literature',
          lessons: [21],
          examples: {
            'en-GB': [
              {
                text: 'The poet decided to dedicate the book to her mentor.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The poet decided to dedicate the book to her mentor.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/ˈdedɪkeɪt/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/ˈdɛdəˌkeɪt/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 3,
      lemma: 'dialog',
      english: 'dialogue',
      enUrl: '',
      american: 'dialog',
      amUrl: '',
      language: 'en',
      lessons: [10, 24],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'a conversation between two or more people',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'a conversation between two or more people',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  { text: 'We analysed the dialogue in Act 2.', audioUrl: '' }
                ],
                'en-US': [
                  { text: 'We analyzed the dialog in Act 2.', audioUrl: '' }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'literature',
          lessons: [10],
          examples: {
            'en-GB': [
              { text: 'The play’s dialogue sounds natural.', audioUrl: '' }
            ],
            'en-US': [
              { text: 'The play’s dialog sounds natural.', audioUrl: '' }
            ]
          }
        },
        {
          topicKey: 'education',
          lessons: [24],
          examples: {
            'en-GB': [
              {
                text: 'Practise a short dialogue with your partner.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'Practice a short dialog with your partner.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/ˈdaɪəlɒɡ/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/ˈdaɪəˌlɔɡ/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 4,
      lemma: 'inscribe',
      english: 'inscribe',
      enUrl: '',
      american: 'inscribe',
      amUrl: '',
      language: 'en',
      lessons: [19, 32],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'to write or carve words on something',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to write or carve words on something',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'The stone was inscribed with the captain’s name.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: "The stone was inscribed with the captain's name.",
                    audioUrl: ''
                  }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'history',
          lessons: [19],
          examples: {
            'en-GB': [
              {
                text: 'They inscribe dates on the monument to honour the event.',
                audioUrl: ''
              },
              {
                text: 'The stone was inscribed with the captain’s name.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'They inscribe dates on the monument to honor the event.',
                audioUrl: ''
              },
              {
                text: "The stone was inscribed with the captain's name.",
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'literature',
          lessons: [32],
          examples: {
            'en-GB': [
              {
                text: 'She asked the author to inscribe the book to her sister.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'She asked the author to inscribe the book to her sister.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/ɪnˈskraɪb/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/ɪnˈskraɪb/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 5,
      lemma: 'narrate',
      english: 'narrate',
      enUrl: '',
      american: 'narrate',
      amUrl: '',
      language: 'en',
      lessons: [11, 28],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'to tell a story or describe events',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to tell a story or describe events',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'A famous actor will narrate the documentary.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'A famous actor will narrate the documentary.',
                    audioUrl: ''
                  }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'entertainment',
          lessons: [11],
          examples: {
            'en-GB': [
              {
                text: 'A famous actor will narrate the documentary.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'A famous actor will narrate the documentary.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'literature',
          lessons: [28],
          examples: {
            'en-GB': [
              {
                text: 'The writer chose to narrate the story in the first person.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The writer chose to narrate the story in the first person.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/nəˈreɪt/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/nəˈreɪt/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 6,
      lemma: 'narrative',
      english: 'narrative',
      enUrl: '',
      american: 'narrative',
      amUrl: '',
      language: 'en',
      lessons: [14, 30],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'a story or description of events',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'a story or description of events',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'The novel’s narrative is clear and engaging.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'The novel’s narrative is clear and engaging.',
                    audioUrl: ''
                  }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'literature',
          lessons: [14],
          examples: {
            'en-GB': [
              {
                text: 'The novel’s narrative is clear and engaging.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The novel’s narrative is clear and engaging.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'education',
          lessons: [30],
          examples: {
            'en-GB': [
              {
                text: 'Write a short narrative about your childhood home.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'Write a short narrative about your childhood home.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/ˈnærətɪv/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/ˈnærətɪv/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 7,
      lemma: 'recite',
      english: 'recite',
      enUrl: '',
      american: 'recite',
      amUrl: '',
      language: 'en',
      lessons: [9, 23],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'to say a poem or text from memory',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to say a poem or text from memory',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'Please recite the poem to the class.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'Please recite the poem to the class.',
                    audioUrl: ''
                  }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'education',
          lessons: [9],
          examples: {
            'en-GB': [
              {
                text: 'Please recite the poem to the class.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'Please recite the poem to the class.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'entertainment',
          lessons: [23],
          examples: {
            'en-GB': [
              {
                text: 'The actor can recite long lines without mistakes.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The actor can recite long lines without mistakes.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/rɪˈsaɪt/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/rɪˈsaɪt/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 8,
      lemma: 'retell',
      english: 'retell',
      enUrl: '',
      american: 'retell',
      amUrl: '',
      language: 'en',
      lessons: [16, 31],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'to tell a story again, often in a different way',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to tell a story again, often in a different way',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'Retell the story using your own words.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'Retell the story using your own words.',
                    audioUrl: ''
                  }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'education',
          lessons: [16],
          examples: {
            'en-GB': [
              {
                text: 'Retell the story using your own words.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'Retell the story using your own words.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'literature',
          lessons: [31],
          examples: {
            'en-GB': [
              {
                text: 'The film attempts to retell a classic fairy tale.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The film attempts to retell a classic fairy tale.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/ˌriːˈtel/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/ˌriˈtɛl/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 9,
      lemma: 'rewrite',
      english: 'rewrite',
      enUrl: '',
      american: 'rewrite',
      amUrl: '',
      language: 'en',
      lessons: [20, 33],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'to write something again to improve it or change it',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'to write something again to improve it or change it',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'Rewrite the essay with better structure.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'Rewrite the essay with better structure.',
                    audioUrl: ''
                  }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'education',
          lessons: [20],
          examples: {
            'en-GB': [
              {
                text: 'Please rewrite the paragraph to make it clearer.',
                audioUrl: ''
              },
              {
                text: 'Rewrite the essay with better structure.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'Please rewrite the paragraph to make it clearer.',
                audioUrl: ''
              },
              {
                text: 'Rewrite the essay with better structure.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'literature',
          lessons: [33],
          examples: {
            'en-GB': [
              {
                text: 'The editor asked the author to rewrite chapter two.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The editor asked the author to rewrite chapter two.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/ˌriːˈraɪt/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/ˌriˈraɪt/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 10,
      lemma: 'setting',
      english: 'setting',
      enUrl: '',
      american: 'setting',
      amUrl: '',
      language: 'en',
      lessons: [8, 26],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'the time and place where a story happens',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'the time and place where a story happens',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'The novel’s setting is a small coastal town.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'The novel’s setting is a small coastal town.',
                    audioUrl: ''
                  }
                ]
              }
            },
            {
              senseId: 's2',
              definition: {
                'en-GB': {
                  text: 'the surroundings or environment of something',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'the surroundings or environment of something',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'The restaurant has a relaxed setting.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'The restaurant has a relaxed setting.',
                    audioUrl: ''
                  }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'literature',
          lessons: [8],
          examples: {
            'en-GB': [
              {
                text: 'The novel’s setting is a small coastal town.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The novel’s setting is a small coastal town.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'entertainment',
          lessons: [26],
          examples: {
            'en-GB': [
              {
                text: 'The film’s setting changes from city to desert.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The movie’s setting changes from city to desert.',
                audioUrl: ''
              }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/ˈsetɪŋ/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/ˈsɛtɪŋ/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    {
      id: 11,
      lemma: 'sorrow',
      english: 'sorrow',
      enUrl: '',
      american: 'sorrow',
      amUrl: '',
      language: 'en',
      lessons: [22, 34],
      levels: ['B1'],
      partsOfSpeech: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              senseId: 's1',
              definition: {
                'en-GB': {
                  text: 'a feeling of deep sadness or regret',
                  audioUrl: ''
                },
                'en-US': {
                  text: 'a feeling of deep sadness or regret',
                  audioUrl: ''
                }
              },
              examples: {
                'en-GB': [
                  {
                    text: 'The poem expresses deep sorrow after the loss.',
                    audioUrl: ''
                  }
                ],
                'en-US': [
                  {
                    text: 'The poem expresses deep sorrow after the loss.',
                    audioUrl: ''
                  }
                ]
              }
            }
          ]
        }
      ],
      topics: [
        {
          topicKey: 'literature',
          lessons: [22],
          examples: {
            'en-GB': [
              {
                text: 'The poem expresses deep sorrow after the loss.',
                audioUrl: ''
              }
            ],
            'en-US': [
              {
                text: 'The poem expresses deep sorrow after the loss.',
                audioUrl: ''
              }
            ]
          }
        },
        {
          topicKey: 'health-and-wellbeing',
          lessons: [34],
          examples: {
            'en-GB': [
              { text: 'Talking to a friend can ease sorrow.', audioUrl: '' }
            ],
            'en-US': [
              { text: 'Talking to a friend can ease sorrow.', audioUrl: '' }
            ]
          }
        }
      ],
      variants: {
        'en-GB': {
          phonetics: {
            ipa: '/ˈsɒrəʊ/',
            audioUrl: '',
            voice: 'en-GB'
          }
        },
        'en-US': {
          phonetics: {
            ipa: '/ˈsɑːroʊ/',
            audioUrl: '',
            voice: 'en-US'
          }
        }
      }
    },
    
   


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
      // Optional: reset quiz state if you want
      // this.quizMistakes$.next([]);
      // this.quizMistakes.set([]);
      // this.quizState.set({});
    }
  }

  // ---------- “short description” now = first definition text per lemma & variety ----------

  descByLemma = computed<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    const locale = this.getVariantCode();

    for (const w of this.words()) {
      const pos0 = w.partsOfSpeech?.[0];
      const def0 = pos0?.definitions?.[0];
      const defText = def0?.definition?.[locale]?.text ?? '';
      out[w.lemma] = defText;
    }

    return out;
  });

  // reverse lookup: definition text -> lemma (for extra tests)
  descToLemma = computed<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    const map = this.descByLemma();
    for (const lemma of Object.keys(map)) {
      const d = map[lemma];
      if (d) m[d] = lemma;  // assumes definitions are unique per variety (good enough)
    }
    return m;
  });

  activeWord: string | null = null;
  activeShortDesc = '';

  showDesc(lemma: string) {
    this.activeWord = lemma;
    this.activeShortDesc = this.descByLemma()[lemma] ?? '';
  }

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

  private getDisplayWord(doc: WordDoc): string {
    return this.variety() === 'british'
      ? (doc.english || doc.lemma)
      : (doc.american || doc.lemma);
  }

  // ---------- Split lemmas.part1 into first 3 + rest ----------

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

  // ---------- Intro text segments (with clickable keywords) ----------

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
        lemma = 'dialog'; // British visible, American lemma
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

  // ---------- Slides: FIRST group (first 3 lemmas) ----------

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
            const defLoc = def.definition?.[locale];
            const defText = defLoc?.text ?? '';
            const defAudioUrl = defLoc?.audioUrl ?? null;
            const examples = def.examples?.[locale] || [];
            return {
              senseId: def.senseId,
              definition: defText,
              definitionAudioUrl: defAudioUrl,
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

  // ---------- Slides: REST group ----------

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
            const defLoc = def.definition?.[locale];
            const defText = defLoc?.text ?? '';
            const defAudioUrl = defLoc?.audioUrl ?? null;
            const examples = def.examples?.[locale] || [];
            return {
              senseId: def.senseId,
              definition: defText,
              definitionAudioUrl: defAudioUrl,
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

  // ---------- QUIZ: First group ----------

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

  // ---------- QUIZ: answer handling ----------

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

  // ---------- QUIZ: Rest group ----------

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

  // ---------- Extra quiz (mistakes) ----------

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
