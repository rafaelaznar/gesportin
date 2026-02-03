import { Component, Input } from '@angular/core';
import { IClub } from '../../../model/club';

@Component({
    selector: 'app-unrouted-admin-view',
    imports: [],
    templateUrl: './unrouted-admin-view.html',
    styleUrl: './unrouted-admin-view.css'
})
export class UnroutedAdminView {
    @Input() oClub: IClub | null = null;
}