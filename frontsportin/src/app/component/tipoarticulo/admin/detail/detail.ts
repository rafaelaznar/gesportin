import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { ITipoarticulo } from '../../../../model/tipoarticulo';

@Component({
  standalone: true,
  selector: 'app-tipoarticulo-admin-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class TipoarticuloAdminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private tipoarticuloService = inject(TipoarticuloService);

  oTipoarticulo = signal<ITipoarticulo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idTipoarticulo = this.id();
    if (!idTipoarticulo || isNaN(idTipoarticulo)) {
      this.error.set('ID de tipo de artículo no válido');
      this.loading.set(false);
      return;
    }
    this.load(idTipoarticulo);
  }

  private load(id: number): void {
    this.tipoarticuloService.get(id).subscribe({
      next: (data) => {
        this.oTipoarticulo.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el tipo de artículo');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
