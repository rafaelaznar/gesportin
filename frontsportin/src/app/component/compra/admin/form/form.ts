import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';;
import { ModalService } from '../../../shared/modal/modal.service';
import { CompraService } from '../../../../service/compra';
import { ArticuloService } from '../../../../service/articulo';
import { FacturaService } from '../../../../service/factura-service';
import { ICompra } from '../../../../model/compra';
import { IArticulo } from '../../../../model/articulo';
import { IFactura } from '../../../../model/factura';
import { SessionService } from '../../../../service/session';
import { ArticuloPlistFinder } from '../../../articulo/finder/plist';
import { FacturaPlistFinder } from '../../../factura/finder/plist';

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
  private notificacion = inject(NotificacionService);
  private oCompraService = inject(CompraService);
  private oArticuloService = inject(ArticuloService);
  private oFacturaService = inject(FacturaService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  compraForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedArticulo = signal<IArticulo | null>(null);
  selectedFactura = signal<IFactura | null>(null);

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

  private loadArticulo(idArticulo: number): void {
    this.oArticuloService.get(idArticulo).subscribe({
      next: (articulo) => this.selectedArticulo.set(articulo),
      error: () => this.selectedArticulo.set(null),
    });
  }

  private loadFactura(idFactura: number): void {
    this.oFacturaService.get(idFactura).subscribe({
      next: (factura) => this.selectedFactura.set(factura),
      error: () => this.selectedFactura.set(null),
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
    if (compra.articulo?.id) this.loadArticulo(compra.articulo.id);
    if (compra.factura?.id) this.loadFactura(compra.factura.id);
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

  openArticuloFinderModal(): void {
    const ref = this.modalService.open<unknown, IArticulo | null>(ArticuloPlistFinder);
    ref.afterClosed$.subscribe((articulo: IArticulo | null) => {
      if (articulo?.id != null) {
        this.compraForm.patchValue({ id_articulo: articulo.id });
        this.selectedArticulo.set(articulo);
        this.notificacion.success(`Artículo seleccionado: ${articulo.descripcion}`);
      }
    });
  }

  openFacturaFinderModal(): void {
    const ref = this.modalService.open<unknown, IFactura | null>(FacturaPlistFinder);
    ref.afterClosed$.subscribe((factura: IFactura | null) => {
      if (factura?.id != null) {
        this.compraForm.patchValue({ id_factura: factura.id });
        this.selectedFactura.set(factura);
        this.notificacion.success(`Factura seleccionada: #${factura.id}`);
      }
    });
  }

  onSubmit(): void {
    if (this.compraForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
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
          this.notificacion.info('Compra actualizada exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la compra');
          this.notificacion.error('Error actualizando la compra');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCompraService.create(compraData).subscribe({
        next: () => {
          this.notificacion.info('Compra creada exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la compra');
          this.notificacion.error('Error creando la compra');
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
