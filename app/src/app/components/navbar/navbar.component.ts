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
        <div class="p-4">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <a
              [routerLink]="isAuthenticated() ? '/admin-dashboard' : '/'"
              class="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            >
              AI Ethics Survey
            </a>

            <!-- Mobile menu button -->
            <button
              class="md:hidden btn btn-ghost btn-sm"
              (click)="isMenuOpen = !isMenuOpen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                @if (isMenuOpen) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
                } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                }
              </svg>
            </button>

            <!-- Desktop menu -->
            <div class="hidden md:flex md:items-center md:gap-8">
              @if (!isAuthenticated()) {
              <nav class="flex gap-4">
                <a
                  routerLink="/home"
                  routerLinkActive="active"
                  class="px-3 py-2 text-sm font-medium rounded-md hover:bg-base-200 transition-all duration-200 nav-link"
                >
                  Home
                </a>
                <a
                  routerLink="/results"
                  routerLinkActive="active"
                  class="px-3 py-2 text-sm font-medium rounded-md hover:bg-base-200 transition-all duration-200 nav-link"
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

              <!-- Auth buttons for desktop -->
              <div class="ml-4">
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

          <!-- Mobile menu -->
          @if (isMenuOpen) {
          <div class="md:hidden mt-4 pb-4 border-t border-base-200">
            @if (!isAuthenticated()) {
            <nav class="flex flex-col gap-2 mt-4">
              <a
                routerLink="/home"
                routerLinkActive="active"
                (click)="isMenuOpen = false"
                class="px-3 py-2 text-sm font-medium rounded-md hover:bg-base-200 transition-all duration-200 nav-link"
              >
                Home
              </a>
              <a
                routerLink="/results"
                routerLinkActive="active"
                (click)="isMenuOpen = false"
                class="px-3 py-2 text-sm font-medium rounded-md hover:bg-base-200 transition-all duration-200 nav-link"
              >
                Survey Results
              </a>
            </nav>
            } @else {
            <nav class="flex flex-col gap-2 mt-4">
              <a
                routerLink="/admin-dashboard"
                routerLinkActive="active"
                (click)="isMenuOpen = false"
                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-base-200 transition-all duration-200 nav-link"
              >
                Admin Dashboard
              </a>
            </nav>
            }

            <!-- Auth buttons for mobile -->
            <div class="mt-4">
              @if (isAuthenticated()) {
              <button class="btn btn-error btn-sm w-full" (click)="logout()">
                Logout
              </button>
              } @else {
              <a
                routerLink="/admin-login"
                routerLinkActive="admin-active"
                (click)="isMenuOpen = false"
                class="btn btn-primary btn-sm w-full"
              >
                Admin Login
              </a>
              }
            </div>
          </div>
          }
        </div>
      </div>
    </div>
    <div class="h-[4.5rem] md:h-16"></div>
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
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  async logout() {
    await this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/']);
  }
}
