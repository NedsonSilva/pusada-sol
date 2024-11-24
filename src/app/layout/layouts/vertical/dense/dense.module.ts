import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { ZuziFullscreenModule } from '@zuzi/components/fullscreen';
import { ZuziLoadingBarModule } from '@zuzi/components/loading-bar';
import { ZuziNavigationModule } from '@zuzi/components/navigation';
import { AlertBarModule } from 'app/layout/common/alert-bar/alert-bar.module';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { MessagesModule } from 'app/layout/common/messages/messages.module';
import { NotificationsModule } from 'app/layout/common/notifications/notifications.module';
import { QuickChatModule } from 'app/layout/common/quick-chat/quick-chat.module';
import { ShortcutsModule } from 'app/layout/common/shortcuts/shortcuts.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { DenseLayoutComponent } from 'app/layout/layouts/vertical/dense/dense.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [DenseLayoutComponent],
    imports: [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        ZuziFullscreenModule,
        ZuziLoadingBarModule,
        ZuziNavigationModule,
        LanguagesModule,
        MessagesModule,
        NotificationsModule,
        QuickChatModule,
        ShortcutsModule,
        UserModule,
        SharedModule,
        AlertBarModule,
    ],
    exports: [DenseLayoutComponent],
})
export class DenseLayoutModule {}
