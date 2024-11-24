import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, signal } from '@angular/core';
import { User, UserFilter } from 'app/core/user/user.types';
import { PaginateBase } from 'app/models/base/paginate.types';
import { ServiceBase } from 'app/models/base/service.base';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';
import { AuthUtils } from '../auth/auth.utils';

@Injectable({
    providedIn: 'root',
})
export class UserService extends ServiceBase<User, UserFilter> {
    readonly urlBase = environment.apiUrl + '/users';
    // private _user: BehaviorSubject<User> = new BehaviorSubject<User>(AuthUtils.decodeToken());
    readonly user = signal<User>(AuthUtils.decodeToken())

    constructor(protected injector: Injector) {
        super('/users', injector)
    }

    get(): Observable<User> {
        const token = AuthUtils.decodeToken();

        if (!token) return;

        const url = `${this.urlBase}/${token.id}`;
        return this.http.get<User>(url).pipe(
            map((user) => {
                this.user.set(user);
                return user;
            })
        );
    }

    update(user: User): Observable<any> {
        return this.http.patch<User>('api/common/user', { user }).pipe(
            map((user) => {
                this.user.set(user);
                return user
            })
        );
    }
}
