import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ZuziLoadingService } from '@zuzi/services/loading';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'zuziLoadingBar',
})
export class ZuziLoadingBarComponent implements OnChanges, OnInit, OnDestroy {
    @Input() autoMode: boolean = true;
    mode: 'determinate' | 'indeterminate';
    progress: number = 0;
    show: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _zuziLoadingService: ZuziLoadingService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('autoMode' in changes) {
            this._zuziLoadingService.setAutoMode(
                coerceBooleanProperty(changes.autoMode.currentValue)
            );
        }
    }

    ngOnInit(): void {
        this._zuziLoadingService.mode$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                this.mode = value;
            });

        this._zuziLoadingService.progress$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                this.progress = value;
            });

        this._zuziLoadingService.show$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                this.show = value;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
