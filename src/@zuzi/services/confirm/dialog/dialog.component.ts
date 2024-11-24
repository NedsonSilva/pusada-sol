import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZuziConfirmConfig } from '@zuzi/services/confirm/confirm.types';

@Component({
    selector: 'zuzi-confirm-dialog',
    templateUrl: './dialog.component.html',
    styles: [
        `
            .zuzi-confirm-dialog-panel {
                @screen md {
                    @apply w-128;
                }

                .mat-mdc-dialog-container {
                    padding: 0 !important;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None
})
export class ZuziConfirmDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: ZuziConfirmConfig) {}
}
