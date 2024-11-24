import { Directive, Injector, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { markForm } from 'app/shared/utils/form.utils';
import { Subject } from 'rxjs';
import Notify from 'simple-notify';

@Directive()
export abstract class FormBase implements OnDestroy {
    fb: FormBuilder;
    form: UntypedFormGroup;
    protected route: ActivatedRoute;
    protected router: Router;
    protected unsubscribeAll = new Subject();
    protected changeDetectorRef: ChangeDetectorRef;
    protected toastService: ToastService
    // protected alertNotitication: AlertNotificationService;
    markForm = markForm;
    loading: boolean;

    constructor(protected injector: Injector) {
        this.fb = injector.get(FormBuilder);
        this.route = injector.get(ActivatedRoute);
        this.router = injector.get(Router);
        this.changeDetectorRef = injector.get(ChangeDetectorRef);
        this.toastService = injector.get(ToastService);
        // this.alertNotitication = injector.get(AlertNotificationService);
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    protected abstract buildForm(): void;

    submitForm() {
        markForm(this.form);
    }

    isNotSubmit() {
        markForm(this.form);
        return this.form.disabled || this.form.invalid || this.loading;
    }

    actionsSuccess() {
        this.loading = false;
        const prefix = this.form.value?.id ? 'Salvo' : 'Criado';
        this.form.enable();
        this.toastService.success(`${prefix} com sucesso`);
    }

    setLoading(value: boolean) {
        this.loading = value;
        this.changeDetectorRef.markForCheck();
    }

    actionsError(errors?: string | string[]) {
        this.loading = false;
        this.form.enable();
        const messages = typeof errors === 'string' ? [errors] : errors;
    }

    trackByFn<T extends { id: number }>(index: number, item: T): any {
        return item.id || index;
    }
}
