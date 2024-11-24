import { ModuleWithProviders, NgModule } from '@angular/core';
import { ZuziConfigService } from '@zuzi/services/config/config.service';
import { ZUZI_APP_CONFIG } from '@zuzi/services/config/config.constants';

@NgModule()
export class ZuziConfigModule {

    constructor(private _zuziConfigService: ZuziConfigService) {}

    static forRoot(config: any): ModuleWithProviders<ZuziConfigModule> {
        return {
            ngModule: ZuziConfigModule,
            providers: [
                {
                    provide: ZUZI_APP_CONFIG,
                    useValue: config,
                },
            ],
        };
    }
}
