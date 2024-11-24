import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { zuziAnimations } from '@zuzi/animations';
import { ZuziAlertType } from '@zuzi/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: zuziAnimations,
})
export class AuthSignInComponent implements OnInit {
    alert: { type: ZuziAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    form: UntypedFormGroup;
    showAlert: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: [false],
        });
    }

    signIn(): void {
        if (this.form.invalid) {
            return;
        }

        this.form.disable();

        this.showAlert = false;

        this._authService.signIn(this.form.value).subscribe({
            next: () => {
                const redirectURL = this._activatedRoute
                    .snapshot
                    .queryParamMap
                    .get('redirectURL') || '/signed-in-redirect';

                this._router.navigateByUrl(redirectURL);
            },
            error: (response) => {
                this.form.enable();
                this.alert = {
                    type: 'error',
                    message: 'E-mail ou senha incorretos',
                };
                this.showAlert = true;
            }
        });
    }
}
