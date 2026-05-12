import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private deferredPrompt: any = null;

  /** true cuando el navegador ha disparado beforeinstallprompt (app instalable) */
  canInstall = signal(false);

  /** true una vez que el usuario ha aceptado la instalación */
  installed = signal(false);

  /**
   * Guardar el evento beforeinstallprompt para usarlo después.
   * El llamador ya debe haber hecho event.preventDefault().
   */
  captureInstallPrompt(event: Event): void {
    this.deferredPrompt = event;
    this.canInstall.set(true);
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
      this.installed.set(true);
    }
    return outcome as 'accepted' | 'dismissed';
  }
}
