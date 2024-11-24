import { Injectable, TemplateRef } from '@angular/core';
import { ZuziAlertType } from '@zuzi/components/alert';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AlertNotification {
    id: string;
    messages: string;
    actions?: TemplateRef<any>;
    type?: ZuziAlertType;
    isCloseable?: boolean;
    duration?: number;
    isRemoveble?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AlertNotificationService {
    private _notifications$ = new BehaviorSubject<AlertNotification[]>([]);

    constructor() {}

    getAll(): Observable<AlertNotification[]> {
        return this._notifications$.asObservable();
    }

    open(notifications: AlertNotification[]) {
        this._notifications$.next(notifications)
    }

    add(notification: AlertNotification, insertTo: 'push'|'unshift' = 'push', focus = false) {
        const notifications = this._notifications$.getValue();

        const index = notifications.findIndex(n => n.id === notification.id)

        if (index !== -1) {
            notifications[index] = notification;
        } else {
            notifications[insertTo](notification);
        }

        this._notifications$.next(notifications);
    }

    private autoClose(isCloseable: boolean, duration: number) {
        if (!duration && !isCloseable) {
            return;
        };
    }

    close(force?: boolean, removeLastNotification = false) {
    }

    closeAll() {
        this._notifications$.next([]);
    }

    closeById(id: string) {
        const notifications = this._notifications$.getValue();

        const index = notifications.findIndex(n => n?.id === id);
        if (index !== -1) {
            notifications.splice(index, 1);
            this._notifications$.next(notifications)
        }
    }
    // close(force?: boolean, removeLastNotification = false) {
    //     if (this._notifications$.value?.isCloseable || force) {
    //         this._notifications$.next({ messages: []});
    //     }
    //     if (this._notifications$.value.isRemoveble || removeLastNotification) {
    //         this.lastNotification = null;
    //     }
    // }
}
