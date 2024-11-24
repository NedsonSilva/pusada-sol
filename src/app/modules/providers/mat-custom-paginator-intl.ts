import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class MatCustomPaginatorIntl implements MatPaginatorIntl {
    itemsPerPageLabel: string = 'Por página';
    firstPageLabel: string = 'Primeira página';
    lastPageLabel: string = 'Última página';
    changes = new Subject<void>();
    hidePageSize = true;
    nextPageLabel = 'Próximo';
    previousPageLabel = 'Anterior';

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `1 de 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `${page + 1} de ${amountPages}`;
    }
}
