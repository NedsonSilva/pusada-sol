import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ZuziLoadingService } from '@zuzi/services/loading/loading.service';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class ZuziLoadingInterceptor implements HttpInterceptor {
    handleRequestsAutomatically: boolean;

    constructor(private _zuziLoadingService: ZuziLoadingService) {
        this._zuziLoadingService.auto$.subscribe((value) => {
            this.handleRequestsAutomatically = value;
        });
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // If the Auto mode is turned off, do nothing
        if (!this.handleRequestsAutomatically) {
            return next.handle(req);
        }

        // Set the loading status to true
        this._zuziLoadingService._setLoadingStatus(true, req.url);

        return next.handle(req).pipe(
            finalize(() => {
                // Set the status to false if there are any errors or the request is completed
                this._zuziLoadingService._setLoadingStatus(false, req.url);
            })
        );
    }
}
