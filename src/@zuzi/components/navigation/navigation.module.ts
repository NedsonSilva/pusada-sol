import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import {
    ZuziHorizontalNavigationBasicItemComponent,
} from '@zuzi/components/navigation/horizontal/components/basic/basic.component';
import {
    ZuziHorizontalNavigationBranchItemComponent,
} from '@zuzi/components/navigation/horizontal/components/branch/branch.component';
import {
    ZuziHorizontalNavigationDividerItemComponent,
} from '@zuzi/components/navigation/horizontal/components/divider/divider.component';
import {
    ZuziHorizontalNavigationSpacerItemComponent,
} from '@zuzi/components/navigation/horizontal/components/spacer/spacer.component';
import { ZuziHorizontalNavigationComponent } from '@zuzi/components/navigation/horizontal/horizontal.component';
import {
    ZuziVerticalNavigationAsideItemComponent,
} from '@zuzi/components/navigation/vertical/components/aside/aside.component';
import {
    ZuziVerticalNavigationBasicItemComponent,
} from '@zuzi/components/navigation/vertical/components/basic/basic.component';
import {
    ZuziVerticalNavigationCollapsableItemComponent,
} from '@zuzi/components/navigation/vertical/components/collapsable/collapsable.component';
import {
    ZuziVerticalNavigationDividerItemComponent,
} from '@zuzi/components/navigation/vertical/components/divider/divider.component';
import {
    ZuziVerticalNavigationGroupItemComponent,
} from '@zuzi/components/navigation/vertical/components/group/group.component';
import {
    ZuziVerticalNavigationSpacerItemComponent,
} from '@zuzi/components/navigation/vertical/components/spacer/spacer.component';
import { ZuziVerticalNavComponent } from '@zuzi/components/navigation/vertical/vertical.component';
import { ZuziScrollbarModule } from '@zuzi/directives/scrollbar/public-api';

@NgModule({
    declarations: [
        ZuziHorizontalNavigationBasicItemComponent,
        ZuziHorizontalNavigationBranchItemComponent,
        ZuziHorizontalNavigationDividerItemComponent,
        ZuziHorizontalNavigationSpacerItemComponent,
        ZuziHorizontalNavigationComponent,
        ZuziVerticalNavigationAsideItemComponent,
        ZuziVerticalNavigationBasicItemComponent,
        ZuziVerticalNavigationCollapsableItemComponent,
        ZuziVerticalNavigationDividerItemComponent,
        ZuziVerticalNavigationGroupItemComponent,
        ZuziVerticalNavigationSpacerItemComponent,
        ZuziVerticalNavComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        ZuziScrollbarModule,
        MatTooltipModule
    ],
    exports: [
        ZuziHorizontalNavigationComponent,
        ZuziVerticalNavComponent,
    ],
})
export class ZuziNavigationModule {}
