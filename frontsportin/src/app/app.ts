import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './component/shared/menu/menu';
import { SidebarComponent } from './component/shared/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontsportin');
}
