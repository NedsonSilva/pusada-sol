import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ZuziConfirmConfig } from '@zuzi/services/confirm/confirm.types';
import { ZuziConfirmDialogComponent } from '@zuzi/services/confirm/dialog/dialog.component';
import { merge } from 'lodash-es';

@Injectable()
export class ZuziConfirmService {
    private _defaultConfig: ZuziConfirmConfig = {
        title: 'Confirmar ação',
        message: null,
        icon: {
            show: false,
            name: 'heroicons_outline:exclamation',
            color: 'warn',
        },
        actions: {
            confirm: {
                show: true,
                label: 'Confirmar',
                color: 'primary',
            },
            cancel: {
                show: true,
                label: 'Cancelar',
            },
        },
        dismissible: true,
    };

    constructor(private _matDialog: MatDialog) {}

    open(
        config: ZuziConfirmConfig = {},
        confirmedCb?: () => void,
        cancelledCb?: () => void
    ): MatDialogRef<ZuziConfirmDialogComponent> {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);

        const dialogRef = this._matDialog.open<
            ZuziConfirmDialogComponent,
            ZuziConfirmConfig,
            any
        >(ZuziConfirmDialogComponent, {
            autoFocus: false,
            disableClose: !userConfig.dismissible,
            data: userConfig,
            panelClass: 'zuzi-confirm-dialog-panel',
        });

        if (confirmedCb || cancelledCb) {
            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed' && confirmedCb) {
                    confirmedCb();
                }
                else if (result === 'cancelled' && cancelledCb) {
                    cancelledCb();
                }
            });
        }

        return dialogRef;
    }
}
