import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ZuziConfigService } from '@zuzi/services/config';
import { AppConfig, Scheme, Theme, Themes } from 'app/core/config/app.config';
import { Layout } from 'app/layout/layout.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styles: [
        `
            settings {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }

            @media (screen and min-width: 1280px) {
                empty-layout + settings .settings-cog {
                    right: 0 !important;
                }
            }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit, OnDestroy {
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _router: Router,
        private _zuziConfigService: ZuziConfigService
    ) {}

    ngOnInit(): void {
        // Subscribe to config changes
        this._zuziConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {
                // Store the config
                this.config = config;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    setLayout(layout: string): void {
        // Clear the 'layout' query param to allow layout changes
        this._router
            .navigate([], {
                queryParams: {
                    layout: null,
                },
                queryParamsHandling: 'merge',
            })
            .then(() => {
                // Set the config
                this._zuziConfigService.config = { layout } as any;
            });
    }

    setScheme(scheme: Scheme): void {
        this._zuziConfigService.config = { scheme };
    }

    setTheme(theme: Theme): void {
        this._zuziConfigService.config = { theme };
    }
}
