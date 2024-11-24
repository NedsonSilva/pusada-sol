import { NgModule } from '@angular/core';
import { ZuziPlatformService } from '@zuzi/services/platform/platform.service';

@NgModule({
    providers: [ZuziPlatformService],
})
export class ZuziPlatformModule {
   
    constructor(private _zuziPlatformService: ZuziPlatformService) {}
}
