export type Variety = "american" | "british";
export type PartKey = "part1" | "part2";

// Optional but recommended: restrict POS to valid values
export type Pos = string;

export interface FindtheWord {
  surface: string;
  lemma: string;
  pos: Pos;       // or keep string if you prefer
  senseId: string;
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
