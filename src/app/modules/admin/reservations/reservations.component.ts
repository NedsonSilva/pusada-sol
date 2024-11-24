import { ChangeDetectorRef, Component, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ZuziConfirmService } from '@zuzi/services/confirm';
import { ToastService } from 'angular-toastify';
import { Contact } from 'app/models/contacts.types';
import { ReservationService } from 'app/services/reservations/reservation.service';
import { Reservation, ReservationFilter, ReservationPaginate } from 'app/services/reservations/reservations.types';

import { ContactsFormComponent } from './form/form.component';

@Component({
    templateUrl: './reservations.component.html',
    styleUrl: './reservations.component.scss',
})
export class ReservationsComponent implements OnInit {
    reservations: Signal<ReservationPaginate> =toSignal(this.service.reservations$);
    filter = new ReservationFilter();
    loading = signal(false);

    constructor(
        private service: ReservationService,
        private confirmService: ZuziConfirmService,
        private dialog: MatDialog,
        private toastService: ToastService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // this.reservations = toSignal(this.service.reservations$);
        this.getContacts();
    }

    getContacts() {
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

    deleteContact(item: Reservation) {
        this.confirmService.open(
            {
                title: 'Excluir Reserva',
                message: `Deseja realmente a reserva ${item.roomId}?`,
            },
            () => {
                this.service.delete(item.id).subscribe(() => {
                    this.toastService.success('Reserva excluída com sucesso!');
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
