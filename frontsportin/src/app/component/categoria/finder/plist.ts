import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../shared/modal/modal.tokens';
import { ModalRef } from '../../shared/modal/modal-ref';
import { debounceTimeSearch } from '../../../environment/environment';
import { CategoriaService } from '../../../service/categoria';
import { ICategoria } from '../../../model/categoria';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';

@Component({
  selector: 'app-categoria-plist-finder',
  standalone: true,
  imports: [CommonModule, Paginacion],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CategoriaPlistFinder implements OnInit, OnDestroy {

  /** Filtro por temporada — recibido via modalService.open(..., { data: { id_temporada } }) */
  id_temporada = input<number>(0);

  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, ICategoria | null> | null;
  private readonly categoriaService = inject(CategoriaService);

  oPage = signal<IPage<ICategoria> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  nombre = signal<string>('');
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  loading = signal<boolean>(false);

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((value: string) => {
        this.nombre.set(value);
        this.numPage.set(0);
        this.getPage();
      });
    this.getPage();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  getPage(): void {
    this.loading.set(true);

    let orderField = this.orderField();
    if (orderField === 'temporada') {
      orderField = 'temporada.id';
    }

    this.categoriaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        orderField,
        this.orderDirection(),
        this.nombre(),
        this.id_temporada(),
      )
      .subscribe({
        next: (data: IPage<ICategoria>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando categorías:', err);
          this.loading.set(false);
        },
      });
  }

  onRppChange(n: number): void {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(page: number): void {
    this.numPage.set(page);
    this.getPage();
  }

  onSearchName(value: string): void {
    this.searchSubject.next(value);
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

  onSelect(categoria: ICategoria): void {
    this.modalRef?.close(categoria);
  }

  onCancel(): void {
    this.modalRef?.close(null);
  }
}
