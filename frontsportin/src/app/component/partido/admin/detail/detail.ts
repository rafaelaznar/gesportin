import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PartidoService } from '../../../../service/partido';
import { IPartido } from '../../../../model/partido';

@Component({
  standalone: true,
  selector: 'app-partido-admin-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class PartidoAdminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private partidoService = inject(PartidoService);

  oPartido = signal<IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idPartido = this.id();
    if (!idPartido || isNaN(idPartido)) {
      this.error.set('ID de partido no válido');
      this.loading.set(false);
      return;
    }
    this.load(idPartido);
  }

  private load(id: number): void {
    this.partidoService.get(id).subscribe({
      next: (data) => {
        this.oPartido.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el partido');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
