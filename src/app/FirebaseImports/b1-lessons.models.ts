// This matches your JSON in assets/b1-lessons-by-topic.json
export interface RawLessonFromJson {
  lesson: number;
  topic: string; // present in JSON, but we won't store it for now
  lemmas: {
    part1: string[];
    part2: string[];
  };
}

// This is the Firestore doc structure you described
export interface Lessons {
  lesson: number;
   topic: string;  
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
