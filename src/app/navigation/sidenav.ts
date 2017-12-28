import { Component, OnInit } from '@angular/core';
import { RESTService } from '../services/rest.service';

@Component({
    selector: 'sidenav',
    templateUrl: 'sidenav.html'
})

export class SidenavComponent implements OnInit {

    public menu;

    constructor(public restService: RESTService) {}

    ngOnInit() {
        console.log('[ SidenavComponent ]');

        this.restService.getMenu().subscribe(data => {
            this.menu = data;
        });

    }

}
