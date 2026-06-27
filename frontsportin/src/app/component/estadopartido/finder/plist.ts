import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../shared/modal/modal.tokens';
import { ModalRef } from '../../shared/modal/modal-ref';
import { debounceTimeSearch } from '../../../environment/environment';
import { EstadopartidoService } from '../../../service/estadopartido';
import { IEstadopartido } from '../../../model/estadopartido';

@Component({
  selector: 'app-estadopartido-plist-finder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class EstadopartidoPlistFinder implements OnInit, OnDestroy {

  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, IEstadopartido | null> | null;
  private readonly estadopartidoService = inject(EstadopartidoService);

  allData = signal<IEstadopartido[]>([]);
  filteredData = signal<IEstadopartido[]>([]);
  displayedData = computed(() => {
    const filtered = this.filteredData();
    const start = this.numPage() * this.numRpp();
    return filtered.slice(start, start + this.numRpp());
  });
  numPage = signal<number>(0);
  numRpp = signal<number>(10);
  descripcion = signal<string>('');
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');
  totalRecords = computed(() => this.filteredData().length);
  totalPages = computed(() => Math.max(1, Math.ceil(this.totalRecords() / this.numRpp())));
  loading = signal<boolean>(false);

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((value: string) => {
        this.descripcion.set(value);
        this.numPage.set(0);
        this.applyFilters();
      });
    this.loadData();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  loadData(): void {
    this.loading.set(true);
    this.estadopartidoService.getAll().subscribe({
      next: (data: IEstadopartido[]) => {
        this.allData.set(data);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando estados de partido:', err);
        this.loading.set(false);
      },
    });
  }

  applyFilters(): void {
    let filtered = this.allData();
    if (this.descripcion()) {
      filtered = filtered.filter(e =>
        e.descripcion.toLowerCase().includes(this.descripcion().toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      let aVal: any = this.orderField() === 'id' ? a.id : a.descripcion;
      let bVal: any = this.orderField() === 'id' ? b.id : b.descripcion;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return this.orderDirection() === 'asc' ? comparison : -comparison;
    });
    this.filteredData.set(filtered);
  }

  goToPage(page: number): void {
    this.numPage.set(page);
  }

  onSearchDescripcion(value: string): void {
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
    this.applyFilters();
  }

  onSelect(estadopartido: IEstadopartido): void {
    this.modalRef?.close(estadopartido);
  }

  onCancel(): void {
    this.modalRef?.close(null);
  }
}
