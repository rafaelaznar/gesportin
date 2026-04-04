import { Component, computed, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { debounceTimeSearch } from '../../../../environment/environment';
import { ICarrito } from '../../../../model/carrito';
import { IPage } from '../../../../model/plist';
import { CarritoService } from '../../../../service/carrito';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-carrito-teamadmin-plist',
  imports: [RouterLink, BotoneraRpp, Paginacion, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CarritoTeamadminPlist implements OnInit, OnDestroy {
  @Input() id_articulo?: number;
  @Input() id_usuario?: number;

  oPage = signal<IPage<ICarrito> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  private carritoService = inject(CarritoService);
  private route = inject(ActivatedRoute);
  private modalRef = inject(MODAL_REF, { optional: true });

  ngOnInit(): void {
    if (this.id_articulo == null) {
      const id = this.route.snapshot.paramMap.get('id_articulo');
      if (id) this.id_articulo = Number(id);
    }
    if (this.id_usuario == null) {
      const id = this.route.snapshot.paramMap.get('id_usuario');
      if (id) this.id_usuario = Number(id);
    }
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((term: string) => {
        this.descripcion.set(term);
        this.numPage.set(0);
        this.getPage();
      });
    this.getPage();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  getPage(): void {
    this.carritoService
      .getPage(
        this.numPage(),
        this.numRpp(),
        'id',
        'asc',
        '',
        this.id_articulo ?? 0,
        this.id_usuario ?? 0,
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
          console.error('Error cargando carritos:', err);
        },
      });
  }

  onRppChange(n: number): void {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(numPage: number): void {
    this.numPage.set(numPage);
    this.getPage();
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  isDialogMode(): boolean {
    return !!this.modalRef;
  }

  onSelect(carrito: ICarrito): void {
    this.modalRef?.close(carrito);
  }
}
