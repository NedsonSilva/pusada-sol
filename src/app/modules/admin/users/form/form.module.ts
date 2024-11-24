import { NgModule } from '@angular/core';

import { UserFormComponent } from './form.component';
import { FormSharedModule } from 'app/shared/form-shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [UserFormComponent],
    imports: [
        FormSharedModule,
        MatDialogModule
    ],
    exports: [UserFormComponent],
})
export class UserFormModule {}
