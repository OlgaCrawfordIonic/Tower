export interface TopicGroup {
  topic: string;
  words: string[];
}

export interface Lesson {
  lesson: number;
  topic: string;
  lemmas: {
    part1: string[];
    part2: string[];
  };
}

// internal helper type – used only inside the service
export type LessonWithoutNumber = Omit<Lesson, 'lesson'>;
