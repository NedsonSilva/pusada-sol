import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserComponent } from 'app/layout/common/user/user.component';
import { SharedModule } from 'app/shared/shared.module';
import { ToggleThemeSchemeComponent } from '../toggle-theme-scheme/toggle-theme-scheme.component';

@NgModule({
    declarations: [UserComponent],
    imports: [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        SharedModule,
        ToggleThemeSchemeComponent
    ],
    exports: [UserComponent],
})
export class UserModule {}
