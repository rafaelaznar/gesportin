import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  menuItems = signal<MenuItem[]>([
    {
      label: 'Home',
      icon: 'house-fill',
      route: '/'
    },
    {
      label: 'Clubes',
      icon: 'building',
      route: '/club',
      children: [
        {
          label: 'Noticias',
          icon: 'newspaper',
          children: [
            { label: 'Gestionar Noticias', icon: 'pencil-square', route: '/noticia' },
            { label: 'Comentarios', icon: 'chat-left-text', route: '/comentario' },
            { label: 'Puntuaciones', icon: 'star-fill', route: '/puntuacion' }
          ]
        },
        {
          label: 'Gestión de Club',
          icon: 'gear',
          children: [
            { label: 'Temporadas', icon: 'calendar', route: '/temporada' },
            { label: 'Categorías', icon: 'tags', route: '/categoria' },
            { label: 'Equipos', icon: 'people-fill', route: '/equipo' },
            { label: 'Ligas', icon: 'trophy', route: '/liga' },
            { label: 'Partidos', icon: 'play-fill', route: '/partido' },
            { label: 'Jugadores', icon: 'person-fill', route: '/jugador' },
            { label: 'Cuotas', icon: 'credit-card', route: '/cuota' },
            { label: 'Pagos', icon: 'cash-coin', route: '/pago' }
          ]
        },
        {
          label: 'Tienda',
          icon: 'shop',
          children: [
            { label: 'Artículos', icon: 'bag-fill', route: '/articulo' },
            { label: 'Tipos de Artículos', icon: 'bookmark-fill', route: '/tipoarticulo' },
            { label: 'Compras', icon: 'cart-fill', route: '/compra' },
            { label: 'Facturas', icon: 'receipt', route: '/factura' },
            { label: 'Carritos', icon: 'bag-check', route: '/carrito' },
            { label: 'Comentarios de Artículos', icon: 'chat-dots', route: '/comentarioart' }
          ]
        }
      ]
    },
    {
      label: 'Usuarios',
      icon: 'people',
      route: '/usuario',
      children: [
        { label: 'Tipos de Usuario', icon: 'tags-fill', route: '/tipousuario' },
        { label: 'Roles de Usuario', icon: 'shield-check', route: '/rolusuario' }
      ]
    }
  ]);

  toggleMenu(item: MenuItem) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  isMenuItemActive(route?: string): boolean {
    if (!route) return false;
    // Esta lógica se mejorará con ActivatedRoute si es necesario
    return false;
  }
}
