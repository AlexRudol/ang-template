import { Routes } from '@angular/router';
import { NotFoundComponent } from './no-content/not-found';
import { PageComponent } from './page/page';

export const appRoutes: Routes = [
    { path: '', component: PageComponent },
    { path: ':page', component: PageComponent },
    { path: '**', component: NotFoundComponent }
];
