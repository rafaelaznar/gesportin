import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CompraService } from '../../../../service/compra';
import { ArticuloService } from '../../../../service/articulo';
import { FacturaService } from '../../../../service/factura-service';
import { ICompra } from '../../../../model/compra';
import { IArticulo } from '../../../../model/articulo';
import { IFactura } from '../../../../model/factura';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-compra-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class CompraAdminForm implements OnInit {
  @Input() compra: ICompra | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oCompraService = inject(CompraService);
  private oArticuloService = inject(ArticuloService);
  private oFacturaService = inject(FacturaService);
  private dialog = inject(MatDialog);
  private sessionService = inject(SessionService);

  compraForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  articulos = signal<IArticulo[]>([]);
  facturas = signal<IFactura[]>([]);

  constructor() {
    effect(() => {
      const c = this.compra;
      if (c && this.compraForm) {
        this.loadCompraData(c);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadArticulos();
    this.loadFacturas();

    if (this.compra) {
      this.loadCompraData(this.compra);
    }
  }

  private initForm(): void {
    this.compraForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      id_articulo: [null, Validators.required],
      id_factura: [null, Validators.required],
    });
  }

  private loadCompraData(compra: ICompra): void {
    this.compraForm.patchValue({
      id: compra.id,
      cantidad: compra.cantidad,
      precio: compra.precio,
      id_articulo: compra.articulo?.id,
      id_factura: compra.factura?.id,
    });
  }

  private loadArticulos(): void {
    this.oArticuloService.getPage(0, 1000, 'descripcion', 'asc', '').subscribe({
      next: (page) => {
        this.articulos.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando artículos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadFacturas(): void {
    this.oFacturaService.getPage(0, 1000, 'id', 'asc').subscribe({
      next: (page) => {
        this.facturas.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando facturas', 'Cerrar', { duration: 3000 });
      },
    });
  }

  get cantidad() {
    return this.compraForm.get('cantidad');
  }

  get precio() {
    return this.compraForm.get('precio');
  }

  get id_articulo() {
    return this.compraForm.get('id_articulo');
  }

  get id_factura() {
    return this.compraForm.get('id_factura');
  }

  onSubmit(): void {
    if (this.compraForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const compraData: any = {
      cantidad: Number(this.compraForm.value.cantidad),
      precio: Number(this.compraForm.value.precio),
      articulo: { id: Number(this.compraForm.value.id_articulo) },
      factura: { id: Number(this.compraForm.value.id_factura) },
    };

    if (this.isEditMode && this.compra?.id) {
      compraData.id = this.compra.id;
      this.oCompraService.update(compraData).subscribe({
        next: () => {
          this.snackBar.open('Compra actualizada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la compra');
          this.snackBar.open('Error actualizando la compra', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCompraService.create(compraData).subscribe({
        next: () => {
          this.snackBar.open('Compra creada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la compra');
          this.snackBar.open('Error creando la compra', 'Cerrar', { duration: 4000 });
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
