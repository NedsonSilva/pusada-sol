import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserLevel } from 'app/core/user/user.types';
import { FormBase } from 'app/models/base/form.base';
import { RoomService } from 'app/services/Rooms/room.service';
import { Room } from 'app/services/Rooms/rooms.types';
import { UsersService } from 'app/services/users/users.service';

interface DialogData {
    room: Room;
}

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class RoomFormComponent extends FormBase implements OnInit {
    form = this.buildForm();

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: DialogData,
        private dialogRef: MatDialogRef<RoomFormComponent>,
        protected injector: Injector,
        private service: RoomService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.data?.room?.id) {
            this.form.patchValue({
                ...this.data.room,
            });
        }
    }

    protected buildForm() {
        return this.fb.group({
            id: [null as number],
            // type: ['', [Validators.required]],
            number: ['', [Validators.required]],
            capacity: [null as number, [Validators.required]],
            description: ['', [Validators.maxLength(255)]],
            status: ['available' as Room['status'], [Validators.required]],
            dailyPrice: [null as string, [Validators.required]],
        });
    }

    submitForm(): void {
        if (this.isNotSubmit()) return;

        const formData = this.form.getRawValue();

        this.form.disable();

        if (formData.id) {
            this.service.update(formData.id, formData).subscribe({
                next: () => {
                    this.dialogRef.close();
                    this.actionsSuccess();
                },
                error: () => {
                    this.form.enable();
                },
            });
        } else {
            this.service.create(formData).subscribe({
                next: () => {
                    this.dialogRef.close();
                    this.actionsSuccess();
                },
                error: () => {
                    this.form.enable();
                },
            });
        }
    }
}
