import { Component, inject } from '@angular/core';
import { PwaService } from '../../../service/pwa';

@Component({
  selector: 'app-download',
  imports: [],
  templateUrl: './download.html',
  styleUrl: './download.css',
})
export class DownloadApplication {
  pwa = inject(PwaService);
  outcome: 'accepted' | 'dismissed' | 'unavailable' | null = null;

  async installApp(): Promise<void> {
    this.outcome = await this.pwa.promptInstall();
  }
}



