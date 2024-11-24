import { NgModule } from '@angular/core';
import { ZuziScrollbarDirective } from '@zuzi/directives/scrollbar/scrollbar.directive';

@NgModule({
    declarations: [ZuziScrollbarDirective],
    exports: [ZuziScrollbarDirective],
})
export class ZuziScrollbarModule {}
