import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from 'app/models/contacts.types';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Reservation, ReservationFilter, ReservationPaginate } from './reservations.types';
import { buildFilter } from 'app/shared/utils/build-filter';

@Injectable({
    providedIn: 'root',
})
export class ReservationService {
    private _reservations = new BehaviorSubject<ReservationPaginate>(null);
    readonly urlBase = environment.apiUrl + '/reservations';

    constructor(private http: HttpClient) {}

    get reservations$() {
        return this._reservations.asObservable();
    }

    getAll(filter = new ReservationFilter()) {
        const filterParams = buildFilter(filter, { stringifyArray: true });
        const url = `${this.urlBase}?${filterParams}`;
        return this.http.get<ReservationPaginate>(url).pipe(
            tap((res) => this._reservations.next(res))
        )
    }

    create(data: Contact): Observable<Reservation> {
        return this.http
            .post<Reservation>(this.urlBase, data)
            .pipe(tap((res) => this.upsertData(res)));
    }

    update(id: number, data: Partial<Reservation>) {
        const url = `${this.urlBase}/${id}`;
        return this.http
            .put<Reservation>(url, data)
            .pipe(tap((res) => this.upsertData(res)));
    }

    delete(id: number) {
        const url = `${this.urlBase}/${id}`;
        return this.http
            .delete<Reservation>(url)
            .pipe(tap(() => {
                const dataArray = this._reservations.getValue();
                const index = dataArray.data.findIndex((item) => item.id === id);
                if (index !== -1) {
                    dataArray.data.splice(index, 1);
                    dataArray.count--;
                    this._reservations.next(dataArray);
                }
            }));
    }

    private upsertData(data: Reservation) {
        const resevations = this._reservations.getValue();

        const index = resevations.data.findIndex((item) => item.id === data.id);
        if (index !== -1) {
            resevations.data[index] = data;
        } else {
            resevations.data.push(data);
            resevations.count++;
        }
        this._reservations.next(resevations);
    }
}
