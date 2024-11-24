import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBase } from 'app/models/base/form.base';
import { Contact } from 'app/models/contacts.types';
import { ContactService } from 'app/services/contacts/contacts.service';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class ContactsFormComponent extends FormBase implements OnInit {
    form = this.buildForm();

    constructor(
        protected injector: Injector,
        private contactService: ContactService,
        @Inject(MAT_DIALOG_DATA)
        public contact: Contact,
        private dialogRef: MatDialogRef<ContactsFormComponent>,
    ) {
        super(injector)
    }

    ngOnInit(): void {
        if (this.contact) {
            this.form.patchValue(this.contact);
        }
    }

    buildForm() {
        return this.fb.group({
            id: [''],
            name: ['', [Validators.required]],
            phone: ['', Validators.required],
            email: '',
        })
    }

    submitForm(): void {
        if (this.isNotSubmit()) return;

        this.form.disable();

        this.contact ? this.update() : this.create()
    }

    create() {
        const formData = this.form.getRawValue() as any;

        this.contactService.create(formData).subscribe({
            next: () => {
                this.dialogRef.close();
                this.toastService.success('Salvo com sucesso')
            },
            error: () => this.form.enable()
        })
    }

    update() {
        const formData = this.form.getRawValue() as any;

        this.contactService.update(this.contact.id, formData).subscribe({
            next: () => {
                this.dialogRef.close();
                this.toastService.success('Salvo com sucesso')
            },
            error: () => this.form.enable()
        })
    }
}
