import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTeamadminPlist } from '../../../../component/categoria/teamadmin/plist/plist';

@Component({
  selector: 'app-categoria-teamadmin-plist-page',
  imports: [CategoriaTeamadminPlist],
  templateUrl: './plist.html',
  styleUrl: './plist.css',
})
export class CategoriaTeamadminPlistPage {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
