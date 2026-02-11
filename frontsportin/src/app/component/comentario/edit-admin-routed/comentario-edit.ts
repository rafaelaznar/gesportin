import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComentarioService } from '../../../service/comentario';
import { IComentario } from '../../../model/comentario';

@Component({
  selector: 'app-comentario-edit-routed',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './comentario-edit.html',
  styleUrl: './comentario-edit.css',
})
export class ComentarioEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oComentarioService = inject(ComentarioService);
  private snackBar = inject(MatSnackBar);

  comentarioForm!: FormGroup;
  id_comentario = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de comentario no válido');
      this.loading.set(false);
      return;
    }

    this.id_comentario.set(Number(idParam));

    if (isNaN(this.id_comentario())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadComentario();
  }

  private initForm(): void {
    this.comentarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      contenido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      id_usuario: [null, [Validators.required]],
      id_noticia: [null, [Validators.required]],
    });
  }

  private loadComentario(): void {
    this.oComentarioService.get(this.id_comentario()).subscribe({
      next: (comentario: IComentario) => {
        this.comentarioForm.patchValue({
          id: comentario.id,
          contenido: comentario.contenido ?? '',
          id_usuario: comentario.usuario?.id ?? null,
          id_noticia: comentario.noticia?.id ?? null,
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        this.snackBar.open('Error cargando el comentario', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.comentarioForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const comentarioData: IComentario = {
      id: this.id_comentario(),
      contenido: this.comentarioForm.value.contenido,
      usuario: { id: this.comentarioForm.value.id_usuario } as any,
      noticia: { id: this.comentarioForm.value.id_noticia } as any,
    };

    this.oComentarioService.update(comentarioData).subscribe({
      next: () => {
        this.snackBar.open('Comentario actualizado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/comentario']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando el comentario');
        this.snackBar.open('Error actualizando el comentario', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  get contenido() {
    return this.comentarioForm.get('contenido');
  }

  get id_usuario() {
    return this.comentarioForm.get('id_usuario');
  }

  get id_noticia() {
    return this.comentarioForm.get('id_noticia');
  }
}