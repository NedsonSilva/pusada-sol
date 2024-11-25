import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { SplitButtonModule } from 'app/shared/components/split-button/split-button.module';
import { FormSharedModule } from 'app/shared/form-shared.module';
import { NgxMaskPipe } from 'ngx-mask';

import { ContactsFormModule } from '../reservations/form/form.module';
import { ClientsComponent } from './clients.component';
import { clientsRoutes } from './clients.routes';
import { ClientFormComponent } from './form/form.component';

@NgModule({
    declarations: [ClientsComponent, ClientFormComponent],
    imports: [
        FormSharedModule,
        RouterModule.forChild(clientsRoutes),
        MatPaginatorModule,
        SplitButtonModule,
        MatSortModule,
        MatMenuModule,
        ContactsFormModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        NgxMaskPipe
    ],
    exports: [],
})
export class ClientsModule {}
