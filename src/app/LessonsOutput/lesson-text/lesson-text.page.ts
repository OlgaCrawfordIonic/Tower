import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordDoc } from '../../data/lexamatewords.model';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular/standalone';

// ------------------ Types ------------------

type Variety = 'british' | 'american';
type PartKey = 'part1' | 'part2';
type Locale = 'en-GB' | 'en-US';

export type Pos = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';

export interface FindtheWord {
  surface: string; // exact form in text: "dialogue", "composed", "apartment"
  lemma: string;   // WordDoc lemma: "dialog", "compose", "flat"
  pos: Pos;
  senseId: string; // "s1", "s2", ...
}


export interface TextWithAudio {
  text: string;
  audioUrl?: string | null;
}
export interface LessonTextPart {
  textWithAudio: TextWithAudio;                 // the paragraph
  activeWords: FindtheWord[];   // clickable refs used inside this paragraph
}
export interface Lesson {
  lesson: number;
  lemmas: {
    part1: string[];
    part2: string[];
  };
  text: {
    part1: Record<Variety, LessonTextPart>;
    part2: Record<Variety, LessonTextPart>;
  };
}

type Segment =
  | { type: 'text'; text: string }
  | { type: 'kw'; label: string; ref: FindtheWord };

@Component({
  selector: 'app-lesson-text',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ],
  templateUrl: './lesson-text.page.html',
  styleUrls: ['./lesson-text.page.scss'],
})
export class LessonTextPage {

  // ---------- State ----------
  readonly variety = signal<Variety>('british');
  readonly part = signal<PartKey>('part1');

  // bubble output for your intro slide
  activeWord: string | null = null;
  activeShortDesc = '';
  activeKey = '';

  // ---------- Data ----------
  readonly lessons = signal<Lesson[]>([
    {
      lesson: 1,
      lemmas: {
        part1: ['compose', 'dedicate', 'dialog', 'inscribe', 'narrate'],
        part2: ['narrative', 'recite', 'retell', 'rewrite', 'setting', 'sorrow'],
      },
      text: {
        part1: {
          american: {
           textWithAudio:{
             text: 'Maria loves stories. Yesterday she composed a short poem and dedicated it to her teacher. In class she had a dialog with a friend about their favorite books in a flat. Later they inscribed kind messages inside their notebooks, and Maria narrated the plot of a new tale.',  audioUrl:''},
            activeWords: [
              { surface: 'composed', lemma: 'compose', pos: 'verb', senseId: 's1' },
              { surface: 'dedicated', lemma: 'dedicate', pos: 'verb', senseId: 's2' },
              { surface: 'dialog', lemma: 'dialog', pos: 'noun', senseId: 's1' },
              { surface: 'inscribed', lemma: 'inscribe', pos: 'verb', senseId: 's1' },
              { surface: 'narrated', lemma: 'narrate', pos: 'verb', senseId: 's1' },
              { surface: 'apartment', lemma: 'flat', pos: 'noun', senseId: 's1' }

            ],
          },
          british: {
           textWithAudio:{ text:
              'Maria loves stories. Yesterday she composed a short poem and dedicated it to her teacher. In class she had a dialogue with a friend about their favourite books in a flat. Later they inscribed kind messages inside their notebooks, and Maria narrated the plot of a new tale.',  audioUrl:''},
            activeWords: [
              { surface: 'composed', lemma: 'compose', pos: 'verb', senseId: 's1' },
              { surface: 'dedicated', lemma: 'dedicate', pos: 'verb', senseId: 's2' },
              { surface: 'dialogue', lemma: 'dialog', pos: 'noun', senseId: 's1' },
              { surface: 'inscribed', lemma: 'inscribe', pos: 'verb', senseId: 's1' },
              { surface: 'narrated', lemma: 'narrate', pos: 'verb', senseId: 's1' },
              { surface: 'flat', lemma: 'flat', pos: 'noun', senseId: 's1' }

            ],
          },
        },
        part2: {
          american: {
          textWithAudio:{text:
              'The narrative begins in a quiet setting, where the children recite poems and retell old tales. Later, they rewrite the ending to make it happier in an apartment, so there is less sorrow.',  audioUrl:''},
            activeWords: [
              { surface: 'narrative', lemma: 'narrative', pos: 'noun', senseId: 's1' },
              { surface: 'setting', lemma: 'setting', pos: 'noun', senseId: 's1' },
              { surface: 'recite', lemma: 'recite', pos: 'verb', senseId: 's1' },
              { surface: 'retell', lemma: 'retell', pos: 'verb', senseId: 's1' },
              { surface: 'rewrite', lemma: 'rewrite', pos: 'verb', senseId: 's1' },
              { surface: 'sorrow', lemma: 'sorrow', pos: 'noun', senseId: 's1' },
              
                { surface: 'apartment', lemma: 'flat', pos: 'noun', senseId: 's1' }

            ],
          },
          british: {
           textWithAudio:{text:
              'The narrative begins in a quiet setting, where the children recite poems and retell old tales. Later, they rewrite the ending to make it happier, so there is less sorrow.',audioUrl:''},
            activeWords: [
              { surface: 'narrative', lemma: 'narrative', pos: 'noun', senseId: 's1' },
              { surface: 'setting', lemma: 'setting', pos: 'noun', senseId: 's1' },
              { surface: 'recite', lemma: 'recite', pos: 'verb', senseId: 's1' },
              { surface: 'retell', lemma: 'retell', pos: 'verb', senseId: 's1' },
              { surface: 'rewrite', lemma: 'rewrite', pos: 'verb', senseId: 's1' },
              { surface: 'sorrow', lemma: 'sorrow', pos: 'noun', senseId: 's1' },
              { surface: 'flat', lemma: 'flat', pos: 'noun', senseId: 's1' }

            ],
          },
        },
      },
    },
  ]);

