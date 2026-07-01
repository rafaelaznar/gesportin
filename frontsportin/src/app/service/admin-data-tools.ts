import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';

export type DataEntityKey =
  | 'tipousuario'
  | 'estadopartido'
  | 'rolusuario'
  | 'club'
  | 'usuario'
  | 'temporada'
  | 'noticia'
  | 'tipoarticulo'
  | 'categoria'
  | 'articulo'
  | 'equipo'
  | 'liga'
  | 'jugador'
  | 'cuota'
  | 'partido'
  | 'pago'
  | 'comentario'
  | 'puntuacion'
  | 'comentarioart'
  | 'puntuacionart'
  | 'carrito'
  | 'factura'
  | 'compra';

export interface IEntityMeta {
  key: DataEntityKey;
  label: string;
}

/** Display order for the counts table. */
export const COUNT_ORDER: readonly DataEntityKey[] = [
  'tipousuario',
  'estadopartido',
  'rolusuario',
  'club',
  'usuario',
  'temporada',
  'noticia',
  'tipoarticulo',
  'categoria',
  'articulo',
  'equipo',
  'liga',
  'jugador',
  'cuota',
  'partido',
  'pago',
  'comentario',
  'puntuacion',
  'comentarioart',
  'puntuacionart',
  'carrito',
  'factura',
  'compra',
];

/** Reverse order for display of deletion order. */
export const EMPTY_ORDER: readonly DataEntityKey[] = [...COUNT_ORDER].reverse();

export const ENTITY_META: Record<DataEntityKey, IEntityMeta> = {
  tipousuario: { key: 'tipousuario', label: 'Tipo de Usuario' },
  estadopartido: { key: 'estadopartido', label: 'Estado de Partido' },
  rolusuario: { key: 'rolusuario', label: 'Rol de Usuario' },
  club: { key: 'club', label: 'Club' },
  usuario: { key: 'usuario', label: 'Usuario' },
  temporada: { key: 'temporada', label: 'Temporada' },
  noticia: { key: 'noticia', label: 'Noticia' },
  tipoarticulo: { key: 'tipoarticulo', label: 'Tipo de Artículo' },
  categoria: { key: 'categoria', label: 'Categoría' },
  articulo: { key: 'articulo', label: 'Artículo' },
  equipo: { key: 'equipo', label: 'Equipo' },
  liga: { key: 'liga', label: 'Liga' },
  jugador: { key: 'jugador', label: 'Jugador' },
  cuota: { key: 'cuota', label: 'Cuota' },
  partido: { key: 'partido', label: 'Partido' },
  pago: { key: 'pago', label: 'Pago' },
  comentario: { key: 'comentario', label: 'Comentario' },
  puntuacion: { key: 'puntuacion', label: 'Puntuación' },
  comentarioart: { key: 'comentarioart', label: 'Comentario de Artículo' },
  puntuacionart: { key: 'puntuacionart', label: 'Puntuación de Artículo' },
  carrito: { key: 'carrito', label: 'Carrito' },
  factura: { key: 'factura', label: 'Factura' },
  compra: { key: 'compra', label: 'Compra' },
};

/** Response from POST /admin/generate */
export interface IGenerateResult {
  clubs: number;
  usuarios: number;
  temporadas: number;
  categorias: number;
  noticias: number;
  tipoarticulos: number;
  articulos: number;
  equipos: number;
  ligas: number;
  jugadores: number;
  cuotas: number;
  partidos: number;
  pagos: number;
  comentarios: number;
  puntuaciones: number;
  comentarioarts: number;
  puntuacionarts: number;
  carritos: number;
  facturas: number;
  compras: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminDataToolsService {
  private http = inject(HttpClient);

  // ── Counts ──────────────────────────────────────────────────────────────────

  count(entity: DataEntityKey): Observable<number> {
    return this.http.get<number>(`${serverURL}/${entity}/count`);
  }

  // ── Reset (single transactional operation: empty all + seed) ────────────────

  reset(): Observable<number> {
    return this.http.post<number>(`${serverURL}/admin/reset`, null);
  }

  // ── Centralized data generation ──────────────────────────────────────────────

  generate(): Observable<IGenerateResult> {
    return this.http.post<IGenerateResult>(`${serverURL}/admin/generate`, null);
  }
}
