import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { zuziAnimations } from '@zuzi/animations';
import { Observable, Subject, takeUntil } from 'rxjs';

import { AlertNotification, AlertNotificationService } from './alert-bar.service';

@Component({
    selector: 'alert-bar',
    templateUrl: './alert-bar.component.html',
    styleUrls: ['./alert-bar.component.scss'],
    animations: zuziAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertBarComponent implements OnInit, OnDestroy {
    notification: AlertNotification;
    notificationIndex = 0;
    notifications$: Observable<AlertNotification[]>;
    notifications: AlertNotification[];

    private _unsubAll = new Subject();

    constructor(
        private service: AlertNotificationService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.service
            .getAll()
            .pipe(takeUntil(this._unsubAll))
            .subscribe((notifications) => {
                this.notifications = notifications;
                this.notification = notifications[0];
                this.changeDetectorRef.markForCheck();
            });


    }

    ngOnDestroy(): void {
        this._unsubAll.next(null);
        this._unsubAll.complete();
        this.service.closeAll();
    }

    prev() {
        if (this.isFirst()) return;
        this.notificationIndex--;
        this.updateNotification();
    }

    next() {
        if (this.isLast()) return;
        this.notificationIndex++;
        this.updateNotification();
    }

    updateNotification() {
        this.notification = this.notifications[this.notificationIndex];
        this.changeDetectorRef.markForCheck();
    }

    isLast(): boolean {
        return this.notificationIndex === this.notifications.length - 1;
    }

    isFirst(): boolean {
        return this.notificationIndex === 0;
    }

    close = () => this.service.close();
}
