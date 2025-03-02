import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

interface Question {
  id: string;
  questionText: string;
  questionAnswers: string[];
  answerCounts: number[];
  totalResponses: number;
}

interface ResponseData {
  questionId: string;
  answerIndex: number;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  loading = true;
  questions: Question[] = [];
  error: string | null = null;

  async ngOnInit() {
    try {
      // Fetch questions
      const questionsCollection = collection(db, 'Questions');
      const questionsSnapshot = await getDocs(questionsCollection);
      const questions = questionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<
          Question,
          'id' | 'answerCounts' | 'totalResponses'
        >),
        answerCounts: new Array(doc.data()['questionAnswers'].length).fill(0),
        totalResponses: 0,
      }));

      // Fetch all answers
      const answersCollection = collection(db, 'Answers');
      const answersSnapshot = await getDocs(answersCollection);

      // Process each answer document
      for (const answerDoc of answersSnapshot.docs) {
        const responsesCollection = collection(
          answersCollection,
          answerDoc.id,
          'responses'
        );
        const responsesSnapshot = await getDocs(responsesCollection);

        // Count answers for each question
        responsesSnapshot.docs.forEach((responseDoc) => {
          const response = responseDoc.data() as ResponseData;
          const question = questions.find(
            (q) => q.id === response['questionId']
          );
          if (question) {
            question.answerCounts[response['answerIndex']]++;
            question.totalResponses++;
          }
        });
      }

      this.questions = questions;
    } catch (error) {
      console.error('Error fetching results:', error);
      this.error = 'Failed to load survey results';
    } finally {
      this.loading = false;
    }
  }

  getResponsePercentage(count: number, total: number): string {
    if (total === 0) return '0%';
    return `${Math.round((count / total) * 100)}%`;
  }
}
