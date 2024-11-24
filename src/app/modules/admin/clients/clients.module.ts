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
import { ClientsComponent } from './clients.component';
import { clientsRoutes } from './clients.routes';

@NgModule({
    declarations: [ClientsComponent],
    imports: [
        FormSharedModule,
        RouterModule.forChild(clientsRoutes),
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
export class ClientsModule {}
