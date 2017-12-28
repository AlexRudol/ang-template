import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RESTService {

    constructor( private http: HttpClient ) {}

    private makeRequest(path: string) {
        let url = `assets/data/${path}.json`;
        return this.http.get(url)
            .map(response => response);
    }

    getMenu() {
        return this.makeRequest('menu');
    }

    getPage(page: string) {
        return this.makeRequest(page);
    }

}
