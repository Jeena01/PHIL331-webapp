import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { AuthService } from '../services/auth.service';

interface Question {
  id: string;
  questionTitle: string;
  questionText: string;
  questionAnswers: string[];
}

interface NewQuestion {
  questionTitle: string;
  questionText: string;
  questionAnswers: string[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  newQuestion: NewQuestion = {
    questionTitle: '',
    questionText: '',
    questionAnswers: [''],
  };

  error: string | null = null;
  success: string | null = null;
  loading = false;

  existingQuestions: Question[] = [];
  isLoading = true;
  deleteError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    await this.loadQuestions();
  }

  async loadQuestions() {
    this.isLoading = true;
    try {
      const questionsCollection = collection(db, 'Questions');
      const snapshot = await getDocs(questionsCollection);
      this.existingQuestions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Question, 'id'>),
      }));
    } catch (error) {
      console.error('Error loading questions:', error);
      this.error = 'Failed to load questions';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteQuestion(questionId: string) {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const questionRef = doc(db, 'Questions', questionId);
      await deleteDoc(questionRef);
      await this.loadQuestions(); // Refresh the list
      this.success = 'Question deleted successfully';
    } catch (error) {
      console.error('Error deleting question:', error);
      this.error = 'Failed to delete question';
    }
  }

  addAnswerOption() {
    this.newQuestion.questionAnswers.push('');
    this.error = null;
  }

  removeAnswerOption(index: number) {
    if (this.newQuestion.questionAnswers.length > 1) {
      this.newQuestion.questionAnswers.splice(index, 1);
      this.error = null;
    }
  }

  validateQuestion(): boolean {
    if (!this.newQuestion.questionTitle.trim()) {
      this.error = 'Question title is required';
      return false;
    }
    if (!this.newQuestion.questionText.trim()) {
      this.error = 'Question text is required';
      return false;
    }
    if (this.newQuestion.questionAnswers.length === 0) {
      this.error = 'At least one answer option is required';
      return false;
    }
    if (this.newQuestion.questionAnswers.some((answer) => !answer.trim())) {
      this.error = 'All answer options must have text';
      return false;
    }
    return true;
  }

  async submitQuestion() {
    this.error = null;
    this.success = null;

    if (!this.validateQuestion()) {
      return;
    }

    this.loading = true;

    try {
      const questionsCollection = collection(db, 'Questions');
      await addDoc(questionsCollection, {
        questionTitle: this.newQuestion.questionTitle.trim(),
        questionText: this.newQuestion.questionText.trim(),
        questionAnswers: this.newQuestion.questionAnswers.map((a) => a.trim()),
      });

      this.success = 'Question created successfully';
      // Reset form
      this.newQuestion = {
        questionTitle: '',
        questionText: '',
        questionAnswers: [''],
      };
    } catch (error) {
      console.error('Error creating question:', error);
      this.error = 'Failed to create question. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
