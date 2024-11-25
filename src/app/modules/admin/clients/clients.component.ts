import { ChangeDetectorRef, Component, OnInit, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ZuziConfirmService } from '@zuzi/services/confirm';
import { ToastService } from 'angular-toastify';
import { Client, ClientFilter, ClientPaginate } from 'app/services/clients/clients.types';
import { ClientService } from 'app/services/clients/client.service';
import { ClientFormComponent } from './form/form.component';

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

    openModalFormClient(client?: Client) {
        this.dialog.open(ClientFormComponent, {
            data: { client: { ...client } },
            autoFocus: true,
            maxHeight: '85vh',
            maxWidth: '95vw'
        })
    }

    setPage(event: PageEvent) {
        this.filter.pageNumber = event.pageIndex + 1;
        this.filter.perPage = event.pageSize;
        this.getClients();
    }

    buildAddress(client: Client): string {
        const {
            addressZipCode,
            addressCity,
            addressState,
            addressNeighborhood,
            addressStreet,
            addressNumber,
            addressComplement
        } = client;

        if (!addressZipCode) return 'Não informado';

        return `${addressStreet}, ${addressNumber || 'SN'}, ${addressComplement}, ${addressNeighborhood}, ${addressCity}, ${addressState}, ${addressZipCode}`
    }

    remove(client: Client) {
        this.confirmService.open(
            { title: 'Excluir Cliente' },
            () => {
                this.loading.set(true)
                this.service.delete(client.id).subscribe({
                    next: () => {
                        this.toastService.success('Cliente excluido com sucesso');
                        this.loading.set(false);
                    },
                    error: () => this.loading.set(false),
                });
            }
        )
    }

    trackByFn(data) {
        return data.id
    }
}
