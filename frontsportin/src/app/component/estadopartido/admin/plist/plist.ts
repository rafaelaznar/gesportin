import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { debounceTimeSearch } from '../../../../environment/environment';
import { IEstadopartido } from '../../../../model/estadopartido';
import { IPage } from '../../../../model/plist';
import { EstadopartidoService } from '../../../../service/estadopartido';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';

@Component({
  standalone: true,
  selector: 'app-estadopartido-admin-plist',
  imports: [RouterLink, BotoneraRpp, Paginacion, BotoneraActionsPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class EstadopartidoAdminPlist {
  oPage = signal<IPage<IEstadopartido> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private estadopartidoService = inject(EstadopartidoService);

  ngOnInit() {
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
    this.estadopartidoService.getAll().subscribe({
      next: (data) => {
        const filteredData = this.filterAndSort(data);
        this.oPage.set({
          content: filteredData.slice(this.numPage() * this.numRpp(), (this.numPage() + 1) * this.numRpp()),
          totalElements: filteredData.length,
          totalPages: Math.ceil(filteredData.length / this.numRpp()),
          number: this.numPage(),
          size: this.numRpp(),
          first: this.numPage() === 0,
          last: this.numPage() >= Math.ceil(filteredData.length / this.numRpp()) - 1,
          numberOfElements: filteredData.length,
          empty: filteredData.length === 0,
        } as any);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error cargando estados de partido:', err);
      },
    });
  }

  private filterAndSort(data: IEstadopartido[]): IEstadopartido[] {
    let filtered = data;
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
    return filtered;
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
}
