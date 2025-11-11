// src/app/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { environment } from '../environments/environment';

export const app = initializeApp(environment.firebase);
export const db = getFirestore(app);


/*

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
*/