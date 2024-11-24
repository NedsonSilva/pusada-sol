import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ZuziHorizontalNavigationComponent } from '@zuzi/components/navigation/horizontal/horizontal.component';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import { ZuziNavItem } from '@zuzi/components/navigation/navigation.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-horizontal-navigation-spacer-item',
    templateUrl: './spacer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZuziHorizontalNavigationSpacerItemComponent
    implements OnInit, OnDestroy
{
    @Input() item: ZuziNavItem;
    @Input() name: string;

    private _zuziHorizontalNavigationComponent: ZuziHorizontalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _zuziNavigationService: ZuziNavigationService
    ) {}

    ngOnInit(): void {
        // Get the parent navigation component
        this._zuziHorizontalNavigationComponent =
            this._zuziNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._zuziHorizontalNavigationComponent.onRefreshed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
