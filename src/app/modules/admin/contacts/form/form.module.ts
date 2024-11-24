import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormSharedModule } from 'app/shared/form-shared.module';

import { ContactsFormComponent } from './form.component';

@NgModule({
    declarations: [ContactsFormComponent],
    imports: [
        FormSharedModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    exports: [],
})
export class ContactsFormModule {}
