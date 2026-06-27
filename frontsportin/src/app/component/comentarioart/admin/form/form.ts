import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';;
import { ModalService } from '../../../shared/modal/modal.service';
import { ComentarioartService } from '../../../../service/comentarioart';
import { ArticuloService } from '../../../../service/articulo';
import { UsuarioService } from '../../../../service/usuarioService';
import { ArticuloAdminPlist } from '../../../articulo/admin/plist/plist';
import { UsuarioPlistFinder } from '../../../usuario/finder/plist';
import { IComentarioart } from '../../../../model/comentarioart';
import { IArticulo } from '../../../../model/articulo';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';

@Component({
  selector: 'app-comentarioart-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class ComentarioartAdminForm implements OnInit {
  @Input() comentarioart: IComentarioart | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oComentarioartService = inject(ComentarioartService);
  private oArticuloService = inject(ArticuloService);
  private oUsuarioService = inject(UsuarioService);
  private modalService = inject(ModalService);
  private sessionService = inject(SessionService);

  comentarioartForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedArticulo = signal<IArticulo | null>(null);
  selectedUsuario = signal<IUsuario | null>(null);

  constructor() {
    effect(() => {
      const c = this.comentarioart;
      if (c && this.comentarioartForm) {
        this.loadComentarioartData(c);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.comentarioart) {
      this.loadComentarioartData(this.comentarioart);
    }
  }

  private initForm(): void {
    this.comentarioartForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      contenido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      id_articulo: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadComentarioartData(comentarioart: IComentarioart): void {
    this.comentarioartForm.patchValue({
      id: comentarioart.id,
      contenido: comentarioart.contenido,
      id_articulo: comentarioart.articulo?.id || comentarioart.idArticulo,
      id_usuario: comentarioart.usuario?.id || comentarioart.idUsuario,
    });
    if (comentarioart.articulo?.id) {
      this.loadArticulo(comentarioart.articulo.id);
    }
    if (comentarioart.usuario?.id) {
      this.loadUsuario(comentarioart.usuario.id);
    }
  }

  private loadArticulo(idArticulo: number): void {
    this.oArticuloService.get(idArticulo).subscribe({
      next: (articulo) => this.selectedArticulo.set(articulo),
      error: () => this.selectedArticulo.set(null),
    });
  }

  private loadUsuario(idUsuario: number): void {
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => this.selectedUsuario.set(usuario),
      error: () => this.selectedUsuario.set(null),
    });
  }

  openArticuloFinderModal(): void {
    const ref = this.modalService.open<unknown, IArticulo | null>(ArticuloAdminPlist);
    ref.afterClosed$.subscribe((articulo: IArticulo | null) => {
      if (articulo?.id != null) {
        this.comentarioartForm.patchValue({ id_articulo: articulo.id });
        this.selectedArticulo.set(articulo);
        this.notificacion.success(`Artículo seleccionado: ${articulo.descripcion}`);
      }
    });
  }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioPlistFinder);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario?.id != null) {
        this.comentarioartForm.patchValue({ id_usuario: usuario.id });
        this.selectedUsuario.set(usuario);
        this.notificacion.success(`Usuario seleccionado: ${usuario.nombre} ${usuario.apellido1}`);
      }
    });
  }

  get contenido() {
    return this.comentarioartForm.get('contenido');
  }

  get id_articulo() {
    return this.comentarioartForm.get('id_articulo');
  }

  get id_usuario() {
    return this.comentarioartForm.get('id_usuario');
  }

  onSubmit(): void {
    if (this.comentarioartForm.invalid) {
      this.notificacion.info('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const comentarioartData: any = {
      contenido: this.comentarioartForm.value.contenido,
      articulo: { id: Number(this.comentarioartForm.value.id_articulo) },
      usuario: { id: Number(this.comentarioartForm.value.id_usuario) },
    };

    if (this.isEditMode && this.comentarioart?.id) {
      comentarioartData.id = this.comentarioart.id;
      this.oComentarioartService.update(comentarioartData).subscribe({
        next: () => {
          this.notificacion.info('Comentario actualizado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el comentario');
          this.notificacion.error('Error actualizando el comentario');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oComentarioartService.create(comentarioartData).subscribe({
        next: () => {
          this.notificacion.info('Comentario creado exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el comentario');
          this.notificacion.error('Error creando el comentario');
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
