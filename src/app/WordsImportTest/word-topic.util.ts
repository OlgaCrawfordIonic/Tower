import { Injectable } from '@angular/core';
// word-topic.util.ts

export interface WordWithTopics {
  word: string;
  topics: string[];
}

export interface TopicGroup {
  topic: string;
  words: string[];
}


/**
 * Takes an array of { word, topics[] } and groups them by topic.
 * - If a topic doesn't exist yet, it is created.
 * - A word that belongs to multiple topics will appear in all of them.
 * - The same word is never duplicated in the same topic.
 */
@Injectable({
  providedIn: 'root'
})
export class WordTopicUtil {

 groupWordsByTopics(words: WordWithTopics[]): TopicGroup[] {
  const topicMap = new Map<string, Set<string>>();

  // Loop through all word entries
  for (const entry of words ?? []) {
    const word = entry.word?.trim();
    if (!word) {
      // Just skip invalid / empty words
      continue;
    }

    // Loop through all topics for this word
    for (const rawTopic of entry.topics ?? []) {
      const topic = rawTopic?.trim();
      if (!topic) {
        // Skip empty topic strings
        continue;
      }

      // Get or create set for this topic
      let set = topicMap.get(topic);
      if (!set) {
        set = new Set<string>();
        topicMap.set(topic, set);
      }

      // Add word (Set avoids duplicates)
      set.add(word);
    }
  }

  // Convert Map<string, Set<string>> → TopicGroup[]
  const result: TopicGroup[] = Array.from(topicMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([topic, wordSet]) => ({
      topic,
      words: Array.from(wordSet).sort((a, b) => a.localeCompare(b)),
    }));

  // IMPORTANT: always return something of type TopicGroup[]
  return result;
}
}
