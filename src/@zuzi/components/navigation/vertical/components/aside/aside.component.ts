import { BooleanInput } from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import { ZuziNavItem } from '@zuzi/components/navigation/navigation.types';
import { ZuziVerticalNavComponent } from '@zuzi/components/navigation/vertical/vertical.component';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-vertical-navigation-aside-item',
    templateUrl: './aside.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZuziVerticalNavigationAsideItemComponent
    implements OnChanges, OnInit, OnDestroy
{
    static ngAcceptInputType_autoCollapse: BooleanInput;
    static ngAcceptInputType_skipChildren: BooleanInput;

    @Input() activeItemId: string;
    @Input() autoCollapse: boolean;
    @Input() item: ZuziNavItem;
    @Input() name: string;
    @Input() skipChildren: boolean;

    active: boolean = false;
    private _zuziVerticalNavigationComponent: ZuziVerticalNavComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _ZuziNavigationService: ZuziNavigationService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('activeItemId' in changes) {
            this._markIfActive(this._router.url);
        }
    }

    ngOnInit(): void {
        this._markIfActive(this._router.url);
        this._router.events
            .pipe(
                filter(
                    (event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                ),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((event: NavigationEnd) => {
                // Mark if active
                this._markIfActive(event.urlAfterRedirects);
            });

        // Get the parent navigation component
        this._zuziVerticalNavigationComponent =
            this._ZuziNavigationService.getComponent(this.name);

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

            // Skip items other than 'basic'
            if (child.type !== 'basic') {
                continue;
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

    private _markIfActive(currentUrl: string): void {
        this.active = this.activeItemId === this.item.id;

        if (this._hasActiveChild(this.item, currentUrl)) {
            this.active = true;
        }

        this._changeDetectorRef.markForCheck();
    }
}
