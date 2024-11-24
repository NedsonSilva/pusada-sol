import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ZuziConfirmModule } from '@zuzi/services/confirm';
import { ZuziLoadingModule } from '@zuzi/services/loading';
import { ZuziMediaWatcherModule } from '@zuzi/services/media-watcher/media-watcher.module';
import { ZuziPlatformModule } from '@zuzi/services/platform/platform.module';
import { ZuziSplashScreenModule } from '@zuzi/services/splash-screen/splash-screen.module';
import { ZuziUtilsModule } from '@zuzi/services/utils/utils.module';

@NgModule({
    imports: [
        ZuziConfirmModule,
        ZuziLoadingModule,
        ZuziMediaWatcherModule,
        ZuziPlatformModule,
        ZuziSplashScreenModule,
        ZuziUtilsModule,
    ],
    providers: [
        {
            // Disable 'theme' sanity check
            provide: MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme: false,
                version: true,
            },
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
    ],
})
export class ZuziModule {
    constructor(@Optional() @SkipSelf() parentModule?: ZuziModule) {
        if (parentModule) {
            throw new Error(
                'ZuziModule has already been loaded. Import this module in the AppModule only!'
            );
        }
    }
}
