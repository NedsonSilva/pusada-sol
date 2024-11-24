import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ZuziConfirmService } from '@zuzi/services/confirm/confirm.service';
import { ZuziConfirmDialogComponent } from '@zuzi/services/confirm/dialog/dialog.component';

@NgModule({
    declarations: [ZuziConfirmDialogComponent],
    imports: [MatButtonModule, MatDialogModule, MatIconModule, CommonModule],
    providers: [ZuziConfirmService],
})
export class ZuziConfirmModule {
    constructor(private _zuziConfirmService: ZuziConfirmService) {}
}
