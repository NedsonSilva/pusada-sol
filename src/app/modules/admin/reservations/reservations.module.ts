import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SplitButtonModule } from 'app/shared/components/split-button/split-button.module';
import { FormSharedModule } from 'app/shared/form-shared.module';

import { ReservationsComponent } from './reservations.component';
import { reservationRoutes } from './reservations.routing';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { ContactsFormModule } from './form/form.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [ReservationsComponent],
    imports: [
        FormSharedModule,
        RouterModule.forChild(reservationRoutes),
        MatPaginatorModule,
        SplitButtonModule,
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        ContactsFormModule,
        MatDialogModule
    ],
    exports: [],
})
export class ReservationsModule {}
