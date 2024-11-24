import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { zuziAnimations } from '@zuzi/animations';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import { ZuziNavItem } from '@zuzi/components/navigation/navigation.types';
import { ZuziUtilsService } from '@zuzi/services/utils/utils.service';
import { ReplaySubject, Subject } from 'rxjs';

@Component({
    selector: 'zuzi-horizontal-navigation',
    templateUrl: './horizontal.component.html',
    styleUrls: ['./horizontal.component.scss'],
    animations: zuziAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'zuziHorizontalNavigation',
})
export class ZuziHorizontalNavigationComponent
    implements OnChanges, OnInit, OnDestroy
{
    @Input() name: string = this._zuziUtilsService.randomId();
    @Input() navigation: ZuziNavItem[];

    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _zuziNavigationService: ZuziNavigationService,
        private _zuziUtilsService: ZuziUtilsService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        // Navigation
        if ('navigation' in changes) {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }


    ngOnInit(): void {
        // Make sure the name input is not an empty string
        if (this.name === '') {
            this.name = this._zuziUtilsService.randomId();
        }

        // Register the navigation component
        this._zuziNavigationService.registerComponent(this.name, this);
    }

    ngOnDestroy(): void {
        // Deregister the navigation component from the registry
        this._zuziNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    refresh(): void {
        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
