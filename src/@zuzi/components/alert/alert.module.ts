import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ZuziAlertComponent } from '@zuzi/components/alert/alert.component';

@NgModule({
    declarations: [ZuziAlertComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule],
    exports: [ZuziAlertComponent],
})
export class ZuziAlertModule {}
