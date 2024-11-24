import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZuziCardComponent } from '@zuzi/components/card/card.component';

@NgModule({
    declarations: [ZuziCardComponent],
    imports: [CommonModule],
    exports: [ZuziCardComponent],
})
export class ZuziCardModule {}
