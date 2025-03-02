import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

@Component({
  selector: 'app-email-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-check.component.html',
  styleUrl: './email-check.component.css',
})
export class EmailCheckComponent {
  email: string = '';
  isValidEmail: boolean = false;
  isChecking: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isValidEmail = emailRegex.test(this.email);
    this.errorMessage = '';
  }

  async checkAndProceed() {
    if (!this.isValidEmail) return;

    this.isChecking = true;
    this.errorMessage = '';

    try {
      const answersRef = collection(db, 'Answers');
      const q = query(answersRef, where('userEmail', '==', this.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        this.errorMessage = 'This email has already completed the survey.';
        this.isChecking = false;
        return;
      }

      // Email hasn't been used, proceed to survey
      this.router.navigate(['/survey'], {
        queryParams: { email: this.email },
      });
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
      console.error('Error checking email:', error);
    }

    this.isChecking = false;
  }
}
