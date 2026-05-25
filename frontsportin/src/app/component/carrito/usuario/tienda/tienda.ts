import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IArticulo } from '../../../../model/articulo';
import { ITipoarticulo } from '../../../../model/tipoarticulo';
import { ICarrito } from '../../../../model/carrito';
import { IComentarioart } from '../../../../model/comentarioart';
import { IPuntuacionart } from '../../../../model/puntuacionart';
import { ArticuloService } from '../../../../service/articulo';
import { TipoarticuloService } from '../../../../service/tipoarticulo';
import { CarritoService } from '../../../../service/carrito';
import { ComentarioartService } from '../../../../service/comentarioart';
import { PuntuacionartService } from '../../../../service/puntuacionart';
import { SessionService } from '../../../../service/session';
import { PaymentService } from '../../../../service/payment.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface TiendaGroup {
  tipoarticulo: ITipoarticulo;
  articulos: IArticulo[];
}

@Component({
  selector: 'app-carrito-usuario-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class CarritoUsuarioTienda implements OnInit {
  private articuloService = inject(ArticuloService);
  private tipoarticuloService = inject(TipoarticuloService);
  private carritoService = inject(CarritoService);
  private comentarioartService = inject(ComentarioartService);
  private puntuacionartService = inject(PuntuacionartService);
  private session = inject(SessionService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  grupos = signal<TiendaGroup[]>([]);
  carrito = signal<ICarrito[]>([]);
  loadingTienda = signal(true);
  loadingCarrito = signal(false);
  comprando = signal(false);
  message = signal<string | null>(null);
  messageType = signal<'success' | 'danger' | 'info'>('info');
  cantidades = signal<Record<number, number>>({});

  // Comentarios y puntuaciones
  expandedArticuloId = signal<number | null>(null);
  comentariosByArticulo = signal<Record<number, IComentarioart[]>>({});
  loadingComentarios = signal<Record<number, boolean>>({});
  miPuntuacion = signal<Record<number, IPuntuacionart | null>>({});
  loadingPuntuacion = signal<Record<number, boolean>>({});
  hoverStar = signal<Record<number, number>>({});
  nuevoComentario = signal<Record<number, string>>({});
  editingComentario = signal<{ id: number; contenido: string } | null>(null);
  savingComentario = signal(false);

  ngOnInit(): void {
    const clubId = this.session.getClubId() ?? 0;
    this.tipoarticuloService
      .getPage(0, 1000, 'id', 'asc', '', clubId)
      .pipe(
        switchMap((tipoPage) => {
          const tipos = tipoPage.content;
          if (tipos.length === 0) return of([] as TiendaGroup[]);
          return forkJoin(
            tipos.map((t) =>
              this.articuloService
                .getPage(0, 1000, 'id', 'asc', '', t.id)
                .pipe(
                  switchMap((ap) => of({ tipoarticulo: t, articulos: ap.content } as TiendaGroup)),
                ),
            ),
          );
        }),
      )
      .subscribe({
        next: (grupos) => {
          this.grupos.set(grupos.filter((g) => g.articulos.length > 0));
          this.loadingTienda.set(false);
        },
        error: () => this.loadingTienda.set(false),
      });

    this.loadCarrito();
  }

  loadCarrito(): void {
    const uid = this.session.getUserId();
    if (!uid) return;
    this.loadingCarrito.set(true);
    this.carritoService.getPage(0, 1000, 'id', 'asc', '', 0, uid).subscribe({
      next: (page) => {
        this.carrito.set(page.content);
        this.loadingCarrito.set(false);
      },
      error: () => this.loadingCarrito.set(false),
    });
  }

  getCantidad(articuloId: number): number {
    return this.cantidades()[articuloId] ?? 1;
  }

  setCantidad(articuloId: number, val: number): void {
    this.cantidades.set({ ...this.cantidades(), [articuloId]: Math.max(1, val) });
  }

  precioFinal(a: IArticulo): number {
    return a.precio * (1 - (a.descuento ?? 0) / 100);
  }

  addToCart(articulo: IArticulo): void {
    const uid = this.session.getUserId();
    if (!uid) return;
    const cantidad = this.getCantidad(articulo.id);
    const existing = this.carrito().find((c) => c.articulo?.id === articulo.id);
    if (existing) {
      this.carritoService
        .update({ id: existing.id, cantidad: existing.cantidad + cantidad, articulo: { id: articulo.id } as any, usuario: { id: uid } as any })
        .subscribe({
          next: () => { this.showMessage('Cantidad actualizada en el carrito', 'success'); this.loadCarrito(); },
          error: () => this.showMessage('Error al actualizar carrito', 'danger'),
        });
    } else {
      this.carritoService
        .create({ cantidad, articulo: { id: articulo.id } as any, usuario: { id: uid } as any })
        .subscribe({
          next: () => { this.showMessage('Añadido al carrito', 'success'); this.loadCarrito(); },
          error: () => this.showMessage('Error al añadir al carrito', 'danger'),
        });
    }
  }

  removeFromCart(id: number): void {
    this.carritoService.delete(id).subscribe({
      next: () => { this.showMessage('Artículo eliminado del carrito', 'info'); this.loadCarrito(); },
      error: () => this.showMessage('Error al eliminar', 'danger'),
    });
  }

  updateCartCantidad(item: ICarrito, delta: number): void {
    const uid = this.session.getUserId();
    if (!uid) return;
    const newCantidad = item.cantidad + delta;
    if (newCantidad <= 0) {
      this.removeFromCart(item.id);
      return;
    }
    this.carritoService
      .update({ id: item.id, cantidad: newCantidad, articulo: { id: item.articulo?.id } as any, usuario: { id: uid } as any })
      .subscribe({
        next: () => this.loadCarrito(),
        error: () => this.showMessage('Error al actualizar', 'danger'),
      });
  }

  comprar(): void {
    if (this.carrito().length === 0) {
      this.showMessage('El carrito está vacío', 'danger');
      return;
    }
    this.comprando.set(true);
    this.paymentService.iniciarTienda().subscribe({
      next: (session) => {
        this.comprando.set(false);
        this.router.navigate(['/payment/checkout'], {
          state: { sessionToken: session.sessionToken },
        });
      },
      error: (err) => {
        this.comprando.set(false);
        this.showMessage(err?.error?.message ?? 'Error al iniciar el pago', 'danger');
      },
    });
  }

  totalCarrito(): number {
    return this.carrito().reduce(
      (acc, c) => acc + (c.articulo?.precio ?? 0) * (1 - (c.articulo?.descuento ?? 0) / 100) * c.cantidad,
      0,
    );
  }

  carritoItemCount(): number {
    return this.carrito().reduce((acc, c) => acc + c.cantidad, 0);
  }

  // ============================================================
  // COMENTARIOS Y PUNTUACIONES
  // ============================================================

  toggleComentarios(articuloId: number): void {
    if (this.expandedArticuloId() === articuloId) {
      this.expandedArticuloId.set(null);
    } else {
      this.expandedArticuloId.set(articuloId);
      if (!this.comentariosByArticulo()[articuloId]) {
        this.loadComentarios(articuloId);
      }
      if (this.miPuntuacion()[articuloId] === undefined) {
        this.loadMiPuntuacion(articuloId);
      }
    }
  }

  loadComentarios(articuloId: number): void {
    this.loadingComentarios.set({ ...this.loadingComentarios(), [articuloId]: true });
    this.comentarioartService.getPage(0, 1000, 'id', 'asc', '', articuloId).subscribe({
      next: (page) => {
        this.comentariosByArticulo.set({ ...this.comentariosByArticulo(), [articuloId]: page.content });
        this.loadingComentarios.set({ ...this.loadingComentarios(), [articuloId]: false });
      },
      error: () => this.loadingComentarios.set({ ...this.loadingComentarios(), [articuloId]: false }),
    });
  }

  loadMiPuntuacion(articuloId: number): void {
    const uid = this.session.getUserId();
    if (!uid) return;
    this.loadingPuntuacion.set({ ...this.loadingPuntuacion(), [articuloId]: true });
    this.puntuacionartService.getPage(0, 1000, 'id', 'asc', articuloId, uid).subscribe({
      next: (page) => {
        const mia = page.content.find((p) => p.usuario?.id === uid) ?? null;
        this.miPuntuacion.set({ ...this.miPuntuacion(), [articuloId]: mia });
        this.loadingPuntuacion.set({ ...this.loadingPuntuacion(), [articuloId]: false });
      },
      error: () => {
        this.miPuntuacion.set({ ...this.miPuntuacion(), [articuloId]: null });
        this.loadingPuntuacion.set({ ...this.loadingPuntuacion(), [articuloId]: false });
      },
    });
  }

  getComentarios(articuloId: number): IComentarioart[] {
    return this.comentariosByArticulo()[articuloId] ?? [];
  }

  getMiPuntuacion(articuloId: number): number {
    return this.miPuntuacion()[articuloId]?.puntuacion ?? 0;
  }

  setHoverStar(articuloId: number, star: number): void {
    this.hoverStar.set({ ...this.hoverStar(), [articuloId]: star });
  }

  clearHoverStar(articuloId: number): void {
    this.hoverStar.set({ ...this.hoverStar(), [articuloId]: 0 });
  }

  getStarDisplay(articuloId: number, star: number): 'filled' | 'empty' {
    const hover = this.hoverStar()[articuloId] ?? 0;
    const actual = this.getMiPuntuacion(articuloId);
    return star <= (hover || actual) ? 'filled' : 'empty';
  }

  ratearArticulo(articuloId: number, puntuacion: number): void {
    const uid = this.session.getUserId();
    if (!uid) return;
    const existing = this.miPuntuacion()[articuloId];
    if (existing) {
      this.puntuacionartService
        .update({ id: existing.id, puntuacion, articulo: { id: articuloId } as any, usuario: { id: uid } as any })
        .subscribe({
          next: (updated) => {
            this.miPuntuacion.set({ ...this.miPuntuacion(), [articuloId]: updated });
            this.showMessage('Puntuación actualizada', 'success');
          },
          error: () => this.showMessage('Error al actualizar la puntuación', 'danger'),
        });
    } else {
      this.puntuacionartService
        .create({ puntuacion, articulo: { id: articuloId } as any, usuario: { id: uid } as any })
        .subscribe({
          next: (created) => {
            this.miPuntuacion.set({ ...this.miPuntuacion(), [articuloId]: created });
            this.showMessage('¡Puntuación guardada!', 'success');
          },
          error: () => this.showMessage('Error al guardar la puntuación', 'danger'),
        });
    }
  }

  borrarPuntuacion(articuloId: number): void {
    const existing = this.miPuntuacion()[articuloId];
    if (!existing) return;
    this.puntuacionartService.delete(existing.id).subscribe({
      next: () => {
        const updated = { ...this.miPuntuacion() };
        updated[articuloId] = null;
        this.miPuntuacion.set(updated);
        this.showMessage('Puntuación eliminada', 'info');
      },
      error: () => this.showMessage('Error al eliminar la puntuación', 'danger'),
    });
  }

  getNuevoComentario(articuloId: number): string {
    return this.nuevoComentario()[articuloId] ?? '';
  }

  setNuevoComentario(articuloId: number, val: string): void {
    this.nuevoComentario.set({ ...this.nuevoComentario(), [articuloId]: val });
  }

  enviarComentario(articuloId: number): void {
    const uid = this.session.getUserId();
    const texto = this.getNuevoComentario(articuloId).trim();
    if (!uid || !texto) return;
    this.savingComentario.set(true);
    this.comentarioartService
      .create({ contenido: texto, articulo: { id: articuloId } as any, usuario: { id: uid } as any })
      .subscribe({
        next: () => {
          this.savingComentario.set(false);
          this.setNuevoComentario(articuloId, '');
          this.loadComentarios(articuloId);
          this.showMessage('Comentario añadido', 'success');
        },
        error: () => {
          this.savingComentario.set(false);
          this.showMessage('Error al añadir comentario', 'danger');
        },
      });
  }

  startEditComentario(comentario: IComentarioart): void {
    this.editingComentario.set({ id: comentario.id, contenido: comentario.contenido });
  }

  cancelEditComentario(): void {
    this.editingComentario.set(null);
  }

  guardarEditComentario(articuloId: number): void {
    const editing = this.editingComentario();
    if (!editing) return;
    const uid = this.session.getUserId();
    this.savingComentario.set(true);
    this.comentarioartService
      .update({ id: editing.id, contenido: editing.contenido, articulo: { id: articuloId } as any, usuario: { id: uid } as any })
      .subscribe({
        next: () => {
          this.savingComentario.set(false);
          this.editingComentario.set(null);
          this.loadComentarios(articuloId);
          this.showMessage('Comentario actualizado', 'success');
        },
        error: () => {
          this.savingComentario.set(false);
          this.showMessage('Error al actualizar comentario', 'danger');
        },
      });
  }

  eliminarComentario(comentarioId: number, articuloId: number): void {
    this.comentarioartService.delete(comentarioId).subscribe({
      next: () => {
        this.loadComentarios(articuloId);
        this.showMessage('Comentario eliminado', 'info');
      },
      error: () => this.showMessage('Error al eliminar comentario', 'danger'),
    });
  }

  esMioComentario(comentario: IComentarioart): boolean {
    return comentario.usuario?.id === this.session.getUserId();
  }

  private showMessage(msg: string, type: 'success' | 'danger' | 'info' = 'info'): void {
    this.message.set(msg);
    this.messageType.set(type);
    setTimeout(() => this.message.set(null), 5000);
  }
}


