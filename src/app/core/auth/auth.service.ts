import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { SignInResponse } from './auth.types';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    readonly urlBase = environment.apiUrl + '/auth';

    constructor(
        private _http: HttpClient,
        private _userService: UserService
    ) {}

    set accessToken(token: string) {
        localStorage.setItem('_token', token);
    }

    get accessToken(): string {
        return localStorage.getItem('_token') ?? '';
    }

    forgotPassword(email: string): Observable<any> {
        return this._http.post('api/auth/forgot-password', email);
    }

    resetPassword(password: string): Observable<any> {
        return this._http.post('api/auth/reset-password', password);
    }

    signIn(credentials: { email: string; password: string }): Observable<any> {
        const url = `${this.urlBase}/login`
        if (this._authenticated) {
            return throwError(() => 'User is already logged in.');
        }

        return this._http.post<SignInResponse>(url, credentials).pipe(
            switchMap(response => {
                this.accessToken = response.token;
                this._authenticated = true;
                this._userService.user.set(response.user);
                return of(response);
            })
        );
    }

    signInUsingToken(): Observable<any> {
        return this._http
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    of(false)
                ),
                switchMap((response: any) => {
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    this._authenticated = true;

                    this._userService.user.set(response.user);

                    return of(true);
                })
            );
    }

    signOut(): Observable<any> {
        localStorage.removeItem('_token');
        this._authenticated = false;
        return of(true);
    }

    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._http.post('api/auth/sign-up', user);
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }
        if (!this.accessToken) {
            return of(false);
        }
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        return this.signInUsingToken();
    }
}
