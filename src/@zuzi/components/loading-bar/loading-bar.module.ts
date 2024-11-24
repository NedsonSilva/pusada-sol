import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ZuziLoadingBarComponent } from '@zuzi/components/loading-bar/loading-bar.component';

@NgModule({
    declarations: [ZuziLoadingBarComponent],
    imports: [CommonModule, MatProgressBarModule],
    exports: [ZuziLoadingBarComponent],
})
export class ZuziLoadingBarModule {}
