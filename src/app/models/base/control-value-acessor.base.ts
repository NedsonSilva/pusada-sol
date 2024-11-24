import { Directive, Injector, OnInit } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';
import { getErrorMessages } from 'app/shared/helpers/form-control-error-messages';

@Directive()
export abstract class ControlValueAcessorBase<T = any> implements OnInit {
    value: T;
    ngControl: NgControl;
    touched: boolean;

    constructor(protected injector: Injector) {}

    ngOnInit() {
        try {
            this.ngControl = this.injector.get(NgControl);
        } catch (error) {}
    }

    setValue(value: any) {
        this.value = value;
        this.onChange(this.value);
        this.markAsTouched();
    }

    writeValue = (obj: any) => (this.value = obj);

    registerOnChange = (fn: any) => (this.onChange = fn);

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    markAsTouched() {
        if (!this.touched) {
            this.touched = true;
            this.onTouched(this.touched);
        }
    }

    onChange(event) {}

    onTouched(event) {}

    get isRequired() {
        return this.ngControl?.control?.hasValidator(Validators.required);
    }

    errorMessage = () => getErrorMessages(this.ngControl);

    hasError = () => this.ngControl?.invalid && this.ngControl?.touched;
}
