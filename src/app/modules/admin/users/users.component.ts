import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UserFilter } from 'app/core/user/user.types';
import { ListBase } from 'app/models/base/list.base.types';
import { UsersService } from 'app/services/users/users.service';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent extends ListBase<User, UserFilter, UsersService> {

    constructor(
        protected injector: Injector,
        protected service: UsersService,
        private dialog: MatDialog
    ) {
        super(new UserFilter(), service, injector);
    }

    ngOnInit(): void {
        this.getAll()
    }

    openFormUser() {

    }

    teste($event) {
        console.log($event)
    }
}
