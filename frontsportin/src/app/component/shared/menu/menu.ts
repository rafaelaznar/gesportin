import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IJWT } from '../../../model/token';

@Component({
  selector: 'app-menu',
  imports: [RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  activeRoute: string = '';
  isSessionActive: boolean = false;
  oTokenJWT: IJWT | null = null;

  constructor(private oRouter: Router) {
    this.oRouter.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
  }

  ngOnInit(): void {
  }
}
