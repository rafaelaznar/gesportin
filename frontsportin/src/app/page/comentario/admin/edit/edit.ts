import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComentarioService } from '../../../../service/comentario';
import { IComentario } from '../../../../model/comentario';
import { ComentarioAdminForm } from '../../../../component/comentario/admin/form/form';

@Component({
  selector: 'app-comentario-admin-edit-page',
  imports: [CommonModule, ComentarioAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class ComentarioAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comentarioService = inject(ComentarioService);
  private snackBar = inject(MatSnackBar);

  id_comentario = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  comentario = signal<IComentario | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de comentario no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.id_comentario.set(id);
    this.loadComentario();
  }

  private loadComentario(): void {
    this.comentarioService.get(this.id_comentario()).subscribe({
      next: (c: IComentario) => {
        this.comentario.set(c);
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

  onFormSuccess(): void {
    this.router.navigate(['/comentario']);
  }

  onFormCancel(): void {
    this.router.navigate(['/comentario']);
  }
}
