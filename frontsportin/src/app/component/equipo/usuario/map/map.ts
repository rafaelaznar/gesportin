import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PartidoService } from '../../../../service/partido';
import { IPartido } from '../../../../model/partido';

declare global {
  interface Window {
    L?: any;
  }
}

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

@Component({
  standalone: true,
  selector: 'app-equipo-usuario-map',
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})
export class EquipoUsuarioMap implements OnInit {
  @Input() id = 0;

  partido = signal<IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  private mapInstance: any = null;
  private partidoService = inject(PartidoService);

  get mapId(): string {
    return `equipoUsuarioMap-${this.id || 'unknown'}`;
  }

  ngOnInit(): void {
    const partidoId = this.id;
    if (!partidoId || isNaN(partidoId)) {
      this.error.set('ID de partido no válido');
      this.loading.set(false);
      return;
    }

    this.partidoService.get(partidoId).subscribe({
      next: (data) => {
        this.partido.set(data);
        const lat = data.latitud;
        const lng = data.longitud;
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
        this.error.set('Error cargando el partido');
        console.error(err);
        this.loading.set(false);
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
      this.error.set('Leaflet no está disponible.');
      return;
    }

    const container = document.getElementById(this.mapId);
    if (!container) {
      this.error.set('Contenedor de mapa no encontrado.');
      return;
    }

    this.mapInstance?.remove();
    this.mapInstance = window.L.map(this.mapId).setView([lat, lng], 13);
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
