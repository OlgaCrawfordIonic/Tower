import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'words',
    loadComponent: () => import('./words/words.page').then( m => m.WordsPage)
  },
  {
    path: 'speech',
    loadComponent: () => import('./speech/speech.page').then( m => m.SpeechPage)
  },
  {
    path: 'webspeech',
    loadComponent: () => import('./webspeech/webspeech.page').then( m => m.WebspeechPage)
  },
  {
    path: 'google-ai',
    loadComponent: () => import('./google-ai/google-ai.page').then( m => m.GoogleAIPage)
  },
  {
    path: 'idioms',
    loadComponent: () => import('./idioms/idioms/idioms.page').then( m => m.IdiomsPage)
  },
  {
    path: 'leximatewords',
    loadComponent: () => import('./data/leximatewords/leximatewords.page').then( m => m.LeximatewordsPage)
  },
  {
    path: 'unit-voyage',
    loadComponent: () => import('./unit-voyage/unit-voyage.page').then( m => m.UnitVoyagePage)
  },
  {
    path: 'unit-voyage1',
    loadComponent: () => import('./unit-voyage1/unit-voyage1.page').then( m => m.UnitVoyage1Page)
  },
 /* {
    path: 'lessons-slides',
    loadComponent: () => import('./lessons-slides/lessons-slides.page').then( m => m.LessonsSlidesPage)
  },
  {
    path: 'kessons-slides1',
    loadComponent: () => import('./kessons-slides1/kessons-slides1.page').then( m => m.KessonsSlides1Page)
  },
  {
    path: 'lessons-slides1',
    loadComponent: () => import('./lessons-slides1/lessons-slides1.page').then( m => m.LessonsSlides1Page)
  },*/
  {
    path: 'am-eng-slide',
    loadComponent: () => import('./am-eng-slide/am-eng-slide.page').then( m => m.AmEngSlidePage)
  },
  
{
    path: 'topics',
    loadComponent: () => import('./WordsImportTest/topics/topics.page').then( m => m.TopicsPage)
  },
  {
    path: 'lessons',
    loadComponent: () => import('./LessonMaker/lessons/lessons.page').then( m => m.LessonsPage)
  },
  {
    path: 'lessonsimports',
    loadComponent: () => import('./FirebaseImports/lessonsimports/lessonsimports.page').then( m => m.LessonsimportsPage)
  },
 
  {
    path: 'wordsimport',
    loadComponent: () => import('./FirebaseImports/wordsimport/wordsimport.page').then( m => m.WordsimportPage)
  },
  
  {
    path: 'importfirebase',
    loadComponent: () => import('./importlemmas/importfirebase/importfirebase.page').then( m => m.ImportFirebasePage)
  },
  {
    path: 'reviewwords',
    loadComponent: () => import('./Firebaseedit/reviewwords/reviewwords.page').then( m => m.ReviewwordsPage)
  },
  {
    path: 'editword',
    loadComponent: () => import('./Firebaseedit/editword/editword.page').then( m => m.EditwordPage)
  },
  
{
  path: 'editword/:lemma',
  loadComponent: () =>
    import('./Firebaseedit/editword/editword.page')
      .then(m => m.EditwordPage)
},
  {
    path: 'maintenance',
    loadComponent: () => import('./maintenance/maintenance.page').then( m => m.MaintenancePage)
  },
  {
    path: 'importfirebaseold',
    loadComponent: () => import('./importlemmas/importfirebaseold/importfirebaseold.page').then( m => m.ImportfirebaseoldPage)
  },
  {
    path: 'lemma-detail',
    loadComponent: () => import('./contentoutput/lemma-detail/lemma-detail.page').then( m => m.LemmaDetailPage)
  },
  {
    path: 'lemma-detail/:lemma',
    loadComponent: () => import('./contentoutput/lemma-detail/lemma-detail.page').then( m => m.LemmaDetailPage)
  },
  
  {
    path: 'lemma-output',
    loadComponent: () => import('./contentoutput/lemma-output/lemma-output.page').then( m => m.LemmaOutputPage)
  },
 
 {
    path: 'lesson-text',
    loadComponent: () => import('./LessonsOutput/lesson-text/lesson-text.page').then( m => m.LessonTextPage)
  },
  {
    path: 'importlessonsfirebase',
    loadComponent: () => import('./LessonsOutput/importlessonsfirebase/importlessonsfirebase.page').then( m => m.ImportLessonsFirebasePage)
  },
  {
    path: 'lesson-firebase-output',
    loadComponent: () => import('./LessonsOutput/lesson-firebase-output/lesson-firebase-output.page').then( m => m.LessonFirebaseOutputPage)
  },
  {
    path: 'lesson-firebase-output/:lesson',
    loadComponent: () => import('./LessonsOutput/lesson-firebase-output/lesson-firebase-output.page').then( m => m.LessonFirebaseOutputPage)
  },
  {
    path: 'lessons-kv-output',
    loadComponent: () => import('./kvoutput/lessons-kv-output/lessons-kv-output.page').then( m => m.LessonsKvOutputPage)
  },
  {
    path: 'wordslessons-kv-output',
    loadComponent: () => import('./kvoutput/wordslessons-kv-output/wordslessons-kv-output.page').then( m => m.WordslessonsKvOutputPage)
  },
  

  
];
