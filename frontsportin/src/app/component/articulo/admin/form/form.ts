import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ArticuloService } from '../../../../service/articulo';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { IArticulo } from '../../../../model/articulo';
import { ITipoarticulo } from '../../../../model/tipoarticulo';
import { SessionService } from '../../../../service/session';

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
  private snackBar = inject(MatSnackBar);
  private oArticuloService = inject(ArticuloService);
  private oTipoarticuloService = inject(TipoarticuloService);
  private dialog = inject(MatDialog);
  private sessionService = inject(SessionService);

  articuloForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  tipoarticulos = signal<ITipoarticulo[]>([]);
  selectedTipoarticulo = signal<ITipoarticulo | null>(null);
  displayIdTipoarticulo = signal<number | null>(null);

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
    this.loadTipoarticulos();

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
      id_tipoarticulo: [null, Validators.required],
    });

    this.articuloForm.get('id_tipoarticulo')?.valueChanges.subscribe((id) => {
      if (id) {
        this.loadTipoarticulo(Number(id));
      } else {
        this.selectedTipoarticulo.set(null);
        this.displayIdTipoarticulo.set(null);
      }
    });
  }

  private loadArticuloData(articulo: IArticulo): void {
    this.articuloForm.patchValue({
      id: articulo.id,
      descripcion: articulo.descripcion,
      precio: articulo.precio,
      descuento: articulo.descuento,
      id_tipoarticulo: articulo.tipoarticulo?.id,
    });
    if (articulo.tipoarticulo?.id) {
      this.syncTipoarticulo(articulo.tipoarticulo.id);
    }
  }

  private loadTipoarticulo(idTipoarticulo: number): void {
    this.oTipoarticuloService.get(idTipoarticulo).subscribe({
      next: (tipoarticulo) => {
        this.selectedTipoarticulo.set(tipoarticulo);
        this.displayIdTipoarticulo.set(tipoarticulo.id);
      },
      error: (err: HttpErrorResponse) => {
        this.selectedTipoarticulo.set(null);
        this.displayIdTipoarticulo.set(null);
        console.error(err);
        this.snackBar.open('Error cargando el tipo de artículo', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadTipoarticulos(): void {
    const clubId = this.sessionService.isClubAdmin() ? this.sessionService.getClubId() ?? 0 : 0;
    const tipoarticulos$ = clubId > 0 ? this.oTipoarticuloService.getPage(0, 1000, 'descripcion', 'asc', '', clubId) : this.oTipoarticuloService.getPage(0, 1000, 'descripcion', 'asc', '');

    tipoarticulos$.subscribe({
      next: (page) => {
        this.tipoarticulos.set(page.content);
        const currentId = this.articuloForm.get('id_tipoarticulo')?.value;
        if (currentId) {
          this.syncTipoarticulo(Number(currentId));
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando tipos de artículo', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private syncTipoarticulo(idTipoarticulo: number): void {
    const selected = this.tipoarticulos().find((t) => t.id === idTipoarticulo) || null;
    this.selectedTipoarticulo.set(selected);
    this.displayIdTipoarticulo.set(selected?.id ?? null);
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

  onSubmit(): void {
    if (this.articuloForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const articuloData: any = {
      descripcion: this.articuloForm.value.descripcion,
      precio: Number(this.articuloForm.value.precio),
      descuento: Number(this.articuloForm.value.descuento),
      tipoarticulo: { id: Number(this.articuloForm.value.id_tipoarticulo) },
    };

    if (this.isEditMode && this.articulo?.id) {
      articuloData.id = this.articulo.id;
      this.oArticuloService.update(articuloData).subscribe({
        next: () => {
          this.snackBar.open('Artículo actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el artículo');
          this.snackBar.open('Error actualizando el artículo', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oArticuloService.create(articuloData).subscribe({
        next: () => {
          this.snackBar.open('Artículo creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el artículo');
          this.snackBar.open('Error creando el artículo', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
