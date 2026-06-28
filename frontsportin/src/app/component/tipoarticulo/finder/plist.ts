import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../shared/modal/modal.tokens';
import { ModalRef } from '../../shared/modal/modal-ref';
import { debounceTimeSearch } from '../../../environment/environment';
import { TipoarticuloService } from '../../../service/tipoarticulo';
import { ITipoarticulo } from '../../../model/tipoarticulo';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';

@Component({
  selector: 'app-tipoarticulo-plist-finder',
  standalone: true,
  imports: [CommonModule, Paginacion],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TipoarticuloPlistFinder implements OnInit, OnDestroy {
  id_club = input<number>(0);

  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, ITipoarticulo | null> | null;
  private readonly tipoarticuloService = inject(TipoarticuloService);

  oPage = signal<IPage<ITipoarticulo> | null>(null);
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
    this.searchSubscription = this.searchSubject.pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe(v => { this.descripcion.set(v); this.numPage.set(0); this.getPage(); });
    this.getPage();
  }
  ngOnDestroy(): void { this.searchSubscription?.unsubscribe(); }

  getPage(): void {
    this.loading.set(true);
    this.tipoarticuloService.getPage(this.numPage(), this.numRpp(), this.orderField(), this.orderDirection(), this.descripcion(), this.id_club())
      .subscribe({
        next: data => { this.oPage.set(data); this.loading.set(false); },
        error: (err: HttpErrorResponse) => { console.error(err); this.loading.set(false); },
      });
  }
  onRppChange(n: number): void { this.numRpp.set(n); this.numPage.set(0); this.getPage(); }
  goToPage(p: number): void { this.numPage.set(p); this.getPage(); }
  onSearchDescripcion(v: string): void { this.searchSubject.next(v); }
  onOrder(f: string): void {
    if (this.orderField() === f) this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    else { this.orderField.set(f); this.orderDirection.set('asc'); }
    this.numPage.set(0); this.getPage();
  }
  onSelect(t: ITipoarticulo): void { this.modalRef?.close(t); }
  onCancel(): void { this.modalRef?.close(null); }
}
