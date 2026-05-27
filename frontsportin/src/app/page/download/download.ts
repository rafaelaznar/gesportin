import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PwaService } from '../../service/pwa';

@Component({
  selector: 'app-download',
  imports: [],
  templateUrl: './download.html',
  styleUrl: './download.css',
})
export class DownloadApplication implements OnInit {
  pwa = inject(PwaService);
  private router = inject(Router);
  outcome: 'accepted' | 'dismissed' | 'unavailable' | null = null;

  ngOnInit(): void {
    if (window.innerWidth >= 768) {
      this.router.navigate(['/']);
    }
  }

  async installApp(): Promise<void> {
    this.outcome = await this.pwa.promptInstall();
  }
}
