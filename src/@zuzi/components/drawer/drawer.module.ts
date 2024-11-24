import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZuziDrawerComponent } from '@zuzi/components/drawer/drawer.component';

@NgModule({
    declarations: [ZuziDrawerComponent],
    imports: [CommonModule],
    exports: [ZuziDrawerComponent],
})
export class ZuziDrawerModule {}
