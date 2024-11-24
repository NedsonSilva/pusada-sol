import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AlertBarComponent } from './alert-bar.component';
import { AlertNotificationService } from './alert-bar.service';
import { ZuziAlertModule } from '@zuzi/components/alert';


@NgModule({
    declarations: [
        AlertBarComponent
    ],
    imports: [
        CommonModule,
        ZuziAlertModule,
        MatButtonModule,
        MatPaginatorModule,
        MatIconModule,
        MatRippleModule
    ],
    exports: [
        AlertBarComponent
    ],
    providers: [
        AlertNotificationService,
    ]
})
export class AlertBarModule { }
