import { Component, computed, inject, Input, signal } from '@angular/core';
import { SessionService } from '../../../service/session';
import { IPage } from '../../../model/plist';
import { ITipoarticulo } from '../../../model/tipoarticulo';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { debounceTimeSearch } from '../../../environment/environment';
import { TipoarticuloService } from '../../../service/tipoarticulo';
import { HttpErrorResponse } from '@angular/common/http';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BotoneraActionsPlist } from '../../shared/botonera-actions-plist/botonera-actions-plist';
import { UsuarioService } from '../../../service/usuarioService';
import { IUsuario } from '../../../model/usuario';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-usuario-plist-admin-unrouted',
  imports: [BotoneraRpp, Paginacion, RouterLink, BotoneraActionsPlist],
  templateUrl: './usuario-plist-admin-unrouted.html',
  styleUrl: './usuario-plist-admin-unrouted.css',
})

export class UsuarioPlistAdminUnrouted {

  @Input() idTipousuario = signal<number>(0);
  @Input() idRol = signal<number>(0);
  @Input() idClub = signal<number>(0);

  oPage = signal<IPage<IUsuario> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  totalElementsCount = computed(() => this.oPage()?.totalElements ?? 0);

  // Mensajes y total
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  isFilling = signal<boolean>(false);
  fillErrorMessage = signal<string>('');
  fillAmount = signal<number>(25);

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  filtro = signal<string>('');


  oUsuarioService = inject(UsuarioService);
  session: SessionService = inject(SessionService);
  private dialogRef = inject(MatDialogRef<UsuarioPlistAdminUnrouted>, { optional: true });

  ngOnInit() {
    // Configurar el debounce para la búsqueda
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(debounceTimeSearch),
        distinctUntilChanged()
      )
      .subscribe((term: string) => {
        this.filtro.set(term);
        this.numPage.set(0);
        this.getPage();
      });
    this.getPage();
  }

  ngOnDestroy() {
    // Cancelar la suscripción al destruir el componente
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getPage() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.oUsuarioService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.filtro().trim(),
        this.idTipousuario(),
        this.idRol(),
        this.idClub()
      )
      .subscribe({
        next: (data: IPage<IUsuario>) => {
          this.oPage.set(data);

          // si la página se queda fuera por un borrado, etc.
          if (this.numPage() > 0 && this.numPage() >= (data.totalPages ?? 0)) {
            this.numPage.set(Math.max((data.totalPages ?? 1) - 1, 0));
            this.getPage();
            return;
          }

          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.errorMessage.set('No se pudo cargar la lista de usuarios.');
          this.isLoading.set(false);
        },
      });
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

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }

  isDialogMode(): boolean {
    return !!this.dialogRef;
  }

  onSelect(usuario: IUsuario): void {
    this.dialogRef?.close(usuario);
  }

  setFillAmount(value: string) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.fillAmount.set(parsed);
    }
  }

  fillUsuarios() {
    if (this.isFilling()) return;

    this.isFilling.set(true);
    this.fillErrorMessage.set('');

    this.oUsuarioService.fill(this.fillAmount()).subscribe({
      next: () => {
        this.isFilling.set(false);
        this.getPage();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.fillErrorMessage.set('No se pudieron rellenar usuarios.');
        this.isFilling.set(false);
      },
    });
  }

  trackById(index: number, usuario: IUsuario) {
    return usuario.id;
  }

  getGeneroLabel(genero: number) {
    return genero === 0 ? 'H' : 'M';
  }

}
