import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isAuthenticated = await this.authService.waitForAuthInit();

    if (isAuthenticated) {
      return true;
    }

    this.router.navigate(['/admin-login']);
    return false;
  }
}
