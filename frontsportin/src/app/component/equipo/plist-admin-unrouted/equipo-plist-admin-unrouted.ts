import { Component, computed, inject, Input, signal } from '@angular/core';
import { IPage } from '../../../model/plist';
import { IEquipo } from '../../../model/equipo';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { debounceTimeSearch } from '../../../environment/environment';
import { EquipoService } from '../../../service/equipo';
import { HttpErrorResponse } from '@angular/common/http';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { RouterLink } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-equipo-plist-admin-unrouted',
  imports: [BotoneraRpp, Paginacion, RouterLink, TrimPipe],
  templateUrl: './equipo-plist-admin-unrouted.html',
  styleUrl: './equipo-plist-admin-unrouted.css',
  standalone: true,
})
export class EquipoPlistAdminUnrouted {
  // Variables que me pasan como atributos para filtrar
  @Input() categoria = signal<number>(0);
  @Input() usuario = signal<number>(0);

  oPage = signal<IPage<IEquipo> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  // Mensajes y total
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Variables de búsqueda
  private searchSubject = new Subject<string>();
  nombre = signal<string>('');
  private searchSubscription?: Subscription;

  oEquipoService = inject(EquipoService);
  private dialogRef = inject(MatDialogRef<EquipoPlistAdminUnrouted>, { optional: true });

  ngOnInit(): void {
    // Configurar el debounce para la búsqueda
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
    // Emitir el valor al Subject para que sea procesado con debounce
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
    return !!this.dialogRef;
  }

  onSelect(equipo: IEquipo): void {
    this.dialogRef?.close(equipo);
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción al destruir el componente
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
