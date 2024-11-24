import { BooleanInput } from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject } from 'rxjs';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
    static ngAcceptInputType_showAvatar: BooleanInput;

    @Input() showAvatar: boolean = true;

    user: WritableSignal<User>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _authService: AuthService
    ) {}

    ngOnInit(): void {
        this.user = this._userService.user;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    updateUserStatus(status: string): void {
        if (!this.user()) {
            return;
        }

        this._userService
            .update({
                ...this.user(),
                status,
            })
            .subscribe();
    }

    signOut(): void {
        this._authService.signOut()
        this._router.navigate(['/entrar']);
    }
}
