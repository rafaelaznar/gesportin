import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { toIsoDateTime } from '../../../../utils/date-utils';
import { ClubService } from '../../../../service/club';
import { IClub } from '../../../../model/club';

declare global {
  interface Window {
    L?: any;
  }
}

@Component({
  selector: 'app-club-admin-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css'],
})
export class ClubAdminForm implements OnInit, AfterViewInit {
  @Input() club: IClub | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private clubService = inject(ClubService);

  clubForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);

  private mapInstance: any = null;
  private mapMarker: any = null;
  private readonly mapContainerId = 'clubLocationMap';

  ngOnInit(): void {
    this.initForm();
    if (this.club) {
      this.loadClubData();
    }
  }

  ngAfterViewInit(): void {
    this.loadLeafletAssets()
      .then(() => this.initMap())
      .catch((err) => console.error('Error cargando Leaflet en ClubAdminForm:', err));
    this.subscribeToLocationChanges();
  }

  private initForm(): void {
    this.clubForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      direccion: [''],
      telefono: [''],
      latitud: [null, [Validators.min(-90), Validators.max(90)]],
      longitud: [null, [Validators.min(-180), Validators.max(180)]],
      fechaAlta: [new Date().toISOString().split('T')[0], Validators.required],
      imagen: [null],
    });
  }

  private loadClubData(): void {
    if (!this.club) return;
    const fechaAltaInput = this.toDateInputValue(this.club.fechaAlta);

    this.clubForm.patchValue({
      id: this.club.id,
      nombre: this.club.nombre,
      direccion: this.club.direccion,
      telefono: this.club.telefono,
      latitud: this.club.latitud ?? null,
      longitud: this.club.longitud ?? null,
      fechaAlta: fechaAltaInput,
      imagen: this.club.imagen || null,
    });

    this.updateMapMarker();
  }

  get nombre() {
    return this.clubForm.get('nombre');
  }

  get fechaAlta() {
    return this.clubForm.get('fechaAlta');
  }

  onSubmit(): void {
    this.error.set(null);

    if (this.clubForm.invalid) {
      this.error.set('Por favor, complete todos los campos correctamente');
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      this.clubForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const fechaValue = this.clubForm.value.fechaAlta;
    const fechaConHora = toIsoDateTime(fechaValue);

    const formData = {
      id: this.isEditMode ? this.club?.id : undefined,
      nombre: this.clubForm.value.nombre,
      direccion: this.clubForm.value.direccion,
      telefono: this.clubForm.value.telefono,
      latitud: this.clubForm.value.latitud,
      longitud: this.clubForm.value.longitud,
      fechaAlta: fechaConHora,
      imagen: this.clubForm.value.imagen || null,
      ...(this.isEditMode
        ? {}
        : {
            temporadas: [],
            noticias: [],
            tipoarticulos: [],
            usuarios: [],
          }),
    };

    if (this.isEditMode) {
      this.saveUpdate(formData);
    } else {
      this.saveCreate(formData);
    }
  }

  private saveCreate(clubData: any): void {
    this.clubService.create(clubData).subscribe({
      next: (id: number) => {
        this.notificacion.info('Club creado exitosamente');
        this.submitting.set(false);
        this.formSuccess.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error creando el club');
        this.notificacion.error('Error creando el club');
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  private saveUpdate(clubData: any): void {
    this.clubService.update(clubData).subscribe({
      next: (id: number) => {
        this.notificacion.info('Club actualizado exitosamente');
        this.submitting.set(false);
        this.formSuccess.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando el club');
        this.notificacion.error('Error actualizando el club');
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  private toDateInputValue(value: Date | string): string {
    if (!value) {
      return new Date().toISOString().split('T')[0];
    }
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    const text = String(value);
    return text.includes('T') ? text.split('T')[0] : text.split(' ')[0];
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private subscribeToLocationChanges(): void {
    this.clubForm.get('latitud')?.valueChanges.subscribe(() => this.updateMapMarker());
    this.clubForm.get('longitud')?.valueChanges.subscribe(() => this.updateMapMarker());
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

    const lat = Number(this.clubForm.value.latitud);
    const lng = Number(this.clubForm.value.longitud);
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
        this.clubForm.patchValue({
          latitud: Number(clickedLat.toFixed(6)),
          longitud: Number(clickedLng.toFixed(6)),
        });
        this.setMarker(clickedLat, clickedLng);
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
    const lat = Number(this.clubForm.value.latitud);
    const lng = Number(this.clubForm.value.longitud);
    if (window.L && this.mapInstance && !isNaN(lat) && !isNaN(lng)) {
      this.setMarker(lat, lng);
    }
  }
}
