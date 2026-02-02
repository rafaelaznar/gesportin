import { Component, Signal, signal } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { IPage } from '../../../model/plist';
import { FacturaService } from '../../../service/factura-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { IFactura } from '../../../model/factura';


@Component({
  selector: 'app-factura-plist',
  imports: [Paginacion, BotoneraRpp, DatetimePipe, RouterLink, TrimPipe],
  templateUrl: './factura-plist.html',
  styleUrl: './factura-plist.css',
})
export class FacturaPlistAdminRouted {
  oPage = signal<IPage<IFactura> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  totalElementsCount = signal<number>(0);


  orderField = signal<string>('id');
  orderDirection = signal<string>('asc');

  usuario = signal<number>(0);


  constructor(
    private oFacturaService: FacturaService, private cdr: ChangeDetectorRef, private route: ActivatedRoute
  ) {}


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('usuario');
    if (id) {
      this.usuario.set(+id);
    }
    this.getPage();
  }


  getPage() {
    this.oFacturaService
      .getPage(this.numPage(), this.numRpp(), this.orderField(), this.orderDirection(), this.usuario())
      .subscribe({
        next: (data: IPage<IFactura>) => {
          this.oPage.set(data);
          this.totalElementsCount.set(data.totalElements ?? 0);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
          // Trigger view update under zoneless change detection
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }


  onOrder(order: string) {
    if (this.orderField() === order) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(order);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.getPage();
    return false;
  }


  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  this.cdr.detectChanges();
    return false;
  }


  onRppChange(n: number) {
    this.numRpp.set(n);
    this.getPage();
  this.cdr.detectChanges();
    return false;
  }
}

