import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div
      class="bg-base-100 border-b border-base-200 fixed w-full top-0 z-50 shadow-lg"
    >
      <div class="container mx-auto">
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex items-center gap-8">
            <a
              [routerLink]="isAuthenticated() ? '/admin-dashboard' : '/'"
              class="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            >
              AI Ethics Survey
            </a>
            @if (!isAuthenticated()) {
            <nav class="flex gap-6">
              <a
                routerLink="/home"
                routerLinkActive="active"
                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-base-200 transition-all duration-200 nav-link"
              >
                Home
              </a>
              <a
                routerLink="/results"
                routerLinkActive="active"
                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-base-200 transition-all duration-200 nav-link"
              >
                Survey Results
              </a>
            </nav>
            } @else {
            <nav class="flex gap-6">
              <a
                routerLink="/admin-dashboard"
                routerLinkActive="active"
                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-base-200 transition-all duration-200 nav-link"
              >
                Admin Dashboard
              </a>
            </nav>
            }
          </div>
          <div>
            @if (isAuthenticated()) {
            <button class="btn btn-error btn-sm" (click)="logout()">
              Logout
            </button>
            } @else {
            <a
              routerLink="/admin-login"
              routerLinkActive="admin-active"
              class="btn btn-primary btn-sm"
            >
              Admin Login
            </a>
            }
          </div>
        </div>
      </div>
    </div>
    <div class="h-16"></div>
    <!-- Spacer for fixed navbar -->
  `,
  styles: [
    `
      .nav-link {
        position: relative;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: hsl(var(--p));
        transform: scaleX(0);
        transition: transform 0.2s ease;
      }

      .active {
        color: hsl(var(--p));
      }

      .active::after {
        transform: scaleX(1);
      }

      .admin-active {
        background-color: hsl(var(--p)) !important;
        color: hsl(var(--pc)) !important;
      }
    `,
  ],
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
