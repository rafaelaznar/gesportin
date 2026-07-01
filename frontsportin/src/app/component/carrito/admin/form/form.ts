import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';;
import { ModalService } from '../../../shared/modal/modal.service';
import { CarritoService } from '../../../../service/carrito';
import { ArticuloService } from '../../../../service/articulo';
import { UsuarioService } from '../../../../service/usuarioService';
import { ICarrito } from '../../../../model/carrito';
import { IArticulo } from '../../../../model/articulo';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';
import { ArticuloPlistFinder } from '../../../articulo/finder/plist';
import { UsuarioPlistFinder } from '../../../usuario/finder/plist';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
  private notificacion = inject(NotificacionService);
  private oCarritoService = inject(CarritoService);
  private oArticuloService = inject(ArticuloService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  carritoForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedArticulo = signal<IArticulo | null>(null);
  selectedUsuario = signal<IUsuario | null>(null);
  articuloError = signal(false);
  usuarioError = signal(false);

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

    this.carritoForm.get('id_articulo')?.valueChanges.pipe(debounceTime(800), distinctUntilChanged()).subscribe((id) => {
      if (id) { const n = typeof id === 'string' ? parseInt(id, 10) : id; if (!isNaN(n)) this.loadArticulo(n); }
      else { this.selectedArticulo.set(null); this.articuloError.set(false); }
    });

    this.carritoForm.get('id_usuario')?.valueChanges.pipe(debounceTime(800), distinctUntilChanged()).subscribe((id) => {
      if (id) { const n = typeof id === 'string' ? parseInt(id, 10) : id; if (!isNaN(n)) this.loadUsuario(n); }
      else { this.selectedUsuario.set(null); this.usuarioError.set(false); }
    });
  }

  private loadCarritoData(carrito: ICarrito): void {
    this.carritoForm.patchValue({
      id: carrito.id,
      cantidad: carrito.cantidad,
      id_articulo: carrito.articulo?.id,
      id_usuario: carrito.usuario?.id,
    });
    if (carrito.articulo?.id) this.loadArticulo(carrito.articulo.id);
    if (carrito.usuario?.id) this.loadUsuario(carrito.usuario.id);
  }

  private loadArticulo(idArticulo: number): void {
    this.articuloError.set(false);
    this.oArticuloService.get(idArticulo).subscribe({
      next: (articulo) => {
        this.selectedArticulo.set(articulo);
        this.articuloError.set(false);
        if (this.id_articulo?.hasError('notFound')) {
          const errors = { ...this.id_articulo.errors };
          delete (errors as any)['notFound'];
          this.id_articulo?.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      },
      error: () => { this.selectedArticulo.set(null); this.articuloError.set(true); this.id_articulo?.setErrors({ notFound: true }); },
    });
  }

  private loadUsuario(idUsuario: number): void {
    this.usuarioError.set(false);
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => {
        this.selectedUsuario.set(usuario);
        this.usuarioError.set(false);
        if (this.id_usuario?.hasError('notFound')) {
          const errors = { ...this.id_usuario.errors };
          delete (errors as any)['notFound'];
          this.id_usuario?.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      },
      error: () => { this.selectedUsuario.set(null); this.usuarioError.set(true); this.id_usuario?.setErrors({ notFound: true }); },
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

  openArticuloFinderModal(): void {
    // Filtrar artículos del mismo club que el usuario seleccionado
    const usuario = this.selectedUsuario();
    const idClub = usuario?.club?.id;
    const config = idClub ? { data: { id_club: idClub } } : undefined;
    const ref = this.modalService.open<unknown, IArticulo | null>(ArticuloPlistFinder, config);
    ref.afterClosed$.subscribe((articulo: IArticulo | null) => {
      if (articulo?.id != null) {
        this.carritoForm.patchValue({ id_articulo: articulo.id });
        this.selectedArticulo.set(articulo);
        this.notificacion.success(`Artículo seleccionado: ${articulo.descripcion}`);
      }
    });
  }

  openUsuarioFinderModal(): void {
    // Filtrar usuarios del mismo club que el artículo seleccionado
    const articulo = this.selectedArticulo();
    const idClub = articulo?.tipoarticulo?.club?.id;
    const config = idClub ? { data: { id_club: idClub } } : undefined;
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioPlistFinder, config);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario?.id != null) {
        this.carritoForm.patchValue({ id_usuario: usuario.id });
        this.selectedUsuario.set(usuario);
        this.notificacion.success(`Usuario seleccionado: ${usuario.nombre} ${usuario.apellido1}`);
      }
    });
  }

  onSubmit(): void {
    if (this.carritoForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
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
          this.notificacion.info('Carrito actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el carrito');
          this.notificacion.error('Error actualizando el carrito');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oCarritoService.create(carritoData).subscribe({
        next: () => {
          this.notificacion.info('Carrito creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el carrito');
          this.notificacion.error('Error creando el carrito');
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
