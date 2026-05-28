import { Component, computed, inject, signal } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { debounceTimeSearch } from '../../../../environment/environment';
import { IPaymentSession } from '../../../../model/payment-session';
import { IPage } from '../../../../model/plist';
import { PaymentService } from '../../../../service/payment.service';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { DatetimePipe } from '../../../../pipe/datetime-pipe';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-payment-admin-plist',
  imports: [CommonModule, Paginacion, BotoneraRpp, DatetimePipe],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class PaymentAdminPlist {
  oPage = signal<IPage<IPaymentSession> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('fecha');
  orderDirection = signal<'asc' | 'desc'>('desc');

  tipoFiltro = signal<string>('');
  estadoFiltro = signal<string>('');

  private paymentService = inject(PaymentService);

  ngOnInit(): void {
    this.getPage();
  }

  getPage(): void {
    this.paymentService
      .getPageAdmin(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.tipoFiltro(),
        this.estadoFiltro(),
      )
      .subscribe({
        next: (page) => this.oPage.set(page),
        error: () => this.oPage.set(null),
      });
  }

  goToPage(page: number): void {
    this.numPage.set(page);
    this.getPage();
  }

  onRppChange(rpp: number): void {
    this.numRpp.set(rpp);
    this.numPage.set(0);
    this.getPage();
  }

  onOrder(field: string): void {
    if (this.orderField() === field) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(field);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.getPage();
  }

  onTipoChange(value: string): void {
    this.tipoFiltro.set(value);
    this.numPage.set(0);
    this.getPage();
  }

  onEstadoChange(value: string): void {
    this.estadoFiltro.set(value);
    this.numPage.set(0);
    this.getPage();
  }

  badgeEstado(estado: string): string {
    switch (estado) {
      case 'COMPLETADO': return 'badge bg-success';
      case 'CANCELADO': return 'badge bg-danger';
      default: return 'badge bg-warning text-dark';
    }
  }

  badgeTipo(tipo: string): string {
    return tipo === 'TIENDA' ? 'badge bg-info text-dark' : 'badge bg-primary';
  }
}
