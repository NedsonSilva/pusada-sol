import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ZuziFullscreenComponent } from '@zuzi/components/fullscreen/fullscreen.component';

@NgModule({
    declarations: [ZuziFullscreenComponent],
    imports: [MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
    exports: [ZuziFullscreenComponent],
})
export class ZuziFullscreenModule {}
