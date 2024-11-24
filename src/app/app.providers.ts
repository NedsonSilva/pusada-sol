import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, EnvironmentProviders, LOCALE_ID, Provider } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatProgressSpinnerDefaultOptions } from '@angular/material/progress-spinner';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, MatSlideToggleDefaultOptions } from '@angular/material/slide-toggle';
import { provideClientHydration } from '@angular/platform-browser';

import { MatCustomPaginatorIntl } from './modules/providers/mat-custom-paginator-intl';

registerLocaleData(localePt);

export const APP_PROVIDERS: (Provider | EnvironmentProviders)[] = [
    provideClientHydration(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    {
        provide: MatPaginatorIntl,
        useClass: MatCustomPaginatorIntl,
    },
    {
        provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
        useValue: {
            diameter: 26,
            color: 'primary',
        } as MatProgressSpinnerDefaultOptions,
    },
    {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            appearance: 'outline',
            color: 'primary',
        } as MatFormFieldDefaultOptions,
    },
    {
        provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,
        useValue: {
            color: 'primary',
        } as MatSlideToggleDefaultOptions,
    },
    {
        provide: MAT_DIALOG_DEFAULT_OPTIONS,
        useValue: {
            maxWidth: '95vw',
            maxHeight: '90vh',
        } as MatDialogConfig,
    },
];
