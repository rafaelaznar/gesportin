import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LigaService } from '../../../service/liga';
import { ILiga } from '../../../model/liga';
import { LigaFormAdminUnrouted } from '../form-admin-unrouted/liga-form';

@Component({
  selector: 'app-liga-edit-routed',
  standalone: true,
  imports: [CommonModule, LigaFormAdminUnrouted],
  templateUrl: './liga-edit.html',
  styleUrl: './liga-edit.css',
})
export class LigaEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oLigaService = inject(LigaService);
  private snackBar = inject(MatSnackBar);

  liga = signal<ILiga | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de liga no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);

    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadLiga(id);
  }

  private loadLiga(id: number): void {
    this.oLigaService.get(id).subscribe({
      next: (liga: ILiga) => {
        this.liga.set(liga);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la liga');
        this.snackBar.open('Error cargando la liga', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/liga']);
  }

  onFormCancel(): void {
    this.router.navigate(['/liga']);
  }
}
