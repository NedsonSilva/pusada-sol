import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { ZUZI_MOCK_API_DEFAULT_DELAY } from '@zuzi/lib/mock-api/mock-api.constants';
import { ZuziMockApiInterceptor } from '@zuzi/lib/mock-api/mock-api.interceptor';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ZuziMockApiInterceptor,
            multi: true,
        },
    ],
})
export class ZuziMockApiModule {

    static forRoot(
        mockApiServices: any[],
        config?: { delay?: number }
    ): ModuleWithProviders<ZuziMockApiModule> {
        return {
            ngModule: ZuziMockApiModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    deps: [...mockApiServices],
                    useFactory: () => (): any => null,
                    multi: true,
                },
                {
                    provide: ZUZI_MOCK_API_DEFAULT_DELAY,
                    useValue: config?.delay ?? 0,
                },
            ],
        };
    }
}
