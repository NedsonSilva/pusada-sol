import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { ZuziHorizontalNavigationComponent } from '@zuzi/components/navigation/horizontal/horizontal.component';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import { ZuziNavItem } from '@zuzi/components/navigation/navigation.types';
import { ZuziUtilsService } from '@zuzi/services/utils/utils.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-horizontal-navigation-basic-item',
    templateUrl: './basic.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZuziHorizontalNavigationBasicItemComponent
    implements OnInit, OnDestroy
{
    @Input() item: ZuziNavItem;
    @Input() name: string;

    isActiveMatchOptions: IsActiveMatchOptions;
    private _zuziHorizontalNavigationComponent: ZuziHorizontalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _zuziNavigationService: ZuziNavigationService,
        private _zuziUtilsService: ZuziUtilsService
    ) {
        // Set the equivalent of {exact: false} as default for active match options.
        // We are not assigning the item.isActiveMatchOptions directly to the
        // [routerLinkActiveOptions] because if it's "undefined" initially, the router
        // will throw an error and stop working.
        this.isActiveMatchOptions = this._zuziUtilsService.subsetMatchOptions;
    }

    ngOnInit(): void {
        // Set the "isActiveMatchOptions" either from item's
        // "isActiveMatchOptions" or the equivalent form of
        // item's "exactMatch" option
        this.isActiveMatchOptions =
            this.item.isActiveMatchOptions ?? this.item.exactMatch
                ? this._zuziUtilsService.exactMatchOptions
                : this._zuziUtilsService.subsetMatchOptions;

        // Get the parent navigation component
        this._zuziHorizontalNavigationComponent =
            this._zuziNavigationService.getComponent(this.name);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Subscribe to onRefreshed on the navigation component
        this._zuziHorizontalNavigationComponent.onRefreshed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
