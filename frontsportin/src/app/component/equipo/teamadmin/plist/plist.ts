import { Component, computed, inject, Input, signal } from '@angular/core';
import { IPage } from '../../../../model/plist';
import { IEquipo } from '../../../../model/equipo';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { debounceTimeSearch } from '../../../../environment/environment';
import { EquipoService } from '../../../../service/equipo';
import { CategoriaService } from '../../../../service/categoria';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { RouterLink } from '@angular/router';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { BotoneraActionsPlist } from '../../../shared/botonera-actions-plist/botonera-actions-plist';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-equipo-teamadmin-plist',
  imports: [Paginacion, RouterLink, BotoneraActionsPlist, BreadcrumbComponent],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
  standalone: true,
})
export class EquipoTeamadminPlist {
  @Input() categoria: number = 0;
  @Input() usuario: number = 0;

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'Mis Clubes', route: '/club/teamadmin' },
    { label: 'Temporadas', route: '/temporada/teamadmin' },
    { label: 'Categorías', route: '/categoria/teamadmin' },
    { label: 'Equipos' },
  ]);

  oPage = signal<IPage<IEquipo> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  nombre = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  oEquipoService = inject(EquipoService);
  private oCategoriaService = inject(CategoriaService);
  private modalRef = inject(MODAL_REF, { optional: true });

  ngOnInit(): void {
    if (this.categoria > 0) {
      this.oCategoriaService.get(this.categoria).subscribe({
        next: (cat) => {
          const temp = cat.temporada;
          const items: BreadcrumbItem[] = [
            { label: 'Mis Clubes', route: '/club/teamadmin' },
            { label: 'Temporadas', route: '/temporada/teamadmin' },
          ];
          if (temp) {
            items.push({ label: temp.descripcion, route: `/temporada/teamadmin/view/${temp.id}` });
          }
          items.push({ label: 'Categorías', route: temp ? `/categoria/teamadmin/temporada/${temp.id}` : '/categoria/teamadmin' });
          items.push({ label: cat.nombre, route: `/categoria/teamadmin/view/${cat.id}` });
          items.push({ label: 'Equipos' });
          this.breadcrumbItems.set(items);
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
    this.oEquipoService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.nombre(),
        this.categoria,
        this.usuario,
      )
      .subscribe({
        next: (data: IPage<IEquipo>) => {
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

  onSearchNombre(value: string): void {
    this.searchSubject.next(value);
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

  onSelect(equipo: IEquipo): void {
    this.modalRef?.close(equipo);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
