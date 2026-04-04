import { Component, computed, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { debounceTimeSearch } from '../../../../environment/environment';
import { SessionService } from '../../../../service/session';
import { ICompra } from '../../../../model/compra';
import { IPage } from '../../../../model/plist';
import { CompraService } from '../../../../service/compra';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-compra-admin-plist',
  imports: [RouterLink, BotoneraRpp, Paginacion, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CompraAdminPlist {
  @Input() id_articulo?: number;
  @Input() id_factura?: number;
  @Input() strRole: string = '';

  oPage = signal<IPage<ICompra> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private compraService = inject(CompraService);
  private route = inject(ActivatedRoute);
  private modalRef = inject(MODAL_REF, { optional: true });
  session = inject(SessionService);

  ngOnInit() {
    if (this.id_articulo != null) {
      // ya se filtra por input
    } else {
      const idArticulo = this.route.snapshot.paramMap.get('id_articulo');
      if (idArticulo) {
        this.id_articulo = Number(idArticulo);
      }
    }

    if (this.id_factura != null) {
      // ya se filtra por input
    } else {
      const idFactura = this.route.snapshot.paramMap.get('id_factura');
      if (idFactura) {
        this.id_factura = Number(idFactura);
      }
    }

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm: string) => {
        this.descripcion.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  getPage() {
    let orderField = this.orderField();
    if (orderField === 'id_factura') {
      orderField = 'factura.id';
    }

    this.compraService
      .getPage(
        this.numPage(),
        this.numRpp(),
        orderField,
        this.orderDirection(),
        this.id_articulo ?? 0,
        this.id_factura ?? 0,
      )
      .subscribe({
        next: (data) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando compras:', err);
        },
      });
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  }

  onSearchDescripcion(value: string) {
    this.searchSubject.next(value);
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
  }

  isDialogMode(): boolean {
    return !!this.modalRef;
  }

  onSelect(compra: ICompra): void {
    this.modalRef?.close(compra);
  }
}
