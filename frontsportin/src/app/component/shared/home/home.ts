import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard';

@Component({
  selector: 'app-home',
  imports: [DashboardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home {

}
