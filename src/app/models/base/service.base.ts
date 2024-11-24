import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { PaginateBase } from './paginate.types';
import { FilterBase } from './filter.base';
import { buildFilter } from 'app/shared/utils/build-filter';
import { clone } from 'lodash';

export class Data {
    id: number | string;
}

@Injectable()
export abstract class ServiceBase<T extends Data, F extends FilterBase> {
    public filter: F;
    protected http: HttpClient;
    protected urlBase = environment.apiUrl;
    protected _data = new BehaviorSubject<PaginateBase<T>>(new PaginateBase<T>());
    protected _dataNoPage = new BehaviorSubject<T[]>([]);

    constructor(protected path: string, protected injector: Injector) {
        this.http = injector.get(HttpClient);
        this.urlBase = `${this.urlBase}${this.path}`;
    }


    get data$() {
        return this._data.asObservable();
    }

    getAll(filter?: F): Observable<PaginateBase<T>> {
        const url = filter ? `${this.urlBase}?${buildFilter(filter)}` : this.urlBase;
        return this.http.get<PaginateBase<T>>(url).pipe(
            map(data => {
                this._data.next(data);
                return data;
            })
        )
    }

    getById(id: T['id']) {
        this.http.get<T>(`${this.path}/${id}`).pipe(
            map(data => {
                this.upsertData(data);
                return data;
            })
        );
    }

    getAllNotPaginated(filter?: F): Observable<T[]> {
        const url = filter ? `${this.urlBase}?${buildFilter(filter)}` : this.urlBase;
        return this.http.get<T[]>(url).pipe(
            map(data => {
                this._dataNoPage.next(data);
                return data;
            })
        )
    }

    delete(id: T['id']): Observable<any> {
        const url = `${this.urlBase}/${id}`;
        return this.http.delete(url).pipe(
            tap(() => {
                const dataArray = this._data.getValue();
                const index = dataArray.data.findIndex((item) => item.id === id);

                if (index !== -1) {
                    dataArray.data.splice(index, 1);
                    dataArray.count--;
                    this._data.next(dataArray);
                }
            })
        );
    }

    protected upsertData(data: T) {
        const dataArray = this._data.getValue();
        const index = dataArray.data.findIndex((item) => item.id === data.id);

        if (index !== -1) {
            dataArray.data[index] = clone(data);
        } else {
            dataArray.count++;
            dataArray.data.unshift(data);
        }

        this._data.next(dataArray);
    }

    protected upsertNoPage(data: T) {
        const dataArray = this._dataNoPage.getValue();
        const index = dataArray.findIndex((item) => item.id === data.id);

        if (index !== -1) {
            dataArray[index] = data;
        } else {
            dataArray.unshift(data);
        }

        this._dataNoPage.next(dataArray);
    }
}
