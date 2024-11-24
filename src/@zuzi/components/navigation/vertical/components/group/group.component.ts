import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import { ZuziNavItem } from '@zuzi/components/navigation/navigation.types';
import { ZuziVerticalNavComponent } from '@zuzi/components/navigation/vertical/vertical.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-vertical-navigation-group-item',
    templateUrl: './group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZuziVerticalNavigationGroupItemComponent
    implements OnInit, OnDestroy
{
    static ngAcceptInputType_autoCollapse: BooleanInput;

    @Input() autoCollapse: boolean;
    @Input() item: ZuziNavItem;
    @Input() name: string;

    private _zuziVerticalNavigationComponent: ZuziVerticalNavComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ZuziNavigationService: ZuziNavigationService
    ) {}

    ngOnInit(): void {
        this._zuziVerticalNavigationComponent =
            this._ZuziNavigationService.getComponent(this.name);

        this._zuziVerticalNavigationComponent.onRefreshed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
