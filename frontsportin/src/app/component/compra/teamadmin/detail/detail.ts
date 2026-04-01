import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { CompraService } from '../../../../service/compra';
import { ICompra } from '../../../../model/compra';

@Component({
  standalone: true,
  selector: 'app-compra-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CompraTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private compraService = inject(CompraService);

  oCompra = signal<ICompra | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idCompra = this.id();
    if (!idCompra || isNaN(idCompra)) {
      this.error.set('ID de compra no válido');
      this.loading.set(false);
      return;
    }
    this.load(idCompra);
  }

  private load(id: number): void {
    this.compraService.get(id).subscribe({
      next: (data) => {
        this.oCompra.set(data);
        this.loading.set(false);
        const art = data.articulo;
        const tipo = art?.tipoarticulo;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la compra');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
