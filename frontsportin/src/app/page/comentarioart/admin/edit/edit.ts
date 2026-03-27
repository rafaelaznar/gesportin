import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComentarioartService } from '../../../../service/comentarioart';
import { IComentarioart } from '../../../../model/comentarioart';
import { ComentarioartAdminForm } from '../../../../component/comentarioart/admin/form/form';

@Component({
  selector: 'app-comentarioart-admin-edit-page',
  imports: [CommonModule, ComentarioartAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class ComentarioartAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comentarioartService = inject(ComentarioartService);
  private snackBar = inject(MatSnackBar);

  id_comentarioart = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  comentarioart = signal<IComentarioart | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || idParam === '0') {
      this.error.set('ID de comentario de artículo no válido');
      this.loading.set(false);
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID de comentario de artículo no válido');
      this.loading.set(false);
      return;
    }
    this.id_comentarioart.set(id);
    this.loadComentarioart();
  }

  private loadComentarioart(): void {
    this.comentarioartService.get(this.id_comentarioart()).subscribe({
      next: (data) => {
        this.comentarioart.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando el comentario de artículo');
        this.snackBar.open('Error cargando el comentario de artículo', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/comentarioart']);
  }

  onFormCancel(): void {
    this.router.navigate(['/comentarioart']);
  }
}
