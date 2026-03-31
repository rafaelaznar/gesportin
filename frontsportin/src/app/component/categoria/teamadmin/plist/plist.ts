import { Component, computed, inject, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { debounceTimeSearch } from '../../../../environment/environment';
import { ICategoria } from '../../../../model/categoria';
import { IPage } from '../../../../model/plist';
import { CategoriaService } from '../../../../service/categoria';
import { TemporadaService } from '../../../../service/temporada';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-categoria-teamadmin-plist',
  imports: [Paginacion, RouterLink, BotoneraActionsPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
  standalone: true,
})
export class CategoriaTeamadminPlist {
  @Input() temporada: number = 0;

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías' },
  ]);

  oPage = signal<IPage<ICategoria> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  nombre = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  private oCategoriaService = inject(CategoriaService);
  private oTemporadaService = inject(TemporadaService);
  private modalRef = inject(MODAL_REF, { optional: true });

  ngOnInit(): void {
    if (this.temporada > 0) {
      this.oTemporadaService.get(this.temporada).subscribe({
        next: (t) => {
          this.breadcrumbItems.set([
            { label: 'Mis Clubes', route: '/club/teamadmin' },
            { label: 'Temporadas', route: '/temporada/teamadmin' },
            { label: t.descripcion, route: `/temporada/teamadmin/view/${t.id}` },
            { label: 'Categorías' },
          ]);
        },
        error: () => {},
      });
    }
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.nombre.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });

    this.getPage();
  }

  getPage(): void {
    this.oCategoriaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.nombre(),
        this.temporada,
      )
      .subscribe({
        next: (data: IPage<ICategoria>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  onRppChange(rpp: number): void {
    this.numRpp.set(rpp);
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

  clearSearchFilter(): void {
    this.nombre.set('');
    this.numPage.set(0);
    this.getPage();
  }

  onOrder(order: string): void {
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

  onSelect(categoria: ICategoria): void {
    this.modalRef?.close(categoria);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
