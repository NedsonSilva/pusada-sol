import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { ZuziDrawerService } from '@zuzi/components/drawer/drawer.service';
import { ZuziDrawerMode, ZuziDrawerPosition } from '@zuzi/components/drawer/drawer.types';
import { ZuziUtilsService } from '@zuzi/services/utils/utils.service';

@Component({
    selector: 'zuzi-drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'zuziDrawer',
})
export class ZuziDrawerComponent implements OnChanges, OnInit, OnDestroy {
    static ngAcceptInputType_fixed: BooleanInput;
    static ngAcceptInputType_opened: BooleanInput;
    static ngAcceptInputType_transparentOverlay: BooleanInput;

    @Input() fixed: boolean = false;
    @Input() mode: ZuziDrawerMode = 'side';
    @Input() name: string = this._zuziUtilsService.randomId();
    @Input() opened: boolean = false;
    @Input() position: ZuziDrawerPosition = 'left';
    @Input() transparentOverlay: boolean = false;
    @Output() readonly fixedChanged: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() readonly modeChanged: EventEmitter<ZuziDrawerMode> =
        new EventEmitter<ZuziDrawerMode>();
    @Output() readonly openedChanged: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() readonly positionChanged: EventEmitter<ZuziDrawerPosition> =
        new EventEmitter<ZuziDrawerPosition>();

    private _animationsEnabled: boolean = false;
    private readonly _handleOverlayClick: any;
    private _hovered: boolean = false;
    private _overlay: HTMLElement;
    private _player: AnimationPlayer;

    constructor(
        private _animationBuilder: AnimationBuilder,
        private _elementRef: ElementRef,
        private _renderer2: Renderer2,
        private _zuziDrawerService: ZuziDrawerService,
        private _zuziUtilsService: ZuziUtilsService
    ) {
        this._handleOverlayClick = (): void => {
            this.close();
        };
    }

    @HostBinding('class') get classList(): any {
        return {
            'zuzi-drawer-animations-enabled': this._animationsEnabled,
            'zuzi-drawer-fixed': this.fixed,
            'zuzi-drawer-hover': this._hovered,
            [`zuzi-drawer-mode-${this.mode}`]: true,
            'zuzi-drawer-opened': this.opened,
            [`zuzi-drawer-position-${this.position}`]: true,
        };
    }

    @HostBinding('style') get styleList(): any {
        return {
            visibility: this.opened ? 'visible' : 'hidden',
        };
    }

    @HostListener('mouseenter')
    private _onMouseenter(): void {
        this._enableAnimations();
        this._hovered = true;
    }

    @HostListener('mouseleave')
    private _onMouseleave(): void {
        this._enableAnimations();

        this._hovered = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Fixed
        if ('fixed' in changes) {
            // Coerce the value to a boolean
            this.fixed = coerceBooleanProperty(changes.fixed.currentValue);

            // Execute the observable
            this.fixedChanged.next(this.fixed);
        }

        // Mode
        if ('mode' in changes) {
            // Get the previous and current values
            const previousMode = changes.mode.previousValue;
            const currentMode = changes.mode.currentValue;

            // Disable the animations
            this._disableAnimations();

            // If the mode changes: 'over -> side'
            if (previousMode === 'over' && currentMode === 'side') {
                // Hide the overlay
                this._hideOverlay();
            }

            // If the mode changes: 'side -> over'
            if (previousMode === 'side' && currentMode === 'over') {
                // If the drawer is opened
                if (this.opened) {
                    // Show the overlay
                    this._showOverlay();
                }
            }

            // Execute the observable
            this.modeChanged.next(currentMode);

            // Enable the animations after a delay
            // The delay must be bigger than the current transition-duration
            // to make sure nothing will be animated while the mode is changing
            setTimeout(() => {
                this._enableAnimations();
            }, 500);
        }

        if ('opened' in changes) {
            const open = coerceBooleanProperty(changes.opened.currentValue);

            this._toggleOpened(open);
        }

        if ('position' in changes) {
            this.positionChanged.next(this.position);
        }

        if ('transparentOverlay' in changes) {
            // Coerce the value to a boolean
            this.transparentOverlay = coerceBooleanProperty(
                changes.transparentOverlay.currentValue
            );
        }
    }

    ngOnInit(): void {
        this._zuziDrawerService.registerComponent(this.name, this);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Finish the animation
        if (this._player) {
            this._player.finish();
        }

        // Deregister the drawer from the registry
        this._zuziDrawerService.deregisterComponent(this.name);
    }

    open(): void {
        if (this.opened) {
            return;
        }

        this._toggleOpened(true);
    }

    close(): void {
        if (!this.opened) {
            return;
        }

        this._toggleOpened(false);
    }

    toggle(): void {
        this.opened ? this.close() : this.open()
    }

    private _enableAnimations(): void {
        if (this._animationsEnabled) {
            return;
        }

        this._animationsEnabled = true;
    }

    private _disableAnimations(): void {
        if (!this._animationsEnabled) {
            return;
        }

        this._animationsEnabled = false;
    }

    private _showOverlay(): void {
        this._overlay = this._renderer2.createElement('div');

        this._overlay.classList.add('zuzi-drawer-overlay');

        // Add a class depending on the fixed option
        if (this.fixed) {
            this._overlay.classList.add('zuzi-drawer-overlay-fixed');
        }

        // Add a class depending on the transparentOverlay option
        if (this.transparentOverlay) {
            this._overlay.classList.add('zuzi-drawer-overlay-transparent');
        }

        // Append the backdrop to the parent of the drawer
        this._renderer2.appendChild(
            this._elementRef.nativeElement.parentElement,
            this._overlay
        );

        // Create enter animation and attach it to the player
        this._player = this._animationBuilder
            .build([
                style({ opacity: 0 }),
                animate(
                    '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({ opacity: 1 })
                ),
            ])
            .create(this._overlay);

        this._player.play();

        this._overlay.addEventListener('click', this._handleOverlayClick);
    }

    private _hideOverlay(): void {
        if (!this._overlay) {
            return;
        }

        // Create the leave animation and attach it to the player
        this._player = this._animationBuilder
            .build([
                animate(
                    '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({ opacity: 0 })
                ),
            ])
            .create(this._overlay);

        // Play the animation
        this._player.play();

        // Once the animation is done...
        this._player.onDone(() => {
            // If the overlay still exists...
            if (this._overlay) {
                // Remove the event listener
                this._overlay.removeEventListener(
                    'click',
                    this._handleOverlayClick
                );

                // Remove the overlay
                this._overlay.parentNode.removeChild(this._overlay);
                this._overlay = null;
            }
        });
    }

    private _toggleOpened(open: boolean): void {
        this.opened = open;
        this._enableAnimations();

        // If the mode is 'over'
        if (this.mode === 'over') {
            // If the drawer opens, show the overlay
            if (open) {
                this._showOverlay();
            }
            // Otherwise, close the overlay
            else {
                this._hideOverlay();
            }
        }

        // Execute the observable
        this.openedChanged.next(open);
    }
}
