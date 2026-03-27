import { Component, OnInit, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ComentarioartService } from '../../../../service/comentarioart';
import { ArticuloService } from '../../../../service/articulo';
import { UsuarioService } from '../../../../service/usuarioService';
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
  private snackBar = inject(MatSnackBar);
  private oComentarioartService = inject(ComentarioartService);
  private oArticuloService = inject(ArticuloService);
  private oUsuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);
  private sessionService = inject(SessionService);

  comentarioartForm!: FormGroup;
  error = signal<string | null>(null);
  submitting = signal(false);
  articulos = signal<IArticulo[]>([]);
  usuarios = signal<IUsuario[]>([]);

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
    this.loadArticulos();
    this.loadUsuarios();

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
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
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
          this.snackBar.open('Comentario actualizado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error actualizando el comentario');
          this.snackBar.open('Error actualizando el comentario', 'Cerrar', { duration: 4000 });
          console.error(err);
          this.submitting.set(false);
        },
      });
    } else {
      this.oComentarioartService.create(comentarioartData).subscribe({
        next: () => {
          this.snackBar.open('Comentario creado exitosamente', 'Cerrar', { duration: 4000 });
          this.submitting.set(false);
          this.formSuccess.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.error.set('Error creando el comentario');
          this.snackBar.open('Error creando el comentario', 'Cerrar', { duration: 4000 });
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
