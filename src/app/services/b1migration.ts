import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  writeBatch,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';

@Injectable({
  providedIn: 'root'
})
export class B1migration {
  
private readonly collectionName = 'EnglishB1words';

  constructor() {}

  /**
   * Migrates shortDescription from:
   *   { 'en-GB': string, 'en-US': string }
   * to:
   *   { 'en-GB': [{ text, audioUrl: '' }], 'en-US': [{ text, audioUrl: '' }] }
   *
   * If it's already in the new array format, it preserves it.
   */
  async migrateShortDescriptions(): Promise<number> {
    const colRef = collection(db, this.collectionName);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      console.log('No docs found in', this.collectionName);
      return 0;
    }

    const CHUNK = 450;
    let batch = writeBatch(db);
    let inBatch = 0;
    let updatedCount = 0;

    for (const docSnap of snap.docs) {
      const data = docSnap.data() as any;
      const sd = data.shortDescription;

      if (!sd) {
        continue;
      }

      const origGb = sd['en-GB'];
      const origUs = sd['en-US'];

      const gbIsString = typeof origGb === 'string';
      const usIsString = typeof origUs === 'string';
      const gbIsArray = Array.isArray(origGb);
      const usIsArray = Array.isArray(origUs);

      // If already looks like [ { text, audioUrl? } ], skip
      if (
        gbIsArray &&
        origGb.length > 0 &&
        typeof origGb[0] === 'object' &&
        'text' in origGb[0]
      ) {
        // assume new format; no change
      } else if (gbIsString) {
        sd['en-GB'] = [{ text: origGb, audioUrl: '' }];
      } else if (!origGb) {
        sd['en-GB'] = [];
      } else if (gbIsArray) {
        // array but not TextWithAudio objects — leave as-is or wrap? Here, keep as-is.
        sd['en-GB'] = origGb;
      }

      if (
        usIsArray &&
        origUs.length > 0 &&
        typeof origUs[0] === 'object' &&
        'text' in origUs[0]
      ) {
        // assume new format; no change
      } else if (usIsString) {
        sd['en-US'] = [{ text: origUs, audioUrl: '' }];
      } else if (!origUs) {
        sd['en-US'] = [];
      } else if (usIsArray) {
        sd['en-US'] = origUs;
      }

      // Write updated shortDescription back
      batch.update(docSnap.ref, { shortDescription: sd });
      inBatch++;
      updatedCount++;

      if (inBatch >= CHUNK) {
        await batch.commit();
        console.log(`Committed batch of ${inBatch} docs.`);
        batch = writeBatch(db);
        inBatch = 0;
      }
    }

    if (inBatch > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${inBatch} docs.`);
    }

    console.log(`Migration done. Updated ${updatedCount} document(s).`);
    return updatedCount;
  }
}
