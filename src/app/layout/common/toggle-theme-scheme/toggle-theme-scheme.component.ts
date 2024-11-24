import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ZuziConfigService } from '@zuzi/services/config';
import { Scheme } from 'app/core/config/app.config';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'toggle-theme-scheme',
    standalone: true,
    imports: [MatIconModule, MatSlideToggleModule],
    templateUrl: './toggle-theme-scheme.component.html',
    styleUrl: './toggle-theme-scheme.component.scss',
})
export class ToggleThemeSchemeComponent implements OnInit, OnDestroy {
    scheme: Scheme;
    private _unsubAll = new Subject();

    constructor(private zuziConfigService: ZuziConfigService) {}

    ngOnInit(): void {
        this.zuziConfigService.config$
            .pipe(takeUntil(this._unsubAll))
            .subscribe(config => {
                this.scheme = config?.scheme;
            })
    }

    ngOnDestroy(): void {
        this._unsubAll.next(null);
        this._unsubAll.complete();
    }

    toggle(checked: boolean) {
        if (checked) {
            this.zuziConfigService.config = {
                scheme: 'dark'
            };
        } else {
            this.zuziConfigService.config = {
                scheme: 'light'
            };
        }
    }
}
