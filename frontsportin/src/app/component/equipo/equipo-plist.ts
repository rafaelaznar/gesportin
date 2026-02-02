import { Component, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Paginacion } from '../shared/paginacion/paginacion';
import { BotoneraRpp } from '../shared/botonera-rpp/botonera-rpp';
import { TrimPipe } from '../../pipe/trim-pipe';

import { EquipoService } from '../../service/equipo';
import { debounceTimeSearch } from '../../environment/environment';
import { IPage } from '../../model/plist';
import { IEquipo } from '../../model/equipo';

@Component({
  selector: 'app-plist-equipo',
  imports: [Paginacion, BotoneraRpp, TrimPipe, RouterLink, FormsModule],
  templateUrl: './equipo-plist.html',
  styleUrl: './equipo-plist.css',
})
export class PlistEquipo {
  // Datos originales del servidor (todos los registros)
  allEquipos = signal<IEquipo[]>([]);
  // Datos filtrados por búsqueda
  filteredEquipos = signal<IEquipo[]>([]);
  // Datos paginados para mostrar en la tabla
  paginatedContent = signal<IEquipo[]>([]);
  
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  // Mensajes y total
  message = signal<string | null>(null);
  totalRecords = computed(() => this.filteredEquipos().length);
  totalPages = computed(() => Math.ceil(this.filteredEquipos().length / this.numRpp()) || 1);
  private messageTimeout: any = null;

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Variables de filtro
  categoria = signal<number>(0);

  // Variables de búsqueda
  nombre = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  // Variables de búsqueda por ID
  searchId: number | null = null;
  filtroId = signal<number>(0);

  constructor(
    private oEquipoService: EquipoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('categoria');
    if (id) {
      this.categoria.set(+id);
    }

    // Configurar el debounce para la búsqueda
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(debounceTimeSearch), // Espera después de que el usuario deje de escribir
        distinctUntilChanged(), // Solo emite si el valor cambió
      )
      .subscribe((searchTerm: string) => {
        this.nombre.set(searchTerm);
        this.numPage.set(0); // Volver a la primera página al buscar
        this.filterAndPaginate();
      });

    this.loadAllData();
  }

  ngOnDestroy() {
    // Limpiar la suscripción para evitar memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // Cargar todos los datos del servidor
  loadAllData() {
    this.oEquipoService
      .getPage(
        0,
        10000, // Cargar todos los registros
        this.orderField(),
        this.orderDirection(),
        '',
        this.categoria(),
      )
      .subscribe({
        next: (data: IPage<IEquipo>) => {
          this.allEquipos.set(data.content);
          this.filterAndPaginate();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  // Filtrar por nombre y/o ID, y paginar
  filterAndPaginate() {
    const all = this.allEquipos();
    const searchTerm = this.nombre().toLowerCase().trim();
    const idFilter = this.filtroId();
    
    // Filtrar
    let filtered: IEquipo[];
    
    // Si hay filtro por ID, solo mostrar ese equipo
    if (idFilter > 0) {
      filtered = all.filter(equipo => equipo.id === idFilter);
    } else if (searchTerm.length === 0) {
      filtered = all;
    } else {
      filtered = all.filter(equipo => 
        equipo.nombre?.toLowerCase().includes(searchTerm)
      );
    }
    this.filteredEquipos.set(filtered);
    
    // Ajustar página si es necesario
    const maxPage = Math.max(0, this.totalPages() - 1);
    if (this.numPage() > maxPage) {
      this.numPage.set(maxPage);
    }
    
    // Paginar
    const start = this.numPage() * this.numRpp();
    const end = start + this.numRpp();
    this.paginatedContent.set(filtered.slice(start, end));
  }

  onOrder(order: string) {
    if (this.orderField() === order) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(order);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.loadAllData(); // Recargar con nuevo orden
  }

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.filterAndPaginate(); // Solo repaginar, no recargar
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.filterAndPaginate(); // Solo repaginar, no recargar
  }

  onSearchNombre(value: string) {
    // Emitir el valor al Subject para que sea procesado con debounce
    this.searchSubject.next(value);
  }

  onSearchIdChange() {
    // Si se borra el campo de ID, quitar el filtro
    if (!this.searchId || this.searchId <= 0) {
      this.filtroId.set(0);
      this.numPage.set(0);
      this.filterAndPaginate();
    }
  }

  onSearchById() {
    if (this.searchId && this.searchId > 0) {
      this.filtroId.set(this.searchId);
      this.numPage.set(0);
      this.filterAndPaginate();
    }
  }

  clearIdFilter() {
    this.searchId = null;
    this.filtroId.set(0);
    this.numPage.set(0);
    this.filterAndPaginate();
  }
}
