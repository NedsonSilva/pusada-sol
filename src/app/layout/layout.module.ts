import { NgModule } from '@angular/core';
import { SettingsModule } from 'app/layout/common/settings/settings.module';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { DenseLayoutModule } from 'app/layout/layouts/vertical/dense/dense.module';
import { SharedModule } from 'app/shared/shared.module';

const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // Vertical navigation
    DenseLayoutModule,
];

@NgModule({
    declarations: [LayoutComponent],
    imports: [SharedModule, SettingsModule, ...layoutModules],
    exports: [LayoutComponent, ...layoutModules],
})
export class LayoutModule {}
