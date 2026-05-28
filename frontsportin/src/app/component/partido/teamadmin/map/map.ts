import { Component, Input, OnInit, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-partido-teamadmin-map',
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
})
export class PartidoTeamadminMap implements OnInit, AfterViewInit {
  @Input() partido: IPartido | null = null;

  mapInitialized = signal(false);
  error = signal<string | null>(null);
  private mapInstance: any = null;

  get mapId(): string {
    return `partidoMap-${this.partido?.id ?? 'unknown'}`;
  }

  ngOnInit(): void {
    if (!this.partido) {
      this.error.set('Partido no disponible para el mapa.');
    }
  }

  ngAfterViewInit(): void {
    const lat = this.partido?.latitud;
    const lng = this.partido?.longitud;
    if (lat == null || lng == null) {
      return;
    }

    this.loadLeafletAssets()
      .then(() => {
        setTimeout(() => this.initMap(lat, lng), 0);
      })
      .catch((err) => {
        this.error.set('Error cargando Leaflet: ' + err);
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
    this.mapInitialized.set(true);
  }
}
