import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { ZuziHorizontalNavigationComponent } from '@zuzi/components/navigation/horizontal/horizontal.component';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import { ZuziNavItem } from '@zuzi/components/navigation/navigation.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-horizontal-navigation-branch-item',
    templateUrl: './branch.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZuziHorizontalNavigationBranchItemComponent
    implements OnInit, OnDestroy
{
    static ngAcceptInputType_child: BooleanInput;

    @Input() child: boolean = false;
    @Input() item: ZuziNavItem;
    @Input() name: string;
    @ViewChild('matMenu', { static: true }) matMenu: MatMenu;

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
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    triggerChangeDetection(): void {
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
}
