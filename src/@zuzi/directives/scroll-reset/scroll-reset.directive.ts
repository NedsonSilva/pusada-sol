import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Directive({
    selector: '[zuziScrollReset]',
    exportAs: 'zuziScrollReset',
})
export class ZuziScrollResetDirective implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _elementRef: ElementRef, private _router: Router) {}

    ngOnInit(): void {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                // Reset the element's scroll position to the top
                this._elementRef.nativeElement.scrollTop = 0;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
