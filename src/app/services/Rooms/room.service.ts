import { Injectable, Injector } from '@angular/core';
import { ServiceBase } from 'app/models/base/service.base';
import { Observable, tap } from 'rxjs';

import { Room, RoomFilter } from './rooms.types';

@Injectable({
    providedIn: 'root',
})
export class RoomService extends ServiceBase<Room, RoomFilter> {
    constructor(protected injector: Injector) {
        super('/rooms', injector);
    }

    update(id: number, data: Partial<Room>): Observable<Room> {
        const url = `${this.urlBase}/${id}`;
        return this.http
            .put<Room>(url, data)
            .pipe(tap((res) => this.upsertData(res)));
    }

    create(data: Partial<Room>): Observable<Room> {
        return this.http
            .post<Room>(this.urlBase, data)
            .pipe(tap((res) => this.upsertData(res)));
    }
}
