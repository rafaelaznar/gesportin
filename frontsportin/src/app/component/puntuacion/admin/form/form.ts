import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ModalService } from '../../../shared/modal/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PuntuacionService } from '../../../../service/puntuacion';
import { NoticiaService } from '../../../../service/noticia';
import { UsuarioService } from '../../../../service/usuarioService';
import { IPuntuacion } from '../../../../model/puntuacion';
import { INoticia } from '../../../../model/noticia';
import { IUsuario } from '../../../../model/usuario';
import { NoticiaPlistFinder } from '../../../noticia/finder/plist';
import { UsuarioPlistFinder } from '../../../usuario/finder/plist';

@Component({
  standalone: true,
  selector: 'app-puntuacion-admin-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class PuntuacionAdminForm implements OnInit {
  @Input() puntuacion: IPuntuacion | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSuccess = new EventEmitter<void>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private modalService = inject(ModalService);
  private oPuntuacionService = inject(PuntuacionService);
  private oNoticiaService = inject(NoticiaService);
  private oUsuarioService = inject(UsuarioService);

  puntuacionForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedNoticia = signal<INoticia | null>(null);
  selectedUsuario = signal<IUsuario | null>(null);

  constructor() {
    effect(() => {
      const p = this.puntuacion;
      if (p && this.puntuacionForm) {
        this.loadPuntuacionData(p);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();

    if (this.puntuacion) {
      this.loadPuntuacionData(this.puntuacion);
    }
  }

  private initForm(): void {
    this.puntuacionForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      puntuacion: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      id_noticia: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadPuntuacionData(puntuacion: IPuntuacion): void {
    const noticiaId = puntuacion.noticia?.id ?? null;
    const usuarioId = puntuacion.usuario?.id ?? null;

    this.puntuacionForm.patchValue({
      id: puntuacion.id ?? 0,
      puntuacion: puntuacion.puntuacion ?? 0,
      id_noticia: noticiaId,
      id_usuario: usuarioId,
    });

    if (noticiaId) {
      this.loadNoticia(noticiaId);
    }

    if (usuarioId) {
      this.loadUsuario(usuarioId);
    }
  }

  private loadNoticia(idNoticia: number): void {
    this.oNoticiaService.getById(idNoticia).subscribe({
      next: (noticia) => this.selectedNoticia.set(noticia),
      error: () => this.selectedNoticia.set(null),
    });
  }

  private loadUsuario(idUsuario: number): void {
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario) => this.selectedUsuario.set(usuario),
      error: () => this.selectedUsuario.set(null),
    });
  }

  openNoticiaFinderModal(): void {
    const ref = this.modalService.open<unknown, INoticia | null>(NoticiaPlistFinder);
    ref.afterClosed$.subscribe((noticia: INoticia | null) => {
      if (noticia?.id != null) {
        this.puntuacionForm.patchValue({ id_noticia: noticia.id });
        this.selectedNoticia.set(noticia);
        this.notificacion.success(`Noticia seleccionada: ${noticia.titulo}`);
      }
    });
  }

  openUsuarioFinderModal(): void {
    const ref = this.modalService.open<unknown, IUsuario | null>(UsuarioPlistFinder);
    ref.afterClosed$.subscribe((usuario: IUsuario | null) => {
      if (usuario?.id != null) {
        this.puntuacionForm.patchValue({ id_usuario: usuario.id });
        this.selectedUsuario.set(usuario);
        this.notificacion.success(`Usuario seleccionado: ${usuario.nombre} ${usuario.apellido1}`);
      }
    });
  }

  get puntuacionControl() {
    return this.puntuacionForm.get('puntuacion');
  }

  get id_noticia() {
    return this.puntuacionForm.get('id_noticia');
  }

  get id_usuario() {
    return this.puntuacionForm.get('id_usuario');
  }

  onSubmit(): void {
    if (this.puntuacionForm.invalid) {
      this.notificacion.success('Por favor, complete todos los campos correctamente');
      return;
    }

    this.submitting.set(true);

    const puntuacionData: any = {
      puntuacion: this.puntuacionForm.value.puntuacion,
      noticia: { id: Number(this.puntuacionForm.value.id_noticia) },
      usuario: { id: Number(this.puntuacionForm.value.id_usuario) },
    };

    if (this.isEditMode && this.puntuacion?.id) {
      puntuacionData.id = this.puntuacion.id;
      this.oPuntuacionService.update(puntuacionData).subscribe({
        next: () => {
          this.notificacion.success('Puntuación actualizada exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la puntuación');
          this.notificacion.error('Error actualizando la puntuación');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oPuntuacionService.create(puntuacionData).subscribe({
        next: () => {
          this.notificacion.success('Puntuación creada exitosamente');
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la puntuación');
          this.notificacion.error('Error creando la puntuación');
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