  // Replace with your real words array (I kept your example list shortened here)
  // IMPORTANT: ensure IDs are unique in your real data
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
    {
  id: 6,
  lemma: "flat",
  language: "en",
  english: "flat",
  enUrl: "",
  american: "",
  amUrl: "",
  lessons: [1, 210],
  levels: ["B1"],
  partsOfSpeech: [
    {
      partOfSpeech: "noun",
      definitions: [
        {
          senseId: "s1",
         
          definition: {
            "en-GB": {
              text: "A home with rooms on one floor.",
              audioUrl: "",
            },
            "en-US": {
              text: "A home with rooms on one floor.",
              audioUrl: "",
               headwords: {
           
            "en-US": {
              headword: "apartment",
              ipa: "/əˈpɑːrtmənt/",
              audioUrl: "en-US/B1/f/flat/senses/noun/s1/headword.mp3",
               partOfSpeech: "noun",
                senseid: "s1",
            },
          },
            },
          },
          examples: {
            "en-GB": [
              {
                text: "I rent a small flat near the station, and I walk to work every morning.",
                audioUrl: "",
                partOfSpeech: "noun",
                senseId: "s1",
              },
            ],
            "en-US": [
              {
                text: "I rent a small apartment near the station, and I walk to work every morning.",
                audioUrl: "",
                partOfSpeech: "noun",
                senseId: "s1",
              },
            ],
          },
        },
      ],
    },
    {
      partOfSpeech: "adjective",
      definitions: [
        {
          senseId: "s1",
          definition: {
            "en-GB": {
              text: "Level and smooth, with no bumps.",
              audioUrl: "",
            },
            "en-US": {
              text: "Level and smooth, with no bumps.",
              audioUrl: "",
            },
          },
          examples: {
            "en-GB": [
              {
                text: "The field is flat, so the children can run and play football there after school.",
                audioUrl: "",
                partOfSpeech: "adjective",
                senseId: "s1",
              },
            ],
            "en-US": [
              {
                text: "The field is flat, so the children can run and play football there after school.",
                audioUrl: "",
                partOfSpeech: "adjective",
                senseId: "s1",
              },
            ],
          },
        },
      ],
    },
  ],
  topics: [
    {
      topicKey: "Adjectives",
      lessons: [1, 210],
      examples: {
        "en-GB": [
          {
            text: "The table is flat, and my book stays very still on it all day.",
            audioUrl: "",
            partOfSpeech: "adjective",
            senseId: "s1",
          },
        ],
        "en-US": [],
      },
    },
    {
      topicKey: "House",
      lessons: [1, 210],
      examples: {
        "en-GB": [
          {
            text: "Her flat has two rooms and a small kitchen, and it is warm in winter.",
            audioUrl: "",
            partOfSpeech: "noun",
            senseId: "s1",
          },
        ],
        "en-US": [
          {
            text: "Her apartment has two rooms and a small kitchen, and it is warm in winter.",
            audioUrl: "",
            partOfSpeech: "noun",
            senseId: "s1",
          },
        ],
      },
    },
  ],
  variants: {
    "en-GB": {
      phonetics: {
        ipa: "/flæt/",
        audioUrl: "",
        voice: "en-GB",
      },
    },
    "en-US": {
      phonetics: {
        ipa: "/flæt/",
        audioUrl: "",
        voice: "en-US",
      },
    },
  },
}

]);
  // ---------- Computeds ----------
  readonly locale = computed<Locale>(() => (this.variety() === 'british' ? 'en-GB' : 'en-US'));
  readonly currentLesson = computed(() => this.lessons()[0] ?? null);

  readonly currentTextPart = computed<LessonTextPart>(() => {
    const lesson = this.currentLesson();
    if (!lesson) {
      return { textWithAudio: { text: '', audioUrl: null }, activeWords: [] };
    }
    return lesson.text[this.part()][this.variety()];
  });

  // This is what your intro slide uses
  readonly introSegmentsLesson1Part1 = computed<Segment[]>(() => {
    const part = this.currentTextPart();
    return this.buildSegments(part.textWithAudio.text, part.activeWords);
  });

  // ---------- UI ----------
  setVariety(v: any) {
    if (v === 'british' || v === 'american') {
      this.variety.set(v);
      this.clearDesc();
    }
  }

  setPart(p: any) {
    if (p === 'part1' || p === 'part2') {
      this.part.set(p);
      this.clearDesc();
    }
  }

  clearDesc() {
    this.activeWord = null;
    this.activeShortDesc = '';
    this.activeKey = '';
  }

  keyOf(ref: FindtheWord) {
    return `${ref.lemma}|${ref.pos}|${ref.senseId}`;
  }

  onKeywordClick(seg: Extract<Segment, { type: 'kw' }>) {
    const locale = this.locale();

    const display = this.resolveDisplay(seg.ref, locale) ?? seg.label;
    const def = this.resolveShortDefinition(seg.ref, locale);

    this.activeWord = display;
    this.activeShortDesc = def || '(No definition found)';
    this.activeKey = this.keyOf(seg.ref);
  }

  // ---------- Segment builder ----------
  private buildSegments(text: string, activeWords: FindtheWord[]): Segment[] {
    if (!text) return [];
    if (!activeWords?.length) return [{ type: 'text', text }];

    const surfaceMap = new Map<string, FindtheWord>();
    for (const w of activeWords) {
      const key = w.surface.toLowerCase();
      if (!surfaceMap.has(key)) surfaceMap.set(key, w);
    }

    const surfaces = [...surfaceMap.values()]
      .map(w => w.surface)
      .sort((a, b) => b.length - a.length);

    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = surfaces.map(escape).join('|');
    const re = new RegExp(`\\b(${pattern})\\b`, 'gi');

    const out: Segment[] = [];
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = re.exec(text)) !== null) {
      const label = m[1];
      const start = m.index;

      if (start > last) out.push({ type: 'text', text: text.slice(last, start) });

      const ref = surfaceMap.get(label.toLowerCase());
      if (ref) out.push({ type: 'kw', label, ref });
      else out.push({ type: 'text', text: label });

      last = start + label.length;
    }

    if (last < text.length) out.push({ type: 'text', text: text.slice(last) });

    return out;
  }

  // ---------- WordDoc lookup: lemma + pos + senseId ----------
  private resolveShortDefinition(ref: FindtheWord, locale: Locale): string {
    const doc = this.words().find(w => w.lemma === ref.lemma);
    if (!doc) return '';

    const posBlock = doc.partsOfSpeech?.find(p => p.partOfSpeech === ref.pos);
    if (!posBlock) return '';

    const sense = posBlock.definitions?.find(d => d.senseId === ref.senseId);
    if (!sense) return '';

    const defLoc =
      sense.definition?.[locale]
      ?? (locale === 'en-US' ? sense.definition?.['en-GB'] : sense.definition?.['en-US']);

    return defLoc?.text ?? '';
  }

  // Display headword override if present, else WordDoc english/american
  private resolveDisplay(ref: FindtheWord, locale: Locale): string | null {
    const doc = this.words().find(w => w.lemma === ref.lemma);
    if (!doc) return null;

    const posBlock = doc.partsOfSpeech?.find(p => p.partOfSpeech === ref.pos);
    const sense = posBlock?.definitions?.find(d => d.senseId === ref.senseId);

    const defLoc =
      sense?.definition?.[locale]
      ?? (locale === 'en-US' ? sense?.definition?.['en-GB'] : sense?.definition?.['en-US']);

    const headword =
      (defLoc as any)?.headwords?.[locale]?.headword
      ?? (locale === 'en-US'
        ? (defLoc as any)?.headwords?.['en-GB']?.headword
        : (defLoc as any)?.headwords?.['en-US']?.headword)
      ?? null;

    if (headword) return headword;

    return locale === 'en-GB'
      ? (doc.english || doc.lemma)
      : (doc.american || doc.lemma);
  }

  // trackBy
  trackSeg = (_: number, s: Segment) =>
    s.type === 'text'
      ? `t:${s.text}`
      : `k:${s.ref.lemma}:${s.ref.pos}:${s.ref.senseId}:${s.label}`;
}