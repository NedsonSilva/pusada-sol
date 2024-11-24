import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UserFilter } from 'app/core/user/user.types';
import { ListBase } from 'app/models/base/list.base.types';
import { UsersService } from 'app/services/users/users.service';

import { UserFormComponent } from './form/form.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
})
export class UsersComponent extends ListBase<User, UserFilter, UsersService> {
    readonly users = toSignal(this.service.data$);

    constructor(
        protected injector: Injector,
        protected service: UsersService,
        private dialog: MatDialog
    ) {
        super(new UserFilter(), service, injector);
    }

    ngOnInit(): void {
        this.getAll();
    }

    openFormUser(user?: User) {
        this.dialog.open(UserFormComponent, {
            data: { user: { ...user } },
            maxWidth: '95vw',
            maxHeight: '85vh',
        });
    }


    remove(user: User) {
        this.confirmService.open(
            {
                message: 'Tem certeza que deseja excluir o usuário?',
                title: 'Excluir Usuário',

            },
            () => {
                this.loading.set(true)
                this.service.delete(user.id).subscribe({
                    next: () => {
                        this.toastService.success('Usuário excluido com sucesso');
                        this.loading.set(false);
                    },
                    error: () => this.loading.set(false),
                });
            }
        )
    }
}
