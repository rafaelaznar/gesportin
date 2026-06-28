import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../shared/modal/modal.tokens';
import { ModalRef } from '../../shared/modal/modal-ref';
import { debounceTimeSearch } from '../../../environment/environment';
import { TipousuarioService } from '../../../service/tipousuario';
import { ITipousuario } from '../../../model/tipousuario';

@Component({
  selector: 'app-tipousuario-plist-finder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class TipousuarioPlistFinder implements OnInit, OnDestroy {
  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, ITipousuario | null> | null;
  private readonly tipousuarioService = inject(TipousuarioService);

  allData = signal<ITipousuario[]>([]);
  filteredData = signal<ITipousuario[]>([]);
  displayedData = computed(() => this.filteredData().slice(this.numPage() * this.numRpp(), (this.numPage() + 1) * this.numRpp()));
  numPage = signal<number>(0); numRpp = signal<number>(10); descripcion = signal<string>('');
  orderField = signal<string>('id'); orderDirection = signal<'asc' | 'desc'>('asc');
  totalRecords = computed(() => this.filteredData().length);
  totalPages = computed(() => Math.max(1, Math.ceil(this.totalRecords() / this.numRpp())));
  loading = signal<boolean>(false);
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe(v => { this.descripcion.set(v); this.numPage.set(0); this.applyFilters(); });
    this.loadData();
  }
  ngOnDestroy(): void { this.searchSubscription?.unsubscribe(); }

  loadData(): void { this.loading.set(true); this.tipousuarioService.getAll().subscribe({
    next: data => { this.allData.set(data); this.applyFilters(); this.loading.set(false); },
    error: (err: HttpErrorResponse) => { console.error(err); this.loading.set(false); },
  });}
  applyFilters(): void {
    let f = this.allData();
    if (this.descripcion()) f = f.filter(e => e.descripcion.toLowerCase().includes(this.descripcion().toLowerCase()));
    f.sort((a, b) => { const av: any = this.orderField() === 'id' ? a.id : a.descripcion; const bv: any = this.orderField() === 'id' ? b.id : b.descripcion; return this.orderDirection() === 'asc' ? (av < bv ? -1 : av > bv ? 1 : 0) : (bv < av ? -1 : bv > av ? 1 : 0); });
    this.filteredData.set(f);
  }
  goToPage(p: number): void { this.numPage.set(p); }
  onSearchDescripcion(v: string): void { this.searchSubject.next(v); }
  onOrder(f: string): void {
    if (this.orderField() === f) this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    else { this.orderField.set(f); this.orderDirection.set('asc'); }
    this.numPage.set(0); this.applyFilters();
  }
  onSelect(t: ITipousuario): void { this.modalRef?.close(t); }
  onCancel(): void { this.modalRef?.close(null); }
}
