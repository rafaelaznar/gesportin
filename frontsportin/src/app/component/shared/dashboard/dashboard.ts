import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DashboardCard {
  title: string;
  icon: string;
  count: number;
  color: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  cards: DashboardCard[] = [
    {
      title: 'Clubes',
      icon: 'building',
      count: 0,
      color: 'primary',
      route: '/club'
    },
    {
      title: 'Noticias',
      icon: 'newspaper',
      count: 0,
      color: 'warning',
      route: '/noticia'
    },
    {
      title: 'Comentarios',
      icon: 'chat-left-text',
      count: 0,
      color: 'info',
      route: '/comentario'
    },
    {
      title: 'Puntuaciones',
      icon: 'star-fill',
      count: 0,
      color: 'secondary',
      route: '/puntuacion'
    },
    {
      title: 'Temporadas',
      icon: 'calendar',
      count: 0,
      color: 'danger',
      route: '/temporada'
    },
    {
      title: 'Categorías',
      icon: 'tags',
      count: 0,
      color: 'success',
      route: '/categoria'
    },
    {
      title: 'Equipos',
      icon: 'people-fill',
      count: 0,
      color: 'primary',
      route: '/equipo'
    },
    {
      title: 'Ligas',
      icon: 'trophy',
      count: 0,
      color: 'warning',
      route: '/liga'
    },
    {
      title: 'Partidos',
      icon: 'play-fill',
      count: 0,
      color: 'info',
      route: '/partido'
    },
    {
      title: 'Jugadores',
      icon: 'person-fill',
      count: 0,
      color: 'secondary',
      route: '/jugador'
    },
    {
      title: 'Cuotas',
      icon: 'credit-card',
      count: 0,
      color: 'danger',
      route: '/cuota'
    },
    {
      title: 'Pagos',
      icon: 'cash-coin',
      count: 0,
      color: 'success',
      route: '/pago'
    },
    {
      title: 'Artículos',
      icon: 'bag-fill',
      count: 0,
      color: 'primary',
      route: '/articulo'
    },
    {
      title: 'Tipos de Artículo',
      icon: 'bookmark-fill',
      count: 0,
      color: 'warning',
      route: '/tipoarticulo'
    },
    {
      title: 'Compras',
      icon: 'cart-fill',
      count: 0,
      color: 'info',
      route: '/compra'
    },
    {
      title: 'Facturas',
      icon: 'receipt',
      count: 0,
      color: 'secondary',
      route: '/factura'
    },
    {
      title: 'Carritos',
      icon: 'bag-check',
      count: 0,
      color: 'danger',
      route: '/carrito'
    },
    {
      title: 'Comentarios Artículos',
      icon: 'chat-dots',
      count: 0,
      color: 'success',
      route: '/comentarioart'
    },
    {
      title: 'Usuarios',
      icon: 'people',
      count: 0,
      color: 'primary',
      route: '/usuario'
    },
    {
      title: 'Tipos de Usuario',
      icon: 'tags-fill',
      count: 0,
      color: 'warning',
      route: '/tipousuario'
    },
    {
      title: 'Roles',
      icon: 'shield-check',
      count: 0,
      color: 'info',
      route: '/rolusuario'
    }
  ];
}
