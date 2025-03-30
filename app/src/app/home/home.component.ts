import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  title = 'AI in Art: Ethics Survey';
  description =
    'Exploring the boundaries between artificial intelligence and human creativity';

  constructor(private router: Router) {}

  startSurvey() {
    this.router.navigate(['/email-check']);
  }

  goToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }
}
