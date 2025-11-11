// word.model.ts

export class Definition {
    constructor(
      public definition: string, // The definition text
      public examples: string[] // An array of examples for the definition
    ) {}
  }
  
  export class PartOfSpeech {
    constructor(
      public partOfSpeech: string, // e.g., noun, verb, adjective, etc.
      public definitions: Definition[] // Array of definitions specific to this part of speech
    ) {}
  }
  
  export class Word {
    constructor(
      public id: number, // Unique identifier for each word
      public word: string, // The word itself
      public partsOfSpeech: PartOfSpeech[], // Array of parts of speech, each with its definitions and examples
    //  public shortDescription: string,
    //  public Level:string
    ) {}
  }

