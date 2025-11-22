//Loading your JSON in Ionic/Angular and using the function
// word-topic.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { WordWithTopics, TopicGroup} from './word-topic.util';
import { WordTopicUtil} from './word-topic.util';
@Injectable({
  providedIn: 'root'
})
export class WordTopicService {
  private readonly jsonPath = 'assets/B1wordswithtopics.json';

  constructor(private http: HttpClient, private  WordTopicUtil:  WordTopicUtil) {}

  getGroupedTopics(): Observable<TopicGroup[]> {
    return this.http.get<WordWithTopics[]>(this.jsonPath).pipe(
      map((words) => this.WordTopicUtil.groupWordsByTopics(words))
    );
  }
}
