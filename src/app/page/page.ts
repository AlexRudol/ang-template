import { Component, OnInit } from '@angular/core';
import { RESTService } from '../services/rest.service';
import { ActivatedRoute } from '@angular/router';
import { Page } from './page.model';

@Component({
    selector: 'page',
    templateUrl: 'page.html',
    styleUrls: ['page.scss']
})

export class PageComponent implements OnInit {

    public pageName: string;
    public page: Page = {
        'title': '',
        'subtitle': '',
        'content': '...'
    };

    constructor(
        public restService: RESTService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        console.log('[ PageComponent ]');

        this.route.params.subscribe(params => {
            if (params['page']) {
                this.pageName = params['page'];
                this.getPageContent();
            } else {
                this.pageName = 'home';
                this.getPageContent();
            }
        });

    }

    getPageContent() {
        this.restService.getPage(this.pageName).subscribe(data => {
            this.page = data as Page;
        },
        error => {
            this.page = {
                'title': 'Error 404',
                'subtitle': '',
                'content': '<p>No content found</p><a class="mat-raised-button" href="home" ><&nbsp; to the front page</a>'
            };
        });
    }

}
