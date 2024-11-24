import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ZuziVerticalNavComponent } from '@zuzi/components/navigation/vertical/vertical.component';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import { ZuziNavItem } from '@zuzi/components/navigation/navigation.types';

@Component({
    selector       : 'zuzi-vertical-navigation-spacer-item',
    templateUrl    : './spacer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZuziVerticalNavigationSpacerItemComponent implements OnInit, OnDestroy
{
    @Input() item: ZuziNavItem;
    @Input() name: string;

    private _zuziVerticalNavigationComponent: ZuziVerticalNavComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ZuziNavigationService: ZuziNavigationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._zuziVerticalNavigationComponent = this._ZuziNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._zuziVerticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
