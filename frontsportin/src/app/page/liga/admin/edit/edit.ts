import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LigaService } from '../../../../service/liga';
import { ILiga } from '../../../../model/liga';
import { LigaAdminForm } from '../../../../component/liga/admin/form/form';

@Component({
  selector: 'app-liga-admin-edit-page',
  imports: [CommonModule, LigaAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class LigaAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ligaService = inject(LigaService);
  private snackBar = inject(MatSnackBar);

  id_liga = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  liga = signal<ILiga | null>(null);

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

    this.id_liga.set(id);
    this.loadLiga();
  }

  private loadLiga(): void {
    this.ligaService.get(this.id_liga()).subscribe({
      next: (data: ILiga) => {
        this.liga.set(data);
        this.loading.set(false);
      },
      error: (err) => {
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
