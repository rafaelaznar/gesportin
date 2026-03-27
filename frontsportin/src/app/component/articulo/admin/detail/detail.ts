import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ArticuloService } from '../../../../service/articulo';
import { IArticulo } from '../../../../model/articulo';

@Component({
  standalone: true,
  selector: 'app-articulo-admin-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class ArticuloAdminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private articuloService = inject(ArticuloService);

  oArticulo = signal<IArticulo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idArticulo = this.id();
    if (!idArticulo || isNaN(idArticulo)) {
      this.error.set('ID de artículo no válido');
      this.loading.set(false);
      return;
    }
    this.load(idArticulo);
  }

  private load(id: number): void {
    this.articuloService.get(id).subscribe({
      next: (data) => {
        this.oArticulo.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el artículo');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
