import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NoAuthGuard {
    constructor(private _authService: AuthService, private _router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this._check();
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this._check();
    }

    canLoad(
        route: Route,
        segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this._check();
    }

    private _check(): Observable<boolean> {
        return this._authService.check().pipe(
            switchMap((authenticated) => {
                if (authenticated) {
                    this._router.navigate(['']);
                    return of(false);
                }
                return of(true);
            })
        );
    }
}
