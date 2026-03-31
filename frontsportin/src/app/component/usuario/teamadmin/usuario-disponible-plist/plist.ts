import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../../shared/modal/modal.tokens';
import { ModalRef } from '../../../shared/modal/modal-ref';
import { debounceTimeSearch } from '../../../../environment/environment';
import { JugadorService } from '../../../../service/jugador-service';
import { IUsuario } from '../../../../model/usuario';
import { IPage } from '../../../../model/plist';
import { BotoneraRpp } from '../../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../../shared/paginacion/paginacion';

@Component({
  selector: 'app-jugador-usuario-disponible-plist',
  standalone: true,
  imports: [CommonModule, BotoneraRpp, Paginacion],
  templateUrl: './plist.html',
})
export class UsuarioDisponiblePlist implements OnInit, OnDestroy {

  /** ID del equipo — recibido via setInput desde ModalComponent (config.data.idEquipo) */
  idEquipo = input<number>(0);

  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, IUsuario | null> | null;
  private readonly oJugadorService = inject(JugadorService);

  oPage = signal<IPage<IUsuario> | null>(null);
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
    if (this.idEquipo() <= 0) return;
    this.loading.set(true);
    this.oJugadorService
      .getUsuariosDisponibles(
        this.idEquipo(),
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.nombre(),
      )
      .subscribe({
        next: (data: IPage<IUsuario>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error cargando usuarios disponibles:', err);
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

  onSelect(usuario: IUsuario): void {
    this.modalRef?.close(usuario);
  }

  onCancel(): void {
    this.modalRef?.close(null);
  }
}
