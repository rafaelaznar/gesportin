import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { SessionService } from '../../../service/session';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ArticuloService } from '../../../service/articulo';
import { TipoarticuloService } from '../../../service/tipoarticulo';
import { IArticulo } from '../../../model/articulo';
import { ITipoarticulo } from '../../../model/tipoarticulo';
import { TipoarticuloPlistAdminUnrouted } from '../../tipoarticulo/plist-admin-unrouted/tipoarticulo-plist-admin-unrouted';

@Component({
  selector: 'app-articulo-form-unrouted',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './articulo-form.html',
  styleUrls: ['./articulo-form.css']
})
export class ArticuloFormAdminUnrouted implements OnInit {
  @Input() articulo: IArticulo | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oArticuloService = inject(ArticuloService);
  private oTipoarticuloService = inject(TipoarticuloService);
  private dialog = inject(MatDialog);
  private session = inject(SessionService);

  articuloForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  tiposarticulo = signal<ITipoarticulo[]>([]);
  selectedTipoarticulo = signal<ITipoarticulo | null>(null);
  displayIdTipo = signal<number | null>(null);

  constructor() {
    effect(() => {
      const input = this.articulo;
      if (input && this.articuloForm) {
        this.loadArticuloData(input);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadTiposArticulo();

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
        this.loadTipoarticulo();
      } else {
        this.selectedTipoarticulo.set(null);
        this.displayIdTipo.set(null);
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
    if (articulo.tipoarticulo) {
      this.syncTipoarticulo(articulo.tipoarticulo.id);
    }
  }

  private loadTipoarticulo(): void {
    const idTipo = this.articuloForm.get('id_tipoarticulo')?.value;
    if (idTipo) {
      this.oTipoarticuloService.get(idTipo).subscribe({
        next: (tipo) => {
          this.selectedTipoarticulo.set(tipo);
          this.displayIdTipo.set(tipo.id);
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Error cargando el tipo de artículo', 'Cerrar', { duration: 4000 });
          console.error(err);
        },
      });
    } else {
      this.selectedTipoarticulo.set(null);
      this.displayIdTipo.set(null);
    }
  }

  private loadTiposArticulo(): void {
    const clubId = this.session.isClubAdmin() ? this.session.getClubId() ?? 0 : 0;
    this.oTipoarticuloService
      .getPage(0, 1000, 'descripcion', 'asc', '', clubId)
      .subscribe({
        next: (page) => {
          this.tiposarticulo.set(page.content);
          const idActual = this.articuloForm.get('id_tipoarticulo')?.value;
          if (idActual) {
            this.syncTipoarticulo(idActual);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Error cargando tipos de artículo', 'Cerrar', { duration: 4000 });
          console.error(err);
        },
      });
  }

  private syncTipoarticulo(idTipo: number): void {
    this.displayIdTipo.set(idTipo);
    const tipoSeleccionado = this.tiposarticulo().find((t) => t.id === idTipo);
    if (tipoSeleccionado) {
      this.selectedTipoarticulo.set(tipoSeleccionado);
    } else {
      this.selectedTipoarticulo.set(null);
    }
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

  limitDecimalPlaces(event: Event, fieldName: string, maxDecimals: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1] && parts[1].length > maxDecimals) {
        const truncatedValue = parseFloat(value).toFixed(maxDecimals);
        this.articuloForm
          .get(fieldName)
          ?.setValue(parseFloat(truncatedValue), { emitEvent: false });
        input.value = truncatedValue;
      }
    }
  }

  openTipoarticuloFinderModal(): void {
    const dialogRef = this.dialog.open(TipoarticuloPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'tipoarticulo-dialog',
      data: {
        title: 'Aqui elegir tipoarticulo',
        message: 'Plist finder para encontrar el tipoarticulo y asignarlo al articulo',
      },
    });

    dialogRef.afterClosed().subscribe((tipoarticulo: ITipoarticulo | null) => {
      if (tipoarticulo) {
        this.articuloForm.patchValue({
          id_tipoarticulo: tipoarticulo.id,
        });
        this.syncTipoarticulo(tipoarticulo.id);
        this.snackBar.open(`Tipo de artículo seleccionado: ${tipoarticulo.descripcion}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.articuloForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const articuloData: any = {
      descripcion: this.articuloForm.value.descripcion,
      precio: this.articuloForm.value.precio,
      descuento: this.articuloForm.value.descuento || 0,
      tipoarticulo: { id: this.articuloForm.value.id_tipoarticulo },
    };

    if (this.mode === 'edit' && this.articulo?.id) {
      articuloData.id = this.articulo.id;
      this.oArticuloService.update(articuloData).subscribe({
        next: (id: number) => {
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
        next: (id: number) => {
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
