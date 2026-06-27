import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../shared/modal/modal.tokens';
import { ModalRef } from '../../shared/modal/modal-ref';
import { debounceTimeSearch } from '../../../environment/environment';
import { EquipoService } from '../../../service/equipo';
import { IEquipo } from '../../../model/equipo';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';

@Component({
  selector: 'app-equipo-plist-finder',
  standalone: true,
  imports: [CommonModule, Paginacion],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class EquipoPlistFinder implements OnInit, OnDestroy {

  /** Filtro por categoría — recibido via modalService.open(..., { data: { id_categoria } }) */
  id_categoria = input<number>(0);
  /** Filtro por temporada — recibido via modalService.open(..., { data: { id_temporada } }) */
  id_temporada = input<number>(0);
  /** Filtro por entrenador — recibido via modalService.open(..., { data: { id_usuario } }) */
  id_usuario = input<number>(0);

  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, IEquipo | null> | null;
  private readonly equipoService = inject(EquipoService);

  oPage = signal<IPage<IEquipo> | null>(null);
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

    this.equipoService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.nombre(),
        this.id_categoria(),
        this.id_temporada(),
        this.id_usuario(),
      )
      .subscribe({
        next: (data: IPage<IEquipo>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando equipos:', err);
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

  onSearchNombre(value: string): void {
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

  onSelect(equipo: IEquipo): void {
    this.modalRef?.close(equipo);
  }

  onCancel(): void {
    this.modalRef?.close(null);
  }
}
