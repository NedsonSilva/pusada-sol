import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ZuziLoadingInterceptor } from '@zuzi/services/loading/loading.interceptor';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ZuziLoadingInterceptor,
            multi: true,
        },
    ],
})
export class ZuziLoadingModule {}
