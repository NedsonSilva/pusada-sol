import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SplitButtonItemComponent } from './item/item.component';
import { SplitButtonComponent } from './split-button.component';

@NgModule({
    declarations: [SplitButtonComponent, SplitButtonItemComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatIconModule,
        MatRippleModule,
    ],
    exports: [SplitButtonComponent, SplitButtonItemComponent],
})
export class SplitButtonModule {}
