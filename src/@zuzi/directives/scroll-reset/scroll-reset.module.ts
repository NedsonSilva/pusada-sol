import { NgModule } from '@angular/core';
import { ZuziScrollResetDirective } from '@zuzi/directives/scroll-reset/scroll-reset.directive';

@NgModule({
    declarations: [ZuziScrollResetDirective],
    exports: [ZuziScrollResetDirective],
})
export class ZuziScrollResetModule {}
