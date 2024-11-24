import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ZuziConfirmService } from '@zuzi/services/confirm';
import { PaginateBase } from 'app/models/base/paginate.types';
import { Contact, ContactFilter } from 'app/models/contacts.types';
import { ContactService } from 'app/services/contacts/contacts.service';
import { delay } from 'rxjs';
import { ContactsFormComponent } from './form/form.component';
import { ToastService } from 'angular-toastify';
import { clone, cloneDeep } from 'lodash';

@Component({
    selector: 'contacts',
    templateUrl: './contacts.component.html',
    styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
    contacts: PaginateBase<Contact>;
    filter = new ContactFilter();
    displayedColumns: string[] = ['name', 'phone', 'email', 'createdAt', 'action'];
    loading = signal(false);

    constructor(
        private contactService: ContactService,
        private confirmService: ZuziConfirmService,
        private dialog: MatDialog,
        private toastService: ToastService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getContacts();

        this.contactService.data$.subscribe(data => {
            this.contacts = cloneDeep(data);
        })
    }

    getContacts() {
        if (this.loading()) return;

        this.loading.set(true);

        this.contactService.getAll(this.filter).subscribe({
            next: data => {
                this.loading.set(false);
                this.contacts = cloneDeep(data);
                this.changeDetectorRef.markForCheck();
            },
            error: () => {
                this.loading.set(false)
            }
        })
    }

    deleteContact(contact: Contact) {
        const dialog = this.confirmService.open(
            {
                title: 'Excluir contato',
                message: `Deseja realmente excluir o contato ${contact.name}?`,
            },
            () => {
                this.contactService.delete(contact.id).subscribe(() => {
                    this.toastService.success('Contato excluido com sucesso!');
                })
            }
        )
    }

    openModalFormContact(contact?: Contact) {
        this.dialog.open(ContactsFormComponent, {
            data: contact,
            autoFocus: true
        })
    }

    setPage(event: PageEvent) {
        this.filter.pageNumber = event.pageIndex + 1;
        this.filter.perPage = event.pageSize;
        this.getContacts();
    }

    trackByFn(data) {
        return data.id
    }
}
