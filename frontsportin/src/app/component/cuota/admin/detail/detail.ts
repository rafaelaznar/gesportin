import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CuotaService } from '../../../../service/cuota';
import { ICuota } from '../../../../model/cuota';

@Component({
  standalone: true,
  selector: 'app-cuota-admin-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CuotaAdminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private cuotaService = inject(CuotaService);

  oCuota = signal<ICuota | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idCuota = this.id();
    if (!idCuota || isNaN(idCuota)) {
      this.error.set('ID de cuota no válido');
      this.loading.set(false);
      return;
    }
    this.load(idCuota);
  }

  private load(id: number): void {
    this.cuotaService.get(id).subscribe({
      next: (data) => {
        this.oCuota.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la cuota');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
