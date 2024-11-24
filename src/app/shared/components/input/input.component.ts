import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { zuziAnimations } from '@zuzi/animations';
import { ControlValueAcessorBase } from 'app/models/base/control-value-acessor.base';
import { currencyMask, textMasks } from 'app/shared/utils/masks';
import { isCpf } from 'app/shared/validators/custom-validators';
import { NgxCurrencyConfig } from 'ngx-currency';

import { InputMode, InputType } from './input.types';

type TextMask = 'cpfCnpj'|'cpf'|'cnpj'|'telefone'|'celular'|'telefoneFixo'|'cep'|'data'|'nbInss'|{ mask: string };

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
    animations: zuziAnimations,
})
export class InputComponent extends ControlValueAcessorBase implements ControlValueAccessor, OnInit {
    @Input() label: string;
    @Input() classLabel: string;
    @Input() type: InputType = 'text';
    /**
   * is password?
   */
    @Input() isPwd: boolean = false;
    @Input() iconPrefix: 'matPrefix' | 'matSuffix';
    @Input() icon: string;
    @Input() class: string;
    @Input() textMask: TextMask;
    @Input() placeholder: string;
    @Input() min: number;
    @Input() max: number;
    @Input() inputMode: InputMode;
    @Input() readonly: boolean;
    @Input() autocomplete: 'on'|'off' = 'on';

    get mask(): string {
        return typeof this.textMask !== 'string'
            ? this.textMask.mask
            : textMasks[this.textMask]
    };
    _currencyMask: Partial<NgxCurrencyConfig>;
    @Input() set currencyMask(mask: 'monetario') {
        this._currencyMask = currencyMask[mask];
        this._currencyMask.align = 'left';
    };

    @Input() set monetaryMask(value: boolean) {
        if (value) {
            this.currencyMask = 'monetario';
        }
    }

    matcher() {
        return {
        isErrorState: () =>
            !!(
            this.ngControl &&
            this.ngControl.invalid &&
            (this.ngControl.dirty || this.ngControl.touched)
            ),
        };
    }

    getIconEye = () =>
        `heroicons_solid:${this.type === 'text' ? 'eye-off' : 'eye'}`;

    get isRequired() {
        return this.ngControl?.control?.hasValidator(Validators.required);
    }

    setValue(value: any): void {
        if (this.type === 'number') {
            value = +value || 0;
        }
        super.setValue(value)
    }

    handlePaste({ clipboardData }: ClipboardEvent) {
        const text = clipboardData.getData('text');
        if (this.textMask === 'cpf' && text) {
            const formatText = text.replace(/\D/g, '');
            if (formatText.length < 11) {
                const textZeroFill = formatText.padStart(11, '0');
                if (isCpf(textZeroFill)) {
                    setTimeout(() => this.setValue(textZeroFill), 5);
                }
            }
        }
        else if (text) {
            setTimeout(() => this.setValue(text.trim()), 5)
        }
    }

}
