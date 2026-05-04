import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { CarritoService } from '../../../../service/carrito';
import { ICarrito } from '../../../../model/carrito';

@Component({
  standalone: true,
  selector: 'app-carrito-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CarritoTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private carritoService = inject(CarritoService);

  oCarrito = signal<ICarrito | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showArticulo = signal(false);
  showArticuloTipoarticulo = signal(false);
  showArticuloTipoarticuloClub = signal(false);
  showUsuario = signal(false);
  showUsuarioTipousuario = signal(false);
  showUsuarioRolusuario = signal(false);
  showUsuarioClub = signal(false);

  ngOnInit(): void {
    const idCarrito = this.id();
    if (!idCarrito || isNaN(idCarrito)) {
      this.error.set('ID de carrito no válido');
      this.loading.set(false);
      return;
    }
    this.load(idCarrito);
  }

  private load(id: number): void {
    this.carritoService.get(id).subscribe({
      next: (data) => {
        this.oCarrito.set(data);
        this.loading.set(false);
        const art = data.articulo;
        const tipo = art?.tipoarticulo;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el carrito');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
