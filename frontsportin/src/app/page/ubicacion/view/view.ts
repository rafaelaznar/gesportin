import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClubService } from '../../../service/club';
import { PartidoService } from '../../../service/partido';
import { IClub } from '../../../model/club';
import { IPartido } from '../../../model/partido';
import { RouterLink } from '@angular/router';

declare global {
  interface Window {
    L?: any;
  }
}

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

@Component({
  selector: 'app-ubicacion-view-page',
  templateUrl: './view.html',
  styleUrl: './view.css',
  imports: [RouterLink],
})
export class UbicacionViewPage {
  oEntity = signal<IClub | IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  entityType = signal<'club' | 'partido' | null>(null);
  title = signal('Ubicación');
  currentCoordinates = signal<string>('');

  private mapInstance: any = null;
  private clubService = inject(ClubService);
  private partidoService = inject(PartidoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    const entity = this.route.snapshot.paramMap.get('entity');
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!entity || (entity !== 'club' && entity !== 'partido') || isNaN(id)) {
      this.error.set('Entidad o identificador inválido.');
      this.loading.set(false);
      return;
    }

    this.entityType.set(entity as 'club' | 'partido');
    this.title.set(entity === 'club' ? 'Ubicación del club' : 'Ubicación del partido');
    this.loadEntity(entity, id);
  }

  private loadEntity(entity: string, id: number): void {
    const service$: Observable<IClub | IPartido> =
      entity === 'club' ? this.clubService.get(id) : this.partidoService.get(id);

    service$.subscribe({
      next: (data: IClub | IPartido) => {
        this.oEntity.set(data);
        const lat = (data as any).latitud;
        const lng = (data as any).longitud;
        this.currentCoordinates.set(lat != null && lng != null ? `${lat}, ${lng}` : '');
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
        this.error.set('Error cargando ubicación: ' + err.message);
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
      return;
    }

    this.mapInstance?.remove();
    this.mapInstance = window.L.map('ubicacionMap').setView([lat, lng], 14);
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

  hasCoordinates(): boolean {
    const entity = this.oEntity();
    return entity != null && (entity as any).latitud != null && (entity as any).longitud != null;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
