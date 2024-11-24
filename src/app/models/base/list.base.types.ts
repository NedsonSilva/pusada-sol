import {
    ChangeDetectorRef,
    Directive,
    Injector,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import { FilterBase } from './filter.base';
import { Subject } from 'rxjs';
import { ZuziConfirmService } from '@zuzi/services/confirm';
import { ServiceBase } from './service.base';
import { PaginateBase } from './paginate.types';
import { PageEvent } from '@angular/material/paginator';
import { ToastService } from 'angular-toastify';

@Directive()
export class ListBase<
    T extends { id: string | number },
    F extends FilterBase,
    S extends ServiceBase<T, F>
> implements OnInit, OnDestroy
{
    public data: PaginateBase<T>;
    public filter: F;
    public loading = signal<boolean>(false);
    protected changeDetectorRef: ChangeDetectorRef;
    protected searchTimeoutRef: NodeJS.Timeout;
    protected confirmService: ZuziConfirmService;
    protected toastService: ToastService;

    protected _unsubAll = new Subject();

    constructor(
        public Filter: F,
        protected service: S,
        protected injector: Injector
    ) {
        this.filter = Filter;
        this.confirmService = injector.get(ZuziConfirmService);
        this.changeDetectorRef = injector.get(ChangeDetectorRef);
        this.service.filter = this.filter;
        this.toastService = injector.get(ToastService);
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this._unsubAll.next(null);
        this._unsubAll.complete();
    }

    getAll() {
        if (this.loading()) return;

        this.loading.set(true);

        this.service.getAll(this.filter).subscribe({
            next: users => {
                this.data = users;
                this.loading.set(false)
            },
            error: () => {
                this.loading.set(false)
            }
        })
    }

    onSearch({ target: { value } }) {
        this.filter.searchParam = value;
        this.filter.pageNumber = 1;

        if (this.loading()) return;

        clearTimeout(this.searchTimeoutRef);
        this.searchTimeoutRef = setTimeout(() => {
            this.loading.set(true);

            this.service.getAll(this.filter).subscribe({
                next: (data) => {
                    this.searchTimeoutRef = null;
                    this.data = data;
                    this.loading.set(false)
                },
                error: () => {
                    this.searchTimeoutRef = null;
                    this.loading.set(false)
                },
            });
        }, 500);
    }

    setPage(page: number) {
        if (this.filter.pageNumber === page) {
            return;
        }

        this.filter.pageNumber = page;
        this.getAll()
    }

    setPerPage(perPage: number) {
        if (this.filter.perPage === perPage) {
            return;
        }
        this.filter.perPage = perPage;
        this.getAll()
    }

    chnagePage(data: PageEvent) {
        this.filter.perPage = data.pageIndex + 1;
        this.filter.perPage = data.pageSize;
        this.getAll()
    }
}
