import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZuziMasonryComponent } from '@zuzi/components/masonry/masonry.component';

@NgModule({
    declarations: [ZuziMasonryComponent],
    imports: [CommonModule],
    exports: [ZuziMasonryComponent],
})
export class ZuziMasonryModule {}
