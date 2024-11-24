import {
    ChangeDetectorRef,
    Directive,
    effect,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    untracked,
    ViewContainerRef,
    WritableSignal,
} from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { User, UserLevel } from 'app/core/user/user.types';
import { Subject } from 'rxjs';

type Levels = keyof typeof UserLevel | Array<keyof typeof UserLevel>;


@Directive({
    standalone: true,
    selector: '[appLevelsOnly],[useLevelsAllowedDef]',
})
export class PermissionsDirective implements OnInit, OnDestroy {
    @Input() appLevelsOnly: Levels;
    // @Input() appPermissions: keyof typeof UserLevel | keyof typeof UserLevel[];
    // @Input() appPermissionOnly: Permission['key'] | Permission['key'][];
    @Input() elseTemplate: TemplateRef<any>;

    /**Default: MASTER, ADMIN, PARCEIRO, SUPORTE */
    @Input() useLevelsAllowedDef: boolean = false;

    user: WritableSignal<User>;
    accessLevels: UserLevel[] = [];
    private _unsubsAll = new Subject();
    // private _clientPermissions: Permission[] = [];
    private readonly _levelsAllowedDefault: Levels[] = ['MASTER', 'ADMIN']

    constructor(
        private userService: UserService,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private changeDetectorRef: ChangeDetectorRef,
        // private permissionsService: PermissionsService
    ) {
        effect(() => {
            this.user();

            untracked(() => {
                this._registryChange();
            })
        })
    }

    ngOnInit(): void {
        this.user = this.userService.user;
        // this._clientPermissions = this.permissionsService.permissions;
        this.viewContainerRef.clear();
        this.registryChangesUser();
    }

    ngOnDestroy(): void {
        this.viewContainerRef.clear();
        this._unsubsAll.next(null);
        this._unsubsAll.complete();
    }

    registryChangesUser() {
        // this.userService.user$
        //     .pipe(takeUntil(this._unsubsAll))
        //     .subscribe((user) => {
        //         this.user = user;
        //         this._registryChange();
        //     });
    }

    private _registryChange() {
        this.viewContainerRef.clear();

        if (!this.user()) return;

        if (this.appLevelsOnly && !this.appLevelsOnly) {
            this._checkAccessLevels();
        }
        if (this.appLevelsOnly) {
            this.viewContainerRef.clear();
            this._checkPermissions()
        }
    }

    private _checkAccessLevels() {
        if (this.appLevelsOnly) {
            const userLevel = UserLevel[this.user()?.profile];
            const levelsOnly = Array.isArray(this.appLevelsOnly) ? this.appLevelsOnly : [this.appLevelsOnly];
            const existLevel = levelsOnly.some(e => e === userLevel);

            if (existLevel) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainerRef.clear();
                if (this.elseTemplate) {
                    this.viewContainerRef.createEmbeddedView(this.elseTemplate)
                }
            }
            this.changeDetectorRef.markForCheck();
        }
    }

    private _checkPermissions() {
        // const settings = clone(this.user.permissions || []);
        // this._clientPermissions?.forEach(p => settings.push(p));

        // const findSetting = settings.find(s => this.appSettingsOnly.includes(s.key));

        const userLevel = UserLevel[this.user()?.profile];
        const levelsOnly = Array.isArray(this.appLevelsOnly) ? this.appLevelsOnly : [this.appLevelsOnly];
        let existLevel = levelsOnly.some(level => level === userLevel);

        if (this.useLevelsAllowedDef) {
            existLevel = this._levelsAllowedDefault.includes(userLevel as any)
        }

        // const isAllowed = findSetting ? findSetting.allowed : true

        if (existLevel) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainerRef.clear();
            if (this.elseTemplate) {
                this.viewContainerRef.createEmbeddedView(this.elseTemplate)
            }
        }
        this.changeDetectorRef.markForCheck();
    }
}
