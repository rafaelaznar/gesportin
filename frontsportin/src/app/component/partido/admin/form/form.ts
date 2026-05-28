import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  effect,
} from '@angular/core';
import { toIsoDateTime } from '../../../../utils/date-utils';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { PartidoService } from '../../../../service/partido';
import { LigaService } from '../../../../service/liga';
import { EstadopartidoService } from '../../../../service/estadopartido';
import { IPartido } from '../../../../model/partido';
import { ILiga } from '../../../../model/liga';
import { IEstadopartido } from '../../../../model/estadopartido';
import { SessionService } from '../../../../service/session';
import { LigaAdminPlist } from '../../../liga/admin/plist/plist';

declare global {
  interface Window {
    L?: any;
  }
}

@Component({
  selector: 'app-partido-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class PartidoAdminForm implements OnInit, AfterViewInit {
  @Input() partido: IPartido | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oPartidoService = inject(PartidoService);
  private oLigaService = inject(LigaService);
  private oEstadopartidoService = inject(EstadopartidoService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  partidoForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedLiga = signal<ILiga | null>(null);
  estadopartidoList = signal<IEstadopartido[]>([]);

  private mapInstance: any = null;
  private mapMarker: any = null;
  private readonly mapContainerId = 'partidoLocationMap';

  constructor() {
    effect(() => {
      const p = this.partido;
      if (p && this.partidoForm) {
        this.loadPartidoData(p);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.oEstadopartidoService
      .getAll()
      .subscribe({ next: (list) => this.estadopartidoList.set(list) });

    if (this.partido) {
      this.loadPartidoData(this.partido);
    }
  }

  ngAfterViewInit(): void {
    this.loadLeafletAssets()
      .then(() => this.initMap())
      .catch((err) => console.error('Error cargando Leaflet en PartidoAdminForm:', err));
    this.subscribeToLocationChanges();
  }

  private initForm(): void {
    this.partidoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      rival: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_liga: [null, Validators.required],
      local: [null, Validators.required],
      resultado: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      fecha: [null],
      lugar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      latitud: [null, [Validators.min(-90), Validators.max(90)]],
      longitud: [null, [Validators.min(-180), Validators.max(180)]],
      id_estadopartido: [null],
      comentario: [''],
    });
  }

  private loadPartidoData(partido: IPartido): void {
    this.partidoForm.patchValue({
      id: partido.id,
      rival: partido.rival,
      id_liga: partido.liga?.id,
      local: partido.local ? 1 : 0,
      resultado: partido.resultado,
      fecha: partido.fecha ? partido.fecha.substring(0, 16) : null,
      lugar: partido.lugar,
      latitud: partido.latitud ?? null,
      longitud: partido.longitud ?? null,
      id_estadopartido: partido.estadopartido?.id ?? null,
      comentario: partido.comentario ?? '',
    });
    if (partido.liga?.id) this.loadLiga(partido.liga.id);
    this.updateMapMarker();
  }

  private loadLiga(idLiga: number): void {
    this.oLigaService.get(idLiga).subscribe({
      next: (liga) => this.selectedLiga.set(liga),
      error: () => this.selectedLiga.set(null),
    });
  }

  get rival() {
    return this.partidoForm.get('rival');
  }

  get id_liga() {
    return this.partidoForm.get('id_liga');
  }

  get local() {
    return this.partidoForm.get('local');
  }

  get resultado() {
    return this.partidoForm.get('resultado');
  }

  get fecha() {
    return this.partidoForm.get('fecha');
  }

  get lugar() {
    return this.partidoForm.get('lugar');
  }

  get comentario() {
    return this.partidoForm.get('comentario');
  }

  get id_estadopartido() {
    return this.partidoForm.get('id_estadopartido');
  }

  openLigaFinderModal(): void {
    const ref = this.modalService.open<unknown, ILiga | null>(LigaAdminPlist);
    ref.afterClosed$.subscribe((liga: ILiga | null) => {
      if (liga?.id != null) {
        this.partidoForm.patchValue({ id_liga: liga.id });
        this.selectedLiga.set(liga);
        this.notificacion.success(`Liga seleccionada: ${liga.nombre}`);
      }
    });
  }

  onSubmit(): void {
    if (this.partidoForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const partidoData: any = {
      rival: this.partidoForm.value.rival,
      liga: { id: Number(this.partidoForm.value.id_liga) },
      local: Number(this.partidoForm.value.local) === 1,
      resultado: this.partidoForm.value.resultado,
      fecha: this.partidoForm.value.fecha ? toIsoDateTime(this.partidoForm.value.fecha) : null,
      lugar: this.partidoForm.value.lugar,
      latitud: this.partidoForm.value.latitud,
      longitud: this.partidoForm.value.longitud,
      comentario: this.partidoForm.value.comentario,
      estadopartido: this.partidoForm.value.id_estadopartido
        ? { id: Number(this.partidoForm.value.id_estadopartido) }
        : null,
    };

    if (this.isEditMode && this.partido?.id) {
      partidoData.id = this.partido.id;
      this.oPartidoService.update(partidoData).subscribe({
        next: () => {
          this.notificacion.info('Partido actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el partido');
          this.notificacion.error('Error actualizando el partido');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oPartidoService.create(partidoData).subscribe({
        next: () => {
          this.notificacion.info('Partido creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el partido');
          this.notificacion.error('Error creando el partido');
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private subscribeToLocationChanges(): void {
    this.partidoForm.get('latitud')?.valueChanges.subscribe(() => this.updateMapMarker());
    this.partidoForm.get('longitud')?.valueChanges.subscribe(() => this.updateMapMarker());
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
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    return new Promise<void>((resolve, reject) => {
      if (window.L) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
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

  private initMap(): void {
    if (!window.L) {
      return;
    }

    const container = document.getElementById(this.mapContainerId);
    if (!container) {
      return;
    }

    const lat = Number(this.partidoForm.value.latitud);
    const lng = Number(this.partidoForm.value.longitud);
    const hasLocation = !isNaN(lat) && !isNaN(lng);
    const center = hasLocation ? [lat, lng] : [40.416775, -3.70379];

    this.mapInstance = window.L.map(this.mapContainerId).setView(center, hasLocation ? 13 : 6);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      noWrap: true,
    }).addTo(this.mapInstance);
    try {
      this.mapInstance.setMaxBounds([
        [-90, -180],
        [90, 180],
      ]);
    } catch (e) {
      // ignore
    }

    this.mapInstance.on('click', (event: any) => {
      const clickedLat = event.latlng?.lat;
      const clickedLng = event.latlng?.lng;
      if (clickedLat != null && clickedLng != null) {
        const latVal = Number(clickedLat.toFixed(6));
        const lngVal = Number(clickedLng.toFixed(6));
        this.partidoForm.patchValue({
          latitud: latVal,
          longitud: lngVal,
        });
        // ensure validators and status are recalculated and form is considered dirty
        this.partidoForm.get('latitud')?.markAsDirty();
        this.partidoForm.get('longitud')?.markAsDirty();
        this.partidoForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
        this.setMarker(latVal, lngVal);
      }
    });

    if (hasLocation) {
      this.setMarker(lat, lng);
    }
  }

  private setMarker(lat: number, lng: number): void {
    if (!window.L || !this.mapInstance) {
      return;
    }

    if (this.mapMarker) {
      this.mapMarker.setLatLng([lat, lng]);
    } else {
      this.mapMarker = window.L.marker([lat, lng]).addTo(this.mapInstance);
    }
    this.mapInstance.setView([lat, lng], 13);
  }

  private updateMapMarker(): void {
    const lat = Number(this.partidoForm.value.latitud);
    const lng = Number(this.partidoForm.value.longitud);
    if (window.L && this.mapInstance && !isNaN(lat) && !isNaN(lng)) {
      this.setMarker(lat, lng);
    }
  }
}
