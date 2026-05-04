import { Component, Input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { INoticia } from '../../../../model/noticia';
import { NoticiaService } from '../../../../service/noticia';

@Component({
  standalone: true,
  selector: 'app-noticia-teamadmin-embedded',
  imports: [RouterLink, DatePipe],
  templateUrl: './embedded.html',
  styleUrl: './embedded.css',
})
export class NoticiaTeamadminEmbedded implements OnInit {
  @Input() noticiaId: number = 0;
  readonly strRole = 'teamadmin';

  noticia = signal<INoticia | null>(null);

  constructor(private noticiaService: NoticiaService) {}

  ngOnInit() {
    if (this.noticiaId > 0) {
      this.noticiaService.getById(this.noticiaId).subscribe({
        next: (data) => this.noticia.set(data),
        error: () => {},
      });
    }
  }
}
