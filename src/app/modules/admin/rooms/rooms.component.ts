import { ChangeDetectorRef, Component, OnInit, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ZuziConfirmService } from '@zuzi/services/confirm';
import { ToastService } from 'angular-toastify';
import { Client } from 'app/services/clients/clients.types';
import { RoomService } from 'app/services/Rooms/room.service';
import { Room, RoomFilter, RoomPaginate } from 'app/services/Rooms/rooms.types';

import { RoomFormComponent } from './form/form.component';
import { debounce } from 'lodash';

@Component({
    templateUrl: './rooms.component.html',
    styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit {
    clients: Signal<RoomPaginate> = toSignal(this.service.data$);
    filter = new RoomFilter();
    displayedColumns: string[] = ['id', 'name', 'createdAt', 'action'];
    loading = signal(false);


    constructor(
        private service: RoomService,
        private confirmService: ZuziConfirmService,
        private dialog: MatDialog,
        private toastService: ToastService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getRooms();
    }

    getRooms() {
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

    openFormRoom(item?: Room) {
        this.dialog.open(RoomFormComponent, {
            data: { room: { ...item } },
            maxWidth: '95vw',
            maxHeight: '85vh',
            autoFocus: true
        })
    }

    search = debounce(() => this.getRooms(), 300);


    remove(room: Room) {
        this.confirmService.open(
            {
                message: 'Tem certeza que deseja excluir?',
                title: 'Excluir Quarto',

            },
            () => {
                this.loading.set(true)
                this.service.delete(room.id).subscribe({
                    next: () => {
                        this.toastService.success('Quarto excluido com sucesso');
                        this.loading.set(false);
                    },
                    error: () => this.loading.set(false),
                });
            }
        )
    }

    setPage(event: PageEvent) {
        this.filter.pageNumber = event.pageIndex + 1;
        this.filter.perPage = event.pageSize;
        this.getRooms();
    }
}
