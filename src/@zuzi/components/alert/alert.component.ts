import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { zuziAnimations } from '@zuzi/animations';
import { ZuziAlertService } from '@zuzi/components/alert/alert.service';
import { ZuziAlertAppearance, ZuziAlertType } from '@zuzi/components/alert/alert.types';
import { ZuziUtilsService } from '@zuzi/services/utils/utils.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: zuziAnimations,
    exportAs: 'zuziAlert',
})
export class ZuziAlertComponent implements OnChanges, OnInit, OnDestroy {
    static ngAcceptInputType_dismissible: BooleanInput;
    static ngAcceptInputType_dismissed: BooleanInput;
    static ngAcceptInputType_showIcon: BooleanInput;

    @Input() appearance: ZuziAlertAppearance = 'soft';
    @Input() dismissed: boolean = false;
    @Input() dismissible: boolean = false;
    @Input() name: string = this._zuziUtilsService.randomId();
    @Input() showIcon: boolean = true;
    @Input() type: ZuziAlertType = 'primary';
    @Input() containerClass: NgClass['ngClass'];
    @Output() readonly dismissedChanged: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _zuziAlertService: ZuziAlertService,
        private _zuziUtilsService: ZuziUtilsService
    ) {}

    @HostBinding('class') get classList(): any {
        return {
            'zuzi-card-appearance-border': this.appearance === 'border',
            'zuzi-card-appearance-fill': this.appearance === 'fill',
            'zuzi-card-appearance-outline': this.appearance === 'outline',
            'zuzi-card-appearance-soft': this.appearance === 'soft',
            'zuzi-card-dismissed': this.dismissed,
            'zuzi-card-dismissible': this.dismissible,
            'zuzi-card-show-icon': this.showIcon,
            'zuzi-card-type-primary': this.type === 'primary',
            'zuzi-card-type-accent': this.type === 'accent',
            'zuzi-card-type-warn': this.type === 'warn',
            'zuzi-card-type-basic': this.type === 'basic',
            'zuzi-card-type-info': this.type === 'info',
            'zuzi-card-type-success': this.type === 'success',
            'zuzi-card-type-warning': this.type === 'warning',
            'zuzi-card-type-error': this.type === 'error',
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('dismissed' in changes) {
            // Coerce the value to a boolean
            this.dismissed = coerceBooleanProperty(
                changes.dismissed.currentValue
            );

            // Dismiss/show the alert
            this._toggleDismiss(this.dismissed);
        }

        if ('dismissible' in changes) {
            // Coerce the value to a boolean
            this.dismissible = coerceBooleanProperty(
                changes.dismissible.currentValue
            );
        }

        if ('showIcon' in changes) {
            // Coerce the value to a boolean
            this.showIcon = coerceBooleanProperty(
                changes.showIcon.currentValue
            );
        }
    }

    ngOnInit(): void {
        this._zuziAlertService.onDismiss
            .pipe(
                filter((name) => this.name === name),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.dismiss();
            });

        this._zuziAlertService.onShow
            .pipe(
                filter((name) => this.name === name),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.show();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    dismiss(): void {
        if (this.dismissed) {
            return;
        }

        this._toggleDismiss(true);
    }


    show(): void {
        if (!this.dismissed) {
            return;
        }

        this._toggleDismiss(false);
    }

    private _toggleDismiss(dismissed: boolean): void {
        if (!this.dismissible) {
            return;
        }

        this.dismissed = dismissed;

        this.dismissedChanged.next(this.dismissed);

        this._changeDetectorRef.markForCheck();
    }
}
