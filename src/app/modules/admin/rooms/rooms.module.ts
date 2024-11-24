import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SplitButtonModule } from 'app/shared/components/split-button/split-button.module';
import { FormSharedModule } from 'app/shared/form-shared.module';

import { ContactsFormModule } from '../reservations/form/form.module';
import { RoomFormComponent } from './form/form.component';
import { RoomsComponent } from './rooms.component';
import { roomsRoutes } from './rooms.routes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [RoomsComponent, RoomFormComponent],
    imports: [
        FormSharedModule,
        RouterModule.forChild(roomsRoutes),
        MatPaginatorModule,
        SplitButtonModule,
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        ContactsFormModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    exports: [],
})
export class RoomsModule {}
