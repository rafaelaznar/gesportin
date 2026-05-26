import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';;
import { ModalService } from '../../../shared/modal/modal.service';
import { ArticuloService } from '../../../../service/articulo';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { ImageUploadService } from '../../../../service/image-upload';
import { IArticulo } from '../../../../model/articulo';
import { ITipoarticulo } from '../../../../model/tipoarticulo';
import { SessionService } from '../../../../service/session';
import { TipoarticuloAdminPlist } from '../../../tipoarticulo/admin/plist/plist';

@Component({
  selector: 'app-articulo-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class ArticuloAdminForm implements OnInit {
  @Input() articulo: IArticulo | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oArticuloService = inject(ArticuloService);
  private oTipoarticuloService = inject(TipoarticuloService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);
  public imageUpload = inject(ImageUploadService);

  articuloForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedTipoarticulo = signal<ITipoarticulo | null>(null);

  constructor() {
    effect(() => {
      const a = this.articulo;
      if (a && this.articuloForm) {
        this.loadArticuloData(a);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.articulo) {
      this.loadArticuloData(this.articulo);
    }
  }

  private initForm(): void {
    this.articuloForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      imagen: [null],
      id_tipoarticulo: [null, Validators.required],
    });
  }

  private loadArticuloData(articulo: IArticulo): void {
    this.articuloForm.patchValue({
      id: articulo.id,
      descripcion: articulo.descripcion,
      precio: articulo.precio,
      descuento: articulo.descuento,
      imagen: articulo.imagen || null,
      id_tipoarticulo: articulo.tipoarticulo?.id,
    });
    if (articulo.tipoarticulo?.id) this.loadTipoarticulo(articulo.tipoarticulo.id);
  }

  private loadTipoarticulo(idTipoarticulo: number): void {
    this.oTipoarticuloService.get(idTipoarticulo).subscribe({
      next: (tipoarticulo) => this.selectedTipoarticulo.set(tipoarticulo),
      error: () => this.selectedTipoarticulo.set(null),
    });
  }

  get descripcion() {
    return this.articuloForm.get('descripcion');
  }

  get precio() {
    return this.articuloForm.get('precio');
  }

  get descuento() {
    return this.articuloForm.get('descuento');
  }

  get id_tipoarticulo() {
    return this.articuloForm.get('id_tipoarticulo');
  }

  openTipoarticuloFinderModal(): void {
    const ref = this.modalService.open<unknown, ITipoarticulo | null>(TipoarticuloAdminPlist);
    ref.afterClosed$.subscribe((tipoarticulo: ITipoarticulo | null) => {
      if (tipoarticulo?.id != null) {
        this.articuloForm.patchValue({ id_tipoarticulo: tipoarticulo.id });
        this.selectedTipoarticulo.set(tipoarticulo);
        this.notificacion.success(`Tipo seleccionado: ${tipoarticulo.descripcion}`);
      }
    });
  }

  onSubmit(): void {
    if (this.articuloForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const articuloData: any = {
      descripcion: this.articuloForm.value.descripcion,
      precio: Number(this.articuloForm.value.precio),
      descuento: Number(this.articuloForm.value.descuento),
      imagen: this.articuloForm.value.imagen || null,
      tipoarticulo: { id: Number(this.articuloForm.value.id_tipoarticulo) },
    };

    if (this.isEditMode && this.articulo?.id) {
      articuloData.id = this.articulo.id;
      this.oArticuloService.update(articuloData).subscribe({
        next: () => {
          this.notificacion.info('Artículo actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el artículo');
          this.notificacion.error('Error actualizando el artículo');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oArticuloService.create(articuloData).subscribe({
        next: () => {
          this.notificacion.info('Artículo creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el artículo');
          this.notificacion.error('Error creando el artículo');
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.notificacion.error('Selecciona una imagen válida');
      input.value = '';
      return;
    }

    try {
      const base64 = await this.imageUpload.fileToBase64(file);
      this.articuloForm.patchValue({ imagen: base64 });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo procesar la imagen';
      this.notificacion.error(message);
      input.value = '';
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
