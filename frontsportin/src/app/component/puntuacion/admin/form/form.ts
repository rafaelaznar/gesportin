import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { PuntuacionService } from '../../../../service/puntuacion';
import { NoticiaService } from '../../../../service/noticia';
import { UsuarioService } from '../../../../service/usuarioService';
import { IPuntuacion } from '../../../../model/puntuacion';
import { INoticia } from '../../../../model/noticia';
import { IUsuario } from '../../../../model/usuario';
import { NoticiaAdminPlist } from '../../../noticia/admin/plist/plist';
import { UsuarioPlistAdminUnrouted } from '../../../usuario/plist-admin-unrouted/usuario-plist-admin-unrouted';

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
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private oPuntuacionService = inject(PuntuacionService);
  private oNoticiaService = inject(NoticiaService);
  private oUsuarioService = inject(UsuarioService);

  puntuacionForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitting = signal(false);
  noticias = signal<INoticia[]>([]);
  usuarios = signal<IUsuario[]>([]);
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
    this.loadNoticias();
    this.loadUsuarios();

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

    this.puntuacionForm.get('id_noticia')?.valueChanges.subscribe((id) => {
      if (id) {
        this.syncNoticia(Number(id));
      }
    });

    this.puntuacionForm.get('id_usuario')?.valueChanges.subscribe((id) => {
      if (id) {
        this.syncUsuario(Number(id));
      }
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
      this.syncNoticia(noticiaId);
    }

    if (usuarioId) {
      this.syncUsuario(usuarioId);
    }
  }

  private loadNoticias(): void {
    this.oNoticiaService.getPage(0, 1000, 'titulo', 'asc', '', 0).subscribe({
      next: (page) => {
        this.noticias.set(page.content);
        const idActual = this.puntuacionForm.get('id_noticia')?.value;
        if (idActual) {
          this.syncNoticia(Number(idActual));
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando noticias', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  private loadUsuarios(): void {
    this.oUsuarioService.getPage(0, 1000, 'nombre', 'asc', '', 0, 0, 0).subscribe({
      next: (page) => {
        this.usuarios.set(page.content);
        const idActual = this.puntuacionForm.get('id_usuario')?.value;
        if (idActual) {
          this.syncUsuario(Number(idActual));
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  private syncNoticia(idNoticia: number): void {
    const seleccionada = this.noticias().find((n) => n.id === idNoticia) || null;
    this.selectedNoticia.set(seleccionada);
  }

  private syncUsuario(idUsuario: number): void {
    const seleccionado = this.usuarios().find((u) => u.id === idUsuario) || null;
    this.selectedUsuario.set(seleccionado);
  }

  openNoticiaFinderModal(): void {
    const dialogRef = this.dialog.open(NoticiaAdminPlist, {
      height: '800px', width: '1100px', maxWidth: '95vw', panelClass: 'noticia-dialog',
      data: { title: 'Elegir noticia', message: 'Seleccione la noticia para la puntuación' }
    });

    dialogRef.afterClosed().subscribe((noticia: INoticia | null) => {
      if (noticia) {
        this.puntuacionForm.patchValue({ id_noticia: noticia.id });
        this.syncNoticia(noticia.id);
        this.snackBar.open(`Noticia seleccionada: ${noticia.titulo}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  openUsuarioFinderModal(): void {
    const dialogRef = this.dialog.open(UsuarioPlistAdminUnrouted, {
      height: '800px', width: '1100px', maxWidth: '95vw', panelClass: 'usuario-dialog',
      data: { title: 'Elegir usuario', message: 'Seleccione el usuario para la puntuación' }
    });

    dialogRef.afterClosed().subscribe((usuario: IUsuario | null) => {
      if (usuario) {
        this.puntuacionForm.patchValue({ id_usuario: usuario.id });
        this.syncUsuario(usuario.id);
        this.snackBar.open(`Usuario seleccionado: ${usuario.nombre}`, 'Cerrar', { duration: 3000 });
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
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
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
          this.snackBar.open('Puntuación actualizada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando la puntuación');
          this.snackBar.open('Error actualizando la puntuación', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oPuntuacionService.create(puntuacionData).subscribe({
        next: () => {
          this.snackBar.open('Puntuación creada exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando la puntuación');
          this.snackBar.open('Error creando la puntuación', 'Cerrar', { duration: 4000 });
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
