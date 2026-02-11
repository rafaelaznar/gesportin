import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompraService } from '../../../service/compra';
import { ICompra } from '../../../model/compra';
import { ArticuloService } from '../../../service/articulo';
import { FacturaService } from '../../../service/factura-service';
import { IArticulo } from '../../../model/articulo';
import { IFactura } from '../../../model/factura';

@Component({
  selector: 'app-compra-edit-routed',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './compra-edit.html',
  styleUrl: './compra-edit.css',
})
export class CompraEditAdminRouted implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oCompraService = inject(CompraService);
  private oArticuloService = inject(ArticuloService);
  private oFacturaService = inject(FacturaService);
  private snackBar = inject(MatSnackBar);

  compraForm!: FormGroup;
  id_compra = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  articulos = signal<IArticulo[]>([]);
  facturas = signal<IFactura[]>([])


  ngOnInit(): void {
    this.initForm();
    this.loadArticulo();
    this.loadFactura();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de artículo no válido');
      this.loading.set(false);
      return;
    }

    this.id_compra.set(Number(idParam));

    if (isNaN(this.id_compra())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadCompra();
  }

  private initForm(): void {
    this.compraForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      cantidad: [0, [Validators.required, Validators.min(0)]],  
      precio: [0, [Validators.required, Validators.min(0)]],
      id_articulo: [null, Validators.required],
      id_factura: [null, Validators.required]
    });
  }

  private loadCompra(): void {
    this.oCompraService.get(this.id_compra()).subscribe({
      next: (compra: ICompra) => {
        this.compraForm.patchValue({
          id: compra.id,
          cantidad: compra.cantidad,
          precio: compra.precio,
          id_articulo: compra.articulo.id,
          id_factura: compra.factura.id
          
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el artículo');
        this.snackBar.open('Error cargando el artículo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  private loadArticulo(): void {
    this.oArticuloService.getPage(0, 1000, 'descripcion', 'asc').subscribe({
      next: (page) => {
        this.articulos.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando  artículos', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  private loadFactura(): void {
    this.oFacturaService.getPage(0, 1000, 'id', 'asc').subscribe({
      next: (page) => {
        this.facturas.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando  facturas', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
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

  limitDecimalPlaces(event: Event, fieldName: string, maxDecimals: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1] && parts[1].length > maxDecimals) {
        const truncatedValue = parseFloat(value).toFixed(maxDecimals);
        this.compraForm.get(fieldName)?.setValue(parseFloat(truncatedValue), { emitEvent: false });
        input.value = truncatedValue;
      }
    }
  }

  onSubmit(): void {
    if (this.compraForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const compraData: any = {
      id: this.id_compra(),
      cantidad: this.compraForm.value.cantidad,
      precio: this.compraForm.value.precio,
      articulo: { id: this.compraForm.value.id_articulo },
      factura: { id: this.compraForm.value.id_factura }
    };

    this.oCompraService.update(compraData).subscribe({
      next: (id: number) => {
        this.snackBar.open('compra actualizada exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/compra']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando la compra');
        this.snackBar.open('Error actualizando la compra', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      }
    });
  }
}