import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { GameResult } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  constructor(private firestore: Firestore) {}

  async saveScore(score: number, userId: string): Promise<void> {
    try {
      const gameResult: GameResult = {
        score,
        date: new Date(),
        userId,
      };

      await addDoc(collection(this.firestore, 'gameResults'), gameResult);
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  }

  getUserScores(userId: string): Observable<GameResult[]> {
    const scoresRef = collection(this.firestore, 'gameResults');
    const q = query(scoresRef, where('userId', '==', userId), orderBy('date', 'desc'), limit(10));

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(), // Spread the document data - score, date, userId
              date: doc.data()['date'].toDate(), // Convert timestamp to Date object
            } as GameResult)
        )
      )
    );
  }
}
