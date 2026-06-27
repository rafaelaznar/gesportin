import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ComentarioService } from '../../../../service/comentario';
import { UsuarioService } from '../../../../service/usuarioService';
import { NoticiaService } from '../../../../service/noticia';
import { IComentario } from '../../../../model/comentario';
import { IUsuario } from '../../../../model/usuario';
import { INoticia } from '../../../../model/noticia';
import { UsuarioPlistFinder } from '../../../usuario/finder/plist';
import { NoticiaAdminPlist } from '../../../noticia/admin/plist/plist';

@Component({
  standalone: true,
  selector: 'app-comentario-admin-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class ComentarioAdminForm implements OnInit {
  @Input() comentario: IComentario | null = null;
  @Input() isEditMode = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private modalService = inject(ModalService);
  private oComentarioService = inject(ComentarioService);
  private oUsuarioService = inject(UsuarioService);
  private oNoticiaService = inject(NoticiaService);

  comentarioForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedUsuario = signal<IUsuario | null>(null);
  selectedNoticia = signal<INoticia | null>(null);

  constructor() {
    effect(() => {
      const c = this.comentario;
      if (c && this.comentarioForm) {
        this.loadComentarioData(c);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    if (this.comentario) {
      this.loadComentarioData(this.comentario);
    }
  }

  private initForm(): void {
    this.comentarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      contenido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      id_usuario: [null, [Validators.required]],
      id_noticia: [null, [Validators.required]],
    });
  }

  private loadComentarioData(comentario: IComentario): void {
    this.comentarioForm.patchValue({
      id: comentario.id,
      contenido: comentario.contenido ?? '',
      id_usuario: comentario.usuario?.id ?? null,
      id_noticia: comentario.noticia?.id ?? null,
    });
    if (comentario.usuario?.id) {
      this.syncUsuario(comentario.usuario.id);
    }
    if (comentario.noticia?.id) {
      this.syncNoticia(comentario.noticia.id);
    }
  }

  private syncUsuario(idUsuario: number | null): void {
    if (!idUsuario) { this.selectedUsuario.set(null); return; }
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => this.selectedUsuario.set(usuario),
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.notificacion.error('Error al cargar el usuario seleccionado');
        this.selectedUsuario.set(null);
      }
    });
  }

  private syncNoticia(idNoticia: number | null): void {
    if (!idNoticia) { this.selectedNoticia.set(null); return; }
    this.oNoticiaService.getById(idNoticia).subscribe({
      next: (noticia) => this.selectedNoticia.set(noticia),
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.notificacion.error('Error al cargar la noticia seleccionada');
        this.selectedNoticia.set(null);
      }
    });
  }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioPlistFinder);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario) {
        this.comentarioForm.patchValue({ id_usuario: usuario.id });
        this.syncUsuario(usuario.id);
        this.notificacion.success(`Usuario seleccionado: ${usuario.nombre}`);
      }
    });
  }

  openNoticiaFinderModal(): void {
    const ref = this.modalService.open<unknown, INoticia | null>(NoticiaAdminPlist);
    ref.afterClosed$.subscribe((noticia: INoticia | null) => {
      if (noticia) {
        this.comentarioForm.patchValue({ id_noticia: noticia.id });
        this.syncNoticia(noticia.id);
        this.notificacion.success(`Noticia seleccionada: ${noticia.titulo}`);
      }
    });
  }

  get contenido() { return this.comentarioForm.get('contenido'); }
  get id_usuario() { return this.comentarioForm.get('id_usuario'); }
  get id_noticia() { return this.comentarioForm.get('id_noticia'); }

  onSubmit(): void {
    if (this.comentarioForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const comentarioData: any = {
      contenido: this.comentarioForm.value.contenido,
      usuario: { id: Number(this.comentarioForm.value.id_usuario) },
      noticia: { id: Number(this.comentarioForm.value.id_noticia) },
    };

    if (this.isEditMode && this.comentario?.id) {
      comentarioData.id = this.comentario.id;
      this.oComentarioService.update(comentarioData).subscribe({
        next: () => { this.notificacion.success('Comentario actualizado exitosamente'); this.submitting.set(false); this.formSuccess.emit(); },
        error: (err: HttpErrorResponse) => { this.error.set('Error actualizando el comentario'); this.notificacion.error('Error actualizando el comentario'); console.error(err); this.submitting.set(false); }
      });
    } else {
      this.oComentarioService.create(comentarioData).subscribe({
        next: () => { this.notificacion.success('Comentario creado exitosamente'); this.submitting.set(false); this.formSuccess.emit(); },
        error: (err: HttpErrorResponse) => { this.error.set('Error creando el comentario'); this.notificacion.error('Error creando el comentario'); console.error(err); this.submitting.set(false); }
      });
    }
  }

  onCancel(): void { this.formCancel.emit(); }
}
