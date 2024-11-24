import { Injectable, Injector } from '@angular/core';
import { User, UserFilter } from 'app/core/user/user.types';
import { ServiceBase } from 'app/models/base/service.base';

@Injectable({
    providedIn: 'root',
})
export class UsersService extends ServiceBase<User, UserFilter> {
    constructor(protected injector: Injector) {
        super('/users', injector);
    }
}
