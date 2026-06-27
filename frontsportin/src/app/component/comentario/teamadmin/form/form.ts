import { Component, OnInit, inject, signal, computed, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ComentarioService } from '../../../../service/comentario';
import { UsuarioService } from '../../../../service/usuarioService';
import { NoticiaService } from '../../../../service/noticia';
import { IComentario } from '../../../../model/comentario';
import { IUsuario } from '../../../../model/usuario';
import { SessionService } from '../../../../service/session';
import { NoticiaTeamadminEmbedded } from '../../../noticia/teamadmin/embedded/embedded';

@Component({
  selector: 'app-comentario-teamadmin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NoticiaTeamadminEmbedded],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class ComentarioTeamadminForm implements OnInit {
  id = input<number>(0);
  returnUrl = input<string>('/comentario/teamadmin');
  idNoticia = input<number>(0);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);
  private oComentarioService = inject(ComentarioService);
  private oUsuarioService = inject(UsuarioService);
  private oNoticiaService = inject(NoticiaService);
  sessionService = inject(SessionService);

  comentarioForm!: FormGroup;
  error = signal<string | null>(null);
  loading = signal<boolean>(false);
  submitting = signal(false);
  currentUser = signal<IUsuario | null>(null);
  noticiaTitle = signal<string>('');

  maxChars = 1000;
  charsLeft = computed(() => {
    const val = this.comentarioForm?.get('contenido')?.value || '';
    return this.maxChars - val.length;
  });

  ngOnInit(): void {
    this.initForm();

    if (this.id() > 0) {
      this.loadById(this.id());
    } else {
      const userId = this.sessionService.getUserId();
      if (userId) {
        this.comentarioForm.patchValue({ id_usuario: userId });
        this.oUsuarioService.get(userId).subscribe({
          next: (usuario) => this.currentUser.set(usuario),
          error: () => {},
        });
      }
      if (this.idNoticia() > 0) {
        this.comentarioForm.patchValue({ id_noticia: this.idNoticia() });
        this.oNoticiaService.getById(this.idNoticia()).subscribe({
          next: (noticia) => this.noticiaTitle.set(noticia.titulo),
          error: () => {},
        });
      }
      this.loading.set(false);
    }
  }

  private initForm(): void {
    this.comentarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      contenido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(this.maxChars)]],
      id_usuario: [null],
      id_noticia: [null, Validators.required],
    });
  }

  private loadById(id: number): void {
    this.loading.set(true);
    this.oComentarioService.get(id).subscribe({
      next: (data: IComentario) => {
        this.comentarioForm.patchValue({
          id: data.id,
          contenido: data.contenido ?? '',
          id_usuario: data.usuario?.id ?? null,
          id_noticia: data.noticia?.id ?? null,
        });
        if (data.noticia?.id) {
          this.noticiaTitle.set(data.noticia.titulo);
        }
        if (data.usuario?.id) {
          this.oUsuarioService.get(data.usuario.id).subscribe({
            next: (usuario) => this.currentUser.set(usuario),
            error: () => {},
          });
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el registro');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  get contenido() { return this.comentarioForm.get('contenido'); }

  onSubmit(): void {
    if (this.comentarioForm.invalid) {
      this.notificacion.success('Por favor, complete el comentario');
      return;
    }

    this.submitting.set(true);

    const comentarioData: any = {
      contenido: this.comentarioForm.value.contenido,
      usuario: { id: Number(this.comentarioForm.value.id_usuario) },
      noticia: { id: Number(this.comentarioForm.value.id_noticia) },
    };

    if (this.id() > 0) {
      comentarioData.id = this.id();
      this.oComentarioService.update(comentarioData).subscribe({
        next: () => {
          this.notificacion.success('Comentario actualizado exitosamente');
          this.submitting.set(false);
          this.router.navigate([this.returnUrl()]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el comentario');
          this.notificacion.error('Error al actualizar el comentario');
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oComentarioService.create(comentarioData).subscribe({
        next: () => {
          this.notificacion.success('Comentario creado exitosamente');
          this.submitting.set(false);
          const idNoticia = this.idNoticia();
          if (idNoticia > 0) {
            this.router.navigate(['/comentario/teamadmin/noticia', idNoticia]);
          } else {
            this.router.navigate([this.returnUrl()]);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el comentario');
          this.notificacion.error('Error al crear el comentario');
          console.error(err);
          this.submitting.set(false);
        },
      });
    }
  }

  onCancel(): void {
    const idNoticia = this.idNoticia();
    if (idNoticia > 0) {
      this.router.navigate(['/comentario/teamadmin/noticia', idNoticia]);
    } else {
      this.router.navigate([this.returnUrl()]);
    }
  }
}
