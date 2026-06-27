import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../shared/modal/modal.tokens';
import { ModalRef } from '../../shared/modal/modal-ref';
import { debounceTimeSearch } from '../../../environment/environment';
import { TemporadaService } from '../../../service/temporada';
import { ITemporada } from '../../../model/temporada';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { TrimPipe } from '../../../pipe/trim-pipe';

@Component({
  selector: 'app-temporada-plist-finder',
  standalone: true,
  imports: [CommonModule, Paginacion, TrimPipe],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TemporadaPlistFinder implements OnInit, OnDestroy {

  /** Filtro por club — recibido via modalService.open(..., { data: { id_club } }) */
  id_club = input<number>(0);

  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, ITemporada | null> | null;
  private readonly temporadaService = inject(TemporadaService);

  oPage = signal<IPage<ITemporada> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  descripcion = signal<string>('');
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
        this.descripcion.set(value);
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
    if (orderField === 'club') {
      orderField = 'club.id';
    }

    this.temporadaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        orderField,
        this.orderDirection(),
        this.descripcion(),
        this.id_club(),
      )
      .subscribe({
        next: (data: IPage<ITemporada>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando temporadas:', err);
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

  onSearchDescription(value: string): void {
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

  onSelect(temporada: ITemporada): void {
    this.modalRef?.close(temporada);
  }

  onCancel(): void {
    this.modalRef?.close(null);
  }
}
