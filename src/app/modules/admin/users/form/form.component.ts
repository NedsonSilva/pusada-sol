import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ZuziValidators } from '@zuzi/validators';
import { User, UserLevel } from 'app/core/user/user.types';
import { FormBase } from 'app/models/base/form.base';
import { UsersService } from 'app/services/users/users.service';

interface DialogData {
    user: User;
}

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class UserFormComponent extends FormBase implements OnInit {
    form = this.buildForm();

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: DialogData,
        private dialogRef: MatDialogRef<UserFormComponent>,
        protected injector: Injector,
        private service: UsersService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.data?.user) {
            this.form.patchValue({
                ...this.data.user,
                password: null,
            });
        } else {
            this.form.get('password').addValidators(Validators.required);
            this.form.get('confirmPassword').setValidators(Validators.required);
        }
    }

    protected buildForm() {
        return this.fb.group(
            {
                id: [null as number],
                name: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                profile: [null as UserLevel, [Validators.required]],
                password: ['', [Validators.min(6)]],
                confirmPassword: '',
            },
            {
                validators: [
                    ZuziValidators.mustMatch('password', 'confirmPassword'),
                ],
            }
        );
    }

    submitForm(): void {
        if (this.isNotSubmit()) return;

        const formData = this.form.getRawValue();

        this.form.disable();
        this.service.update(formData.id, formData).subscribe({
            next: () => {
                this.dialogRef.close();
                this.actionsSuccess()
            },
            error: () => {
                this.form.enable()
            }
        })
    }
}
