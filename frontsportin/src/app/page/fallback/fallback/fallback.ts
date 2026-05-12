import { Component } from '@angular/core';

@Component({
  selector: 'app-fallback',
  imports: [],
  templateUrl: './fallback.html',
  styleUrl: './fallback.css',
})
export class Fallback {
  retry(): void {
    window.location.reload();
  }
}
