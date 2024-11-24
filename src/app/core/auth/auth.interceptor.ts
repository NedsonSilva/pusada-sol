import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private _authService: AuthService,
        private toastService: ToastService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let newReq = req.clone();

        if (
            this._authService.accessToken &&
            !AuthUtils.isTokenExpired(this._authService.accessToken)
        ) {
            newReq = req.clone({
                headers: req.headers.set(
                    'Authorization',
                    'Bearer ' + this._authService.accessToken
                ),
            });
        }

        return next.handle(newReq).pipe(
            catchError((error) => {
                console.log('ee error', error);
                if (error instanceof HttpErrorResponse) {
                    const errorData = error.error;

                    if (errorData?.error) {
                        this.toastService.error(errorData.error);
                    }
                    else if (error.message) {
                        this.toastService.error(`${error.status} ${error.statusText}`);
                    }
                }

                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401 &&
                    error.url !== `${this._authService.urlBase}/login`
                ) {
                    this._authService.signOut();
                    location.reload();
                }

                return throwError(() => error);
            })
        );
    }
}
