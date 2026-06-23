import { Component, computed, inject, Input, signal } from '@angular/core';
import { IPage } from '../../../../model/plist';
import { IEquipo } from '../../../../model/equipo';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { debounceTimeSearch } from '../../../../environment/environment';
import { EquipoService } from '../../../../service/equipo';
import { HttpErrorResponse } from '@angular/common/http';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';
import { RouterLink } from '@angular/router';
import { TrimPipe } from '../../../../pipe/trim-pipe';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';

@Component({
  selector: 'app-equipo-admin-plist',
  imports: [BotoneraRpp, Paginacion, RouterLink, TrimPipe],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
  standalone: true,
})
export class EquipoAdminPlist {
  @Input() categoria = signal<number>(0);
  @Input() temporada = signal<number>(0);
  @Input() usuario = signal<number>(0);

  oPage = signal<IPage<IEquipo> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  private searchSubject = new Subject<string>();
  nombre = signal<string>('');
  private searchSubscription?: Subscription;

  oEquipoService = inject(EquipoService);
  private modalRef = inject(MODAL_REF, { optional: true });

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(debounceTimeSearch), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.nombre.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });
    this.getPage();
  }

  getPage() {
    this.oEquipoService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.nombre(),
        this.categoria(),
        this.temporada(),
        this.usuario(),
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

  onSearchNombre(value: string) {
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
