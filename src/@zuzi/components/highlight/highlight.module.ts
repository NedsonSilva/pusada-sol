import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZuziHighlightComponent } from '@zuzi/components/highlight/highlight.component';

@NgModule({
    declarations: [ZuziHighlightComponent],
    imports: [CommonModule],
    exports: [ZuziHighlightComponent],
})
export class ZuziHighlightModule {}
