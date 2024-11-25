import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { SplitButtonModule } from 'app/shared/components/split-button/split-button.module';

import { UsersComponent } from './users.component';
import { usersRoutes } from './users.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UserFormModule } from './form/form.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [UsersComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(usersRoutes),
        MatPaginatorModule,
        SplitButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        UserFormModule
    ],
    exports: [],
    providers: [],
})
export class UsersModule {}
