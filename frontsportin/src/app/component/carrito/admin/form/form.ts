import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CarritoService } from '../../../../service/carrito';
import { ArticuloService } from '../../../../service/articulo';
import { UsuarioService } from '../../../../service/usuarioService';
import { ICarrito } from '../../../../model/carrito';
import { IArticulo } from '../../../../model/articulo';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-carrito-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class CarritoAdminForm implements OnInit {
  @Input() carrito: ICarrito | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private oCarritoService = inject(CarritoService);
  private oArticuloService = inject(ArticuloService);
  private oUsuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);
  private sessionService = inject(SessionService);

  carritoForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  articulos = signal<IArticulo[]>([]);
  usuarios = signal<IUsuario[]>([]);

  constructor() {
    effect(() => {
      const c = this.carrito;
      if (c && this.carritoForm) {
        this.loadCarritoData(c);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadArticulos();
    this.loadUsuarios();

    if (this.carrito) {
      this.loadCarritoData(this.carrito);
    }
  }

  private initForm(): void {
    this.carritoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      cantidad: [0, [Validators.required, Validators.min(1)]],
      id_articulo: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadCarritoData(carrito: ICarrito): void {
    this.carritoForm.patchValue({
      id: carrito.id,
      cantidad: carrito.cantidad,
      id_articulo: carrito.articulo?.id,
      id_usuario: carrito.usuario?.id,
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

  private loadUsuarios(): void {
    this.oUsuarioService.getPage(0, 1000, 'nombre', 'asc', '').subscribe({
      next: (page) => {
        this.usuarios.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 3000 });
      },
    });
  }

  get cantidad() {
    return this.carritoForm.get('cantidad');
  }

  get id_articulo() {
    return this.carritoForm.get('id_articulo');
  }

  get id_usuario() {
    return this.carritoForm.get('id_usuario');
  }

  onSubmit(): void {
    if (this.carritoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const carritoData: any = {
      cantidad: Number(this.carritoForm.value.cantidad),
      articulo: { id: Number(this.carritoForm.value.id_articulo) },
      usuario: { id: Number(this.carritoForm.value.id_usuario) },
    };

    if (this.isEditMode && this.carrito?.id) {
      carritoData.id = this.carrito.id;
      this.oCarritoService.update(carritoData).subscribe({
        next: () => {
          this.snackBar.open('Carrito actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el carrito');
          this.snackBar.open('Error actualizando el carrito', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCarritoService.create(carritoData).subscribe({
        next: () => {
          this.snackBar.open('Carrito creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el carrito');
          this.snackBar.open('Error creando el carrito', 'Cerrar', { duration: 4000 });
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
