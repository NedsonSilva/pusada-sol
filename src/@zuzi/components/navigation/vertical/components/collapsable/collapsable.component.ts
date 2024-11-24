import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { zuziAnimations } from '@zuzi/animations';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import { ZuziNavItem } from '@zuzi/components/navigation/navigation.types';
import { ZuziVerticalNavComponent } from '@zuzi/components/navigation/vertical/vertical.component';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-vertical-navigation-collapsable-item',
    templateUrl: './collapsable.component.html',
    animations: zuziAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZuziVerticalNavigationCollapsableItemComponent
    implements OnInit, OnDestroy
{
    static ngAcceptInputType_autoCollapse: BooleanInput;

    @Input() autoCollapse: boolean;
    @Input() item: ZuziNavItem;
    @Input() name: string;

    isCollapsed: boolean = true;
    isExpanded: boolean = false;
    private _zuziVerticalNavigationComponent: ZuziVerticalNavComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _ZuziNavigationService: ZuziNavigationService
    ) {}

    @HostBinding('class') get classList(): any {
        return {
            'zuzi-vertical-navigation-item-collapsed': this.isCollapsed,
            'zuzi-vertical-navigation-item-expanded': this.isExpanded,
        };
    }

    ngOnInit(): void {
        this._zuziVerticalNavigationComponent =
            this._ZuziNavigationService.getComponent(this.name);

        if (this._hasActiveChild(this.item, this._router.url)) {
            this.expand();
        }
        else {
            if (this.autoCollapse) {
                this.collapse();
            }
        }

        // Listen for the onCollapsableItemCollapsed from the service
        this._zuziVerticalNavigationComponent.onCollapsableItemCollapsed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collapsedItem) => {
                if (collapsedItem === null) {
                    return;
                }

                if (this._isChildrenOf(collapsedItem, this.item)) {
                    this.collapse();
                }
            });

        // Listen for the onCollapsableItemExpanded from the service if the autoCollapse is on
        if (this.autoCollapse) {
            this._zuziVerticalNavigationComponent.onCollapsableItemExpanded
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((expandedItem) => {
                    // Check if the expanded item is null
                    if (expandedItem === null) {
                        return;
                    }

                    // Check if this is a parent of the expanded item
                    if (this._isChildrenOf(this.item, expandedItem)) {
                        return;
                    }

                    // Check if this has a children with a matching url with the current active url
                    if (this._hasActiveChild(this.item, this._router.url)) {
                        return;
                    }

                    // Check if this is the expanded item
                    if (this.item === expandedItem) {
                        return;
                    }

                    // If none of the above conditions are matched, collapse this item
                    this.collapse();
                });
        }

        this._router.events
            .pipe(
                filter(
                    (event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                ),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((event: NavigationEnd) => {
                // If the item has a children that has a matching url with the current url, expand...
                if (this._hasActiveChild(this.item, event.urlAfterRedirects)) {
                    this.expand();
                }
                else {
                    // If the autoCollapse is on, collapse...
                    if (this.autoCollapse) {
                        this.collapse();
                    }
                }
            });

        // Subscribe to onRefreshed on the navigation component
        this._zuziVerticalNavigationComponent.onRefreshed
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

    collapse(): void {
        if (this.item.disabled) {
            return;
        }

        if (this.isCollapsed) {
            return;
        }

        this.isCollapsed = true;
        this.isExpanded = !this.isCollapsed;

        this._changeDetectorRef.markForCheck();

        this._zuziVerticalNavigationComponent.onCollapsableItemCollapsed.next(
            this.item
        );
    }

    expand(): void {
        if (this.item.disabled) {
            return;
        }

        if (!this.isCollapsed) {
            return;
        }

        this.isCollapsed = false;
        this.isExpanded = !this.isCollapsed;

        this._changeDetectorRef.markForCheck();

        this._zuziVerticalNavigationComponent.onCollapsableItemExpanded.next(
            this.item
        );
    }

    toggleCollapsable(): void {
        if (this.isCollapsed) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _hasActiveChild(
        item: ZuziNavItem,
        currentUrl: string
    ): boolean {
        const children = item.children;

        if (!children) {
            return false;
        }

        for (const child of children) {
            if (child.children) {
                if (this._hasActiveChild(child, currentUrl)) {
                    return true;
                }
            }

            // Check if the child has a link and is active
            if (
                child.link &&
                this._router.isActive(child.link, child.exactMatch || false)
            ) {
                return true;
            }
        }

        return false;
    }

    private _isChildrenOf(
        parent: ZuziNavItem,
        item: ZuziNavItem
    ): boolean {
        const children = parent.children;

        if (!children) {
            return false;
        }

        if (children.indexOf(item) > -1) {
            return true;
        }

        for (const child of children) {
            if (child.children) {
                if (this._isChildrenOf(child, item)) {
                    return true;
                }
            }
        }

        return false;
    }
}
