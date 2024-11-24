import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZuziNavigationService, ZuziVerticalNavComponent } from '@zuzi/components/navigation';
import { ZuziMediaWatcherService } from '@zuzi/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'dense-layout',
    templateUrl: './dense.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    navigationAppearance: 'default' | 'dense' = 'default';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _navigationService: NavigationService,
        private _zuziMediaWatcherService: ZuziMediaWatcherService,
        private _zuziNavigationService: ZuziNavigationService
    ) {}

    get currentYear(): number {
        return new Date().getFullYear();
    }

    ngOnInit(): void {
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        this._zuziMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                this.isScreenSmall = !matchingAliases.includes('md');

                if (matchingAliases.includes('md')) {
                    this.navigationAppearance = 'default'
                } else {
                    this.navigationAppearance = this.isScreenSmall
                        ? 'dense'
                        : 'default';
                }

            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleNavigation(name: string): void {
        const navigation =
            this._zuziNavigationService
                .getComponent<ZuziVerticalNavComponent>(name);
        console.log('nav', navigation)
        if (navigation) {
            navigation.toggle();
        }
    }

    toggleNavigationAppearance(): void {
        this.navigationAppearance =
            this.navigationAppearance === 'default' ? 'dense' : 'default';
    }
}
