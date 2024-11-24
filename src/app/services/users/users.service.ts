import { Injectable, Injector } from '@angular/core';
import { User, UserFilter } from 'app/core/user/user.types';
import { ServiceBase } from 'app/models/base/service.base';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersService extends ServiceBase<User, UserFilter> {
    constructor(protected injector: Injector) {
        super('/users', injector);
    }

    update(id: number, data: Partial<User>): Observable<User> {
        const url = `${this.urlBase}/${id}`;
        return this.http
            .put<User>(url, data)
            .pipe(tap((res) => this.upsertData(res)));
    }
}
