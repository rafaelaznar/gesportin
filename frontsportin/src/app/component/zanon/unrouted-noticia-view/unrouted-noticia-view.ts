import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-unrouted-noticia-view',
  imports: [CommonModule],
  templateUrl: './unrouted-noticia-view.html',
  styleUrl: './unrouted-noticia-view.css',
})
export class UnroutedNoticiaView {

  private apiUrl = "http://localhost:8089/noticia";

  @Input() noticiaId!: number;
  noticiaSeleccionada: any;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    if (this.noticiaId) {
      this.http.get<any>(`${this.apiUrl}/${this.noticiaId}`).subscribe({
        next: data => this.noticiaSeleccionada = data,
        error: err => console.error(err)
      });
    }
  }
}
