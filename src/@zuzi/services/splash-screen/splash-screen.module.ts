import { NgModule } from '@angular/core';
import { ZuziSplashScreenService } from '@zuzi/services/splash-screen/splash-screen.service';

@NgModule({
    providers: [ZuziSplashScreenService],
})
export class ZuziSplashScreenModule {

    constructor(private _zuziSplashScreenService: ZuziSplashScreenService) {}
}
