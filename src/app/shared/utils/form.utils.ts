/* eslint-disable @typescript-eslint/no-unused-expressions */
import { UntypedFormGroup } from '@angular/forms';
/* eslint-disable guard-for-in */
export const markForm = (form: UntypedFormGroup) => {
    for (const control in form.controls) {
        form.get(control).markAsTouched();
        form.get(control).markAsDirty();
    }
    focusControlInvalid();
};

export const focusControlInvalid = () => {
    setTimeout(() => {
        const matFormField = document?.querySelector('mat-form-field.ng-invalid.ng-touched.ng-dirty:not(.app-input)' ) as any;

        const input: any =
            (document
                ?.querySelector('app-input.ng-invalid.ng-touched.ng-dirty')
                ?.querySelector('input') as any) ||
            document.querySelector('input.ng-invalid.ng-touched.ng-dirty');

        const inputPhone: any = document.querySelector(
            'app-input-phone.ng-invalid.ng-touched.ng-dirty mat-form-field input'
        );

        if (!input) inputPhone?.focus();
        input?.focus() || matFormField?.focus();
    });
};


export const estadoCivil = [
    'Solteiro (a)',
    'Casado (a)',
    'Divorciado (a)',
    'Viúvo (a)',
    'Separado (a) judicialmente',
    'Outros'
];
