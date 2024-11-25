import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { buildFilter } from 'app/shared/utils/build-filter';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Client, ClientFilter, ClientPaginate } from './clients.types';

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    private _clients = new BehaviorSubject<ClientPaginate>(null);
    readonly urlBase = environment.apiUrl + '/clients';

    constructor(private http: HttpClient) {}

    get clients$() {
        return this._clients.asObservable();
    }

    getAll(filter = new ClientFilter()) {
        const filterParams = buildFilter(filter, { stringifyArray: true });
        const url = `${this.urlBase}?${filterParams}`;
        return this.http.get<ClientPaginate>(url).pipe(
            tap((res) => this._clients.next(res))
        )
    }

    create(data: Client): Observable<Client> {
        return this.http
            .post<Client>(this.urlBase, data)
            .pipe(tap((res) => this.upsertData(res)));
    }

    update(id: number, data: Partial<Client>) {
        const url = `${this.urlBase}/${id}`;
        return this.http
            .put<Client>(url, data)
            .pipe(tap((res) => this.upsertData(res)));
    }

    delete(id: number) {
        const url = `${this.urlBase}/${id}`;
        return this.http
            .delete<Client>(url)
            .pipe(tap(() => {
                const dataArray = this._clients.getValue();
                const index = dataArray.data.findIndex((item) => item.id === id);
                if (index !== -1) {
                    dataArray.data.splice(index, 1);
                    dataArray.count--;
                    this._clients.next(dataArray);
                }
            }));
    }

    private upsertData(data: Client) {
        const dataArray = this._clients.getValue();

        const index = dataArray.data.findIndex((item) => item.id === data.id);
        if (index !== -1) {
            dataArray.data[index] = data;
        } else {
            dataArray.data.push(data);
            dataArray.count++;
        }
        this._clients.next(dataArray);
    }
}
