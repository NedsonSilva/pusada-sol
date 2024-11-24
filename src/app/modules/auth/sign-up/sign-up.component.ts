import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { zuziAnimations } from '@zuzi/animations';
import { ZuziAlertType } from '@zuzi/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: zuziAnimations,
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: ZuziAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this.signUpForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            company: [''],
            agreements: ['', Validators.requiredTrue],
        });
    }

    signUp(): void {
        if (this.signUpForm.invalid) {
            return;
        }

        this.signUpForm.disable();

        this.showAlert = false;

        this._authService.signUp(this.signUpForm.value).subscribe({
            next: (response) => {
                this._router.navigateByUrl('/confirmation-required');
            },
            error: (response) => {
                this.signUpForm.enable();
                this.signUpNgForm.resetForm();

                this.alert = {
                    type: 'error',
                    message: 'Something went wrong, please try again.',
                };

                this.showAlert = true;
            }
        });
    }
}
