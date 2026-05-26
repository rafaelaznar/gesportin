import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';;
import { toIsoDateTime } from '../../../../utils/date-utils';
import { ClubService } from '../../../../service/club';
import { ImageUploadService } from '../../../../service/image-upload';
import { IClub } from '../../../../model/club';

@Component({
  selector: 'app-club-admin-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css'],
})
export class ClubAdminForm implements OnInit {
  @Input() club: IClub | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private clubService = inject(ClubService);
  public imageUpload = inject(ImageUploadService);

  clubForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  imagePreview = signal<string | null>(null);

  constructor() {
    effect(() => {
      const c = this.club;
      if (c && this.clubForm) {
        this.loadClubData(c);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.club) {
      this.loadClubData(this.club);
    }
  }

  private initForm(): void {
    this.clubForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      direccion: [''],
      telefono: [''],
      fechaAlta: [new Date().toISOString().split('T')[0], Validators.required],
      imagen: [null],
    });
  }

  private loadClubData(club: IClub): void {
    if (!this.club) return;
    const fechaAltaInput = this.toDateInputValue(this.club.fechaAlta);

    this.clubForm.patchValue({
      id: this.club.id,
      nombre: this.club.nombre,
      direccion: this.club.direccion,
      telefono: this.club.telefono,
      fechaAlta: fechaAltaInput,
      imagen: this.club.imagen || null,
    });
    if (club.imagen) this.imagePreview.set(this.imageUpload.toPreviewSrc(club.imagen));
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

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const base64 = await this.imageUpload.fileToBase64(file);
      this.clubForm.patchValue({ imagen: base64 });
      this.imagePreview.set(this.imageUpload.toPreviewSrc(base64));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo procesar la imagen';
      this.notificacion.error(message);
      this.imagePreview.set(null);
      input.value = '';
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
