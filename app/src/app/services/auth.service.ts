import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
  private userSubject = new BehaviorSubject<User | null>(null);
  private authInitialized = new BehaviorSubject<boolean>(false);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      this.authInitialized.next(true);
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  // New method to wait for auth to initialize
  async waitForAuthInit(): Promise<boolean> {
    if (this.authInitialized.value) {
      return this.isAuthenticated();
    }

    return new Promise((resolve) => {
      const subscription = this.authInitialized.subscribe((initialized) => {
        if (initialized) {
          subscription.unsubscribe();
          resolve(this.isAuthenticated());
        }
      });
    });
  }
}
