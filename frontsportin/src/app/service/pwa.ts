import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private deferredPrompt: any = null;
  private readonly INSTALLED_KEY = 'pwa_installed';

  canInstall = signal(false);

  installed = signal(
    window.matchMedia('(display-mode: standalone)').matches ||
    !!(navigator as any).standalone ||
    localStorage.getItem('pwa_installed') === 'true'
  );

  captureInstallPrompt(event: Event): void {
    this.deferredPrompt = event;
    this.canInstall.set(true);
  }

  onAppInstalled(): void {
    this.deferredPrompt = null;
    this.canInstall.set(false);
    localStorage.setItem(this.INSTALLED_KEY, 'true');
    this.installed.set(true);
  }

  async promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferredPrompt) {
      return 'unavailable';
    }
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.canInstall.set(false);
    if (outcome === 'accepted') {
      localStorage.setItem(this.INSTALLED_KEY, 'true');
      this.installed.set(true);
    }
    return outcome as 'accepted' | 'dismissed';
  }
}

