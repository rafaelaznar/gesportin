import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../service/session';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  standalone: true
})
export class LandingPage {
  private session = inject(SessionService);
  private router = inject(Router);

  constructor() {
    if (this.session.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.session.isClubAdmin()) {
      this.router.navigate(['/club/teamadmin']);
    } else if (this.session.isUser()) {
      this.router.navigate(['/mi']);
    }
  }
}

