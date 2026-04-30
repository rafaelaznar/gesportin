import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { FacturaService } from '../../../../service/factura-service';
import { IFactura } from '../../../../model/factura';

@Component({
  standalone: true,
  selector: 'app-factura-teamadmin-detail',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class FacturaTeamadminDetail implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private facturaService = inject(FacturaService);

  oFactura = signal<IFactura | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showUsuario = signal(false);
  showUsuarioTipousuario = signal(false);
  showUsuarioRolusuario = signal(false);
  showUsuarioClub = signal(false);

  ngOnInit(): void {
    const idFactura = this.id();
    if (!idFactura || isNaN(idFactura)) {
      this.error.set('ID de factura no válido');
      this.loading.set(false);
      return;
    }
    this.load(idFactura);
  }

  private load(id: number): void {
    this.facturaService.get(id).subscribe({
      next: (data) => {
        this.oFactura.set(data);
        this.loading.set(false);
        const usuario = data.usuario;
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la factura');
        console.error(err);
        this.loading.set(false);
      },
    });
  }
}
