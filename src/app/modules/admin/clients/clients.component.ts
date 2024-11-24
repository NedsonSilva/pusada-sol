import { ChangeDetectorRef, Component, OnInit, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ZuziConfirmService } from '@zuzi/services/confirm';
import { ToastService } from 'angular-toastify';
import { Client, ClientFilter, ClientPaginate } from 'app/services/clients/clients.types';
import { ClientService } from 'app/services/clients/reservation.service';

@Component({
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
    clients: Signal<ClientPaginate> = toSignal(this.service.clients$);
    filter = new ClientFilter();
    displayedColumns: string[] = ['id', 'name', 'createdAt', 'action'];
    loading = signal(false);

    constructor(
        private service: ClientService,
        private confirmService: ZuziConfirmService,
        private dialog: MatDialog,
        private toastService: ToastService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getClients();
    }

    getClients() {
        if (this.loading()) return;

        this.loading.set(true);

        this.service.getAll(this.filter).subscribe({
            next: data => {
                this.loading.set(false);
                this.changeDetectorRef.markForCheck();
            },
            error: () => {
                this.loading.set(false)
            }
        })
    }

    deleteClient(item: Client) {
        this.confirmService.open(
            { title: 'Excluir Reserva' },
            () => {
                this.service.delete(item.id).subscribe(() => {
                    this.toastService.success('Reserva excluída com sucesso!');
                })
            }
        )
    }

    openModalFormClient(contact?: Client) {
        // this.dialog.open(ContactsFormComponent, {
        //     data: contact,
        //     autoFocus: true
        // })
    }

    setPage(event: PageEvent) {
        this.filter.pageNumber = event.pageIndex + 1;
        this.filter.perPage = event.pageSize;
        this.getClients();
    }

    trackByFn(data) {
        return data.id
    }
}
