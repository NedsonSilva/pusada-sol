import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { ZuziModule } from '@zuzi';
import { ZuziMockApiModule } from '@zuzi/lib/mock-api';
import { ZuziConfigModule } from '@zuzi/services/config';
import { AngularToastifyModule } from 'angular-toastify';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { appConfig } from 'app/core/config/app.config';
import { CoreModule } from 'app/core/core.module';
import { LayoutModule } from 'app/layout/layout.module';
import { mockApiServices } from 'app/mock-api';
import { SocketIoModule } from 'ngx-socket-io';

import { APP_PROVIDERS } from './app.providers';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        ZuziModule,
        ZuziConfigModule.forRoot(appConfig),
        ZuziMockApiModule.forRoot(mockApiServices),
        CoreModule,
        LayoutModule,
        AngularToastifyModule,
        SocketIoModule,
    ],
    bootstrap: [AppComponent],
    providers: APP_PROVIDERS,
})
export class AppModule {}
