import { NgModule } from '@angular/core';
import { ZuziUtilsService } from '@zuzi/services/utils/utils.service';

@NgModule({
    providers: [ZuziUtilsService],
})
export class ZuziUtilsModule {
    
    constructor(private _zuziUtilsService: ZuziUtilsService) {}
}
