import { Inject, Injectable } from '@angular/core';
import { ZUZI_APP_CONFIG } from '@zuzi/services/config/config.constants';
import { AppConfig } from 'app/core/config/app.config';
import { merge } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ZuziConfigService {
    private _config: BehaviorSubject<Partial<AppConfig>>;

    constructor(@Inject(ZUZI_APP_CONFIG) config: AppConfig) {
        const userConfig = JSON.parse(localStorage.getItem('themeConfig') || 'null');

        this._config = new BehaviorSubject(userConfig || config);
    }

    set config(value: Partial<AppConfig>) {
        const config = merge({}, this._config.getValue(), value);
        localStorage.setItem('themeConfig', JSON.stringify(config));
        this._config.next(config);
    }

    get config$(): Observable<Partial<AppConfig>> {
        return this._config.asObservable();
    }

    reset(): void {
        this._config.next(this.config);
    }
}
