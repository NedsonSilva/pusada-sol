import { NgModule } from '@angular/core';

import { UserFormComponent } from './form.component';
import { FormSharedModule } from 'app/shared/form-shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [UserFormComponent],
    imports: [
        FormSharedModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    exports: [UserFormComponent],
})
export class UserFormModule {}
