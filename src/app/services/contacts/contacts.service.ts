import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ServiceBase } from 'app/models/base/service.base';
import { Contact, ContactFilter } from 'app/models/contacts.types';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ContactService extends ServiceBase<Contact, ContactFilter> {
    constructor(protected injector: Injector) {
        super('/contacts', injector);
    }

    create(data: Contact): Observable<Contact> {
        return this.http.post<Contact>(this.urlBase, data).pipe(
            tap((res) => this.upsertData(res))
        )
    }

    update(id: string, data: Partial<Contact>) {
        const url = `${this.urlBase}/${id}`;
        return this.http.put<Contact>(url, data).pipe(
            tap((res) => this.upsertData(res))
        )
    }
}
