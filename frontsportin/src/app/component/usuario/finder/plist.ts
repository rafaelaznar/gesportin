import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MODAL_REF } from '../../shared/modal/modal.tokens';
import { ModalRef } from '../../shared/modal/modal-ref';
import { debounceTimeSearch } from '../../../environment/environment';
import { UsuarioService } from '../../../service/usuarioService';
import { JugadorService } from '../../../service/jugador-service';
import { ImageUploadService } from '../../../service/image-upload';
import { IUsuario } from '../../../model/usuario';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';

@Component({
  selector: 'app-usuario-plist-finder',
  standalone: true,
  imports: [CommonModule, Paginacion],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class UsuarioPlistFinder implements OnInit, OnDestroy {

  /** Filtro por tipo de usuario — recibido via modalService.open(..., { data: { id_tipousuario } }) */
  id_tipousuario = input<number>(0);
  /** Filtro por club — recibido via modalService.open(..., { data: { id_club } }) */
  id_club = input<number>(0);
  /** Filtro por equipo — recibido via modalService.open(..., { data: { idEquipo } }) — muestra usuarios disponibles para ese equipo */
  id_equipo = input<number>(0);

  private readonly modalRef = inject(MODAL_REF, { optional: true }) as ModalRef<unknown, IUsuario | null> | null;
  private readonly usuarioService = inject(UsuarioService);
  private readonly jugadorService = inject(JugadorService);
  readonly imageUpload = inject(ImageUploadService);

  oPage = signal<IPage<IUsuario> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
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

    // Si hay filtro por equipo, usar el endpoint de jugadores disponibles
    if (this.id_equipo() > 0) {
      this.jugadorService
        .getUsuariosDisponibles(
          this.id_equipo(),
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
      return;
    }

    // Otherwise, use the standard usuario endpoint with filters
    let orderField = this.orderField();
    if (orderField === 'id_club') {
      orderField = 'club.id';
    }

    this.usuarioService
      .getPage(
        this.numPage(),
        this.numRpp(),
        orderField,
        this.orderDirection(),
        this.nombre(),
        this.id_tipousuario(),
        0,
        this.id_club(),
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
          console.error('Error cargando usuarios:', err);
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
