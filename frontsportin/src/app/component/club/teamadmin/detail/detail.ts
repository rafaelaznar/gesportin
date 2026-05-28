import { Component, inject, input, Input, OnInit, Signal, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { IClub } from '../../../../model/club';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { ClubService } from '../../../../service/club';
import { SessionService } from '../../../../service/session';

declare global {
  interface Window {
    L?: any;
  }
}

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

@Component({
  selector: 'app-club-teamadmin-detail',
  imports: [DatetimePipe, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ClubTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oClubService = inject(ClubService);
  session = inject(SessionService);
  //private notificacion = inject(NotificacionService);

  oClub = signal<IClub | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private mapInstance: any = null;

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oClubService.get(id).subscribe({
      next: (data: IClub) => {
        this.oClub.set(data);
        const lat = (data as any).latitud;
        const lng = (data as any).longitud;
        this.loadLeafletAssets()
          .then(() => {
            this.loading.set(false);
            if (lat != null && lng != null) {
              setTimeout(() => this.initMap(lat, lng), 0);
            }
          })
          .catch((err) => {
            this.error.set('Error cargando Leaflet: ' + err);
            this.loading.set(false);
          });
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el club');
        this.loading.set(false);
        //this.notificacion.error('Error cargando el club');
        console.error(err);
      },
    });
  }

  private loadLeafletAssets(): Promise<void> {
    if (window.L) {
      return Promise.resolve();
    }

    const existingStyle = document.getElementById('leaflet-css');
    if (!existingStyle) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS_URL;
      document.head.appendChild(link);
    }

    return new Promise<void>((resolve, reject) => {
      if (window.L) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = LEAFLET_JS_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.L) {
          resolve();
        } else {
          reject('Leaflet no se inicializó correctamente.');
        }
      };
      script.onerror = () => reject('No se pudo cargar Leaflet desde el CDN.');
      document.body.appendChild(script);
    });
  }

  private initMap(lat: number, lng: number): void {
    if (!window.L) {
      return;
    }
    this.mapInstance?.remove();
    this.mapInstance = window.L.map('clubDetailMap').setView([lat, lng], 14);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      noWrap: true,
    }).addTo(this.mapInstance);
    try {
      this.mapInstance.setMaxBounds([
        [-90, -180],
        [90, 180],
      ]);
    } catch (e) {}
    window.L.marker([lat, lng]).addTo(this.mapInstance);
  }
}
