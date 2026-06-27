import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../../service/notificacion';
import { ClubService } from '../../../../service/club';
import { IClub } from '../../../../model/club';
import { ClubAdminForm } from '../../../../component/club/admin/form/form';

@Component({
  selector: 'app-club-admin-edit-page',
  imports: [CommonModule, ClubAdminForm],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class ClubAdminEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clubService = inject(ClubService);
  private notificacion = inject(NotificacionService);

  id_club = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  club = signal<IClub | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de club no válido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.id_club.set(id);
    this.loadClub();
  }

  private loadClub(): void {
    this.clubService.get(this.id_club()).subscribe({
      next: (c: IClub) => {
        this.club.set(c);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el club');
        this.notificacion.error('Error cargando el club');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onFormSuccess(): void {
    this.router.navigate(['/club']);
  }

  onFormCancel(): void {
    this.router.navigate(['/club']);
  }
}