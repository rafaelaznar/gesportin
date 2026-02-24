import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoticiaService } from '../../../service/noticia';
import { NoticiaFormUnrouted } from  '../form-unrouted/form-unrouted';

@Component({
  selector: 'app-noticia-new-admin-routed',
  imports: [CommonModule, NoticiaFormUnrouted],
  templateUrl: './noticia-new.html',
  styleUrl: './noticia-new.css',
})
export class NoticiaNewAdminRouted {
  private router = inject(Router);
  private noticiaService = inject(NoticiaService);
  private snackBar = inject(MatSnackBar);

  submitting = signal(false);
  error = signal<string | null>(null);

  onFormSubmit(noticiaData: any): void {
    this.submitting.set(true);
    this.error.set(null);

    console.log('Data a enviar:', noticiaData);
    console.log('Fecha:', noticiaData.fecha);

    this.noticiaService.create(noticiaData).subscribe({
      next: (id: number) => {
        this.snackBar.open('Noticia creada exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/noticia']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error creando la noticia');
        this.snackBar.open('Error creando la noticia', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }

  onFormCancel(): void {
    this.router.navigate(['/noticia']);
  }
}
