import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

import { appRoutes } from './app.routes';
import { RESTService } from './services/rest.service';

import { AppComponent } from './app';
import { NotFoundComponent } from './no-content/not-found';
import { SidenavComponent } from './navigation/sidenav';
import { PageComponent } from './page/page';


@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent,
        NotFoundComponent,
        SidenavComponent,
        PageComponent
    ],
    imports: [
        RouterModule.forRoot(appRoutes, {
            useHash: Boolean(history.pushState) === false,
            enableTracing: false
        }),
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,

        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule
    ],
    providers: [
        RESTService,
    ],
})

export class AppModule {}
