import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
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
  selector: 'app-partido-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class PartidoTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private partidoService = inject(PartidoService);

  oPartido = signal<IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showLiga = signal(false);
  showLigaEquipo = signal(false);
  showLigaEquipoCategoria = signal(false);
  showLigaEquipoCategoriaTemporada = signal(false);
  showLigaEquipoCategoriaTemporadaClub = signal(false);
  showLigaEquipoUsuario = signal(false);
  showLigaEquipoUsuarioTipousuario = signal(false);
  showLigaEquipoUsuarioRolusuario = signal(false);
  showLigaEquipoUsuarioClub = signal(false);

  private mapInstance: any = null;

  ngOnInit(): void {
    const idPartido = this.id();
    if (!idPartido || isNaN(idPartido)) {
      this.error.set('ID de partido no válido');
      this.loading.set(false);
      return;
    }
    this.load(idPartido);
  }

  private load(id: number): void {
    this.partidoService.get(id).subscribe({
      next: (data) => {
        this.oPartido.set(data);
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
        const liga = data.liga;
        const equipo = liga?.equipo;
        const cat = equipo?.categoria;
        const temp = cat?.temporada;
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
      return;
    }
    this.mapInstance?.remove();
    this.mapInstance = window.L.map('partidoDetailMap').setView([lat, lng], 14);
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
