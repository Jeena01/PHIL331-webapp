import { Component, OnInit } from '@angular/core';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Question {
  id: string;
  imageUrl: string;
  questionText: string;
  questionAnswers: string[];
  selectedAnswer?: string;
}

@Component({
  selector: 'app-survey',
  imports: [CommonModule, FormsModule],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.css',
})
export class SurveyComponent implements OnInit {
  questions: Question[] = [];
  loading = true;
  userEmail: string = '';
  hasCompletedSurvey = false;
  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    try {
      // Get email from query params
      this.route.queryParams.subscribe(async (params) => {
        if (!params['email']) {
          // Redirect to email check if no email provided
          this.router.navigate(['/email-check']);
          return;
        }
        this.userEmail = params['email'];

        // Check if email exists in Answers collection
        const answersRef = collection(db, 'Answers');
        const q = query(answersRef, where('userEmail', '==', this.userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          this.hasCompletedSurvey = true;
          this.loading = false;
          return;
        }

        // If email hasn't been used, load questions
        const questionsCollection = collection(db, 'Questions');
        const questionsSnapshot = await getDocs(questionsCollection);
        this.questions = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Question, 'id'>),
        }));
        this.loading = false;
      });
    } catch (error) {
      console.error('Error initializing survey:', error);
      this.loading = false;
    }
  }

  selectAnswer(questionId: string, answer: string) {
    const question = this.questions.find((q) => q.id === questionId);
    if (question) {
      question.selectedAnswer = answer;
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  areAllQuestionsAnswered(): boolean {
    return this.questions.every((q) => q.selectedAnswer !== undefined);
  }

  async submitSurvey() {
    if (!this.areAllQuestionsAnswered()) return;

    this.isSubmitting = true;

    try {
      // Create the main answer document
      const answersCollection = collection(db, 'Answers');
      const answerDoc = await addDoc(answersCollection, {
        userEmail: this.userEmail,
      });

      // Create the responses subcollection
      const responsesCollection = collection(
        answersCollection,
        answerDoc.id,
        'responses'
      );

      // Add each response
      const submitPromises = this.questions.map((question) => {
        const answerIndex = question.questionAnswers.indexOf(
          question.selectedAnswer!
        );
        return addDoc(responsesCollection, {
          questionId: question.id,
          answerIndex: answerIndex,
        });
      });

      await Promise.all(submitPromises);

      // Navigate to a thank you page or home
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error submitting survey:', error);
      // You might want to show an error message to the user
    }

    this.isSubmitting = false;

    this.router.navigate(['/results']);
  }
}
