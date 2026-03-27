import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../../../service/compra';
import { ICompra } from '../../../../model/compra';

@Component({
  standalone: true,
  selector: 'app-compra-admin-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class CompraAdminDetail implements OnInit {
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
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la compra');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
