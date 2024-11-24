import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { zuziAnimations } from '@zuzi/animations';
import { ZuziNavigationService } from '@zuzi/components/navigation/navigation.service';
import {
    ZuziNavItem,
    ZuziVerticalNavAppearance,
    ZuziVerticalNavMode,
    ZuziVerticalNavPosition,
} from '@zuzi/components/navigation/navigation.types';
import { ZuziScrollbarDirective } from '@zuzi/directives/scrollbar/scrollbar.directive';
import { ZuziUtilsService } from '@zuzi/services/utils/utils.service';
import { delay, filter, merge, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    selector: 'zuzi-vertical-nav',
    templateUrl: './vertical.component.html',
    styleUrls: ['./vertical.component.scss'],
    animations: zuziAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'zuziVerticalNav',
})
export class ZuziVerticalNavComponent
    implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
    static ngAcceptInputType_inner: BooleanInput;
    static ngAcceptInputType_opened: BooleanInput;
    static ngAcceptInputType_transparentOverlay: BooleanInput;

    @Input() appearance: ZuziVerticalNavAppearance = 'default';
    @Input() autoCollapse: boolean = true;
    @Input() inner: boolean = false;
    @Input() mode: ZuziVerticalNavMode = 'side';
    @Input() name: string = this._zuziUtilsService.randomId();
    @Input() navigation: ZuziNavItem[];
    @Input() opened: boolean = true;
    @Input() position: ZuziVerticalNavPosition = 'left';
    @Input() transparentOverlay: boolean = false;
    @Output() readonly appearanceChanged = new EventEmitter<ZuziVerticalNavAppearance>();
    @Output() readonly modeChanged = new EventEmitter<ZuziVerticalNavMode>();
    @Output() readonly openedChanged = new EventEmitter<boolean>();
    @Output() readonly positionChanged = new EventEmitter<ZuziVerticalNavPosition>();
    @ViewChild('navigationContent') private _navigationContentEl: ElementRef;

    activeAsideItemId: string | null = null;
    onCollapsableItemCollapsed: ReplaySubject<ZuziNavItem> =
        new ReplaySubject<ZuziNavItem>(1);
    onCollapsableItemExpanded: ReplaySubject<ZuziNavItem> =
        new ReplaySubject<ZuziNavItem>(1);
    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _animationsEnabled: boolean = false;
    private _asideOverlay: HTMLElement;
    private readonly _handleAsideOverlayClick: any;
    private readonly _handleOverlayClick: any;
    private _hovered: boolean = false;
    private _mutationObserver: MutationObserver;
    private _overlay: HTMLElement;
    private _player: AnimationPlayer;
    private _scrollStrategy: ScrollStrategy =
        this._scrollStrategyOptions.block();
    private _zuziScrollbarDirectives!: QueryList<ZuziScrollbarDirective>;
    private _zuziScrollbarDirectivesSubscription: Subscription;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _animationBuilder: AnimationBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: Document,
        private _elementRef: ElementRef,
        private _renderer2: Renderer2,
        private _router: Router,
        private _scrollStrategyOptions: ScrollStrategyOptions,
        private _ZuziNavigationService: ZuziNavigationService,
        private _zuziUtilsService: ZuziUtilsService
    ) {
        this._handleAsideOverlayClick = (): void => {
            this.closeAside();
        };
        this._handleOverlayClick = (): void => {
            this.close();
        };
    }


    @HostBinding('class') get classList(): any {
        return {
            'zuzi-vertical-navigation-animations-enabled':
                this._animationsEnabled,
            [`zuzi-vertical-navigation-appearance-${this.appearance}`]: true,
            'zuzi-vertical-navigation-hover': this._hovered,
            'zuzi-vertical-navigation-inner': this.inner,
            'zuzi-vertical-navigation-mode-over': this.mode === 'over',
            'zuzi-vertical-navigation-mode-side': this.mode === 'side',
            'zuzi-vertical-navigation-opened': this.opened,
            'zuzi-vertical-navigation-position-left': this.position === 'left',
            'zuzi-vertical-navigation-position-right':
                this.position === 'right',
        };
    }

    @HostBinding('style') get styleList(): any {
        return {
            visibility: this.opened ? 'visible' : 'hidden',
        };
    }

    @ViewChildren(ZuziScrollbarDirective)
    set zuziScrollbarDirectives(
        zuziScrollbarDirectives: QueryList<ZuziScrollbarDirective>
    ) {
        // Store the directives
        this._zuziScrollbarDirectives = zuziScrollbarDirectives;

        // Return if there are no directives
        if (zuziScrollbarDirectives.length === 0) {
            return;
        }

        // Unsubscribe the previous subscriptions
        if (this._zuziScrollbarDirectivesSubscription) {
            this._zuziScrollbarDirectivesSubscription.unsubscribe();
        }

        // Update the scrollbars on collapsable items' collapse/expand
        this._zuziScrollbarDirectivesSubscription = merge(
            this.onCollapsableItemCollapsed,
            this.onCollapsableItemExpanded
        )
            .pipe(takeUntil(this._unsubscribeAll), delay(250))
            .subscribe(() => {
                // Loop through the scrollbars and update them
                zuziScrollbarDirectives.forEach((zuziScrollbarDirective) => {
                    zuziScrollbarDirective.update();
                });
            });
    }

    @HostListener('mouseenter')
    private _onMouseenter(): void {
        this._enableAnimations();
        // this._hovered = true;
    }


    @HostListener('mouseleave')
    private _onMouseleave(): void {
        this._enableAnimations();
        this._hovered = false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('appearance' in changes) {
            this.appearanceChanged.next(changes.appearance.currentValue);
        }

        // Inner
        if ('inner' in changes) {
            // Coerce the value to a boolean
            this.inner = coerceBooleanProperty(changes.inner.currentValue);
        }

        // Mode
        if ('mode' in changes) {
            // Get the previous and current values
            const currentMode = changes.mode.currentValue;
            const previousMode = changes.mode.previousValue;

            // Disable the animations
            this._disableAnimations();

            // If the mode changes: 'over -> side'
            if (previousMode === 'over' && currentMode === 'side') {
                // Hide the overlay
                this._hideOverlay();
            }

            // If the mode changes: 'side -> over'
            if (previousMode === 'side' && currentMode === 'over') {
                // Close the aside
                this.closeAside();

                // If the navigation is opened
                if (this.opened) {
                    // Show the overlay
                    this._showOverlay();
                }
            }

            // Execute the observable
            this.modeChanged.next(currentMode);

            // Enable the animations after a delay
            // The delay must be bigger than the current transition-duration
            // to make sure nothing will be animated while the mode changing
            setTimeout(() => {
                this._enableAnimations();
            }, 500);
        }

        // Navigation
        if ('navigation' in changes) {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }

        // Opened
        if ('opened' in changes) {
            // Coerce the value to a boolean
            this.opened = coerceBooleanProperty(changes.opened.currentValue);

            // Open/close the navigation
            this._toggleOpened(this.opened);
        }

        // Position
        if ('position' in changes) {
            // Execute the observable
            this.positionChanged.next(changes.position.currentValue);
        }

        // Transparent overlay
        if ('transparentOverlay' in changes) {
            // Coerce the value to a boolean
            this.transparentOverlay = coerceBooleanProperty(
                changes.transparentOverlay.currentValue
            );
        }
    }

    ngOnInit(): void {
        if (this.name === '') {
            this.name = this._zuziUtilsService.randomId();
        }

        this._ZuziNavigationService.registerComponent(this.name, this);

        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                // If the mode is 'over' and the navigation is opened...
                if (this.mode === 'over' && this.opened) {
                    // Close the navigation
                    this.close();
                }

                // If the mode is 'side' and the aside is active...
                if (this.mode === 'side' && this.activeAsideItemId) {
                    // Close the aside
                    this.closeAside();
                }
            });
    }

    ngAfterViewInit(): void {
        // Fix for Firefox.
        //
        // Because 'position: sticky' doesn't work correctly inside a 'position: fixed' parent,
        // adding the '.cdk-global-scrollblock' to the html element breaks the navigation's position.
        // This fixes the problem by reading the 'top' value from the html element and adding it as a
        // 'marginTop' to the navigation itself.
        this._mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const mutationTarget = mutation.target as HTMLElement;
                if (mutation.attributeName === 'class') {
                    if (
                        mutationTarget.classList.contains(
                            'cdk-global-scrollblock'
                        )
                    ) {
                        const top = parseInt(mutationTarget.style.top, 10);
                        this._renderer2.setStyle(
                            this._elementRef.nativeElement,
                            'margin-top',
                            `${Math.abs(top)}px`
                        );
                    } else {
                        this._renderer2.setStyle(
                            this._elementRef.nativeElement,
                            'margin-top',
                            null
                        );
                    }
                }
            });
        });
        this._mutationObserver.observe(this._document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        setTimeout(() => {
            // Return if 'navigation content' element does not exist
            if (!this._navigationContentEl) {
                return;
            }

            // If 'navigation content' element doesn't have
            // perfect scrollbar activated on it...
            if (
                !this._navigationContentEl.nativeElement.classList.contains(
                    'ps'
                )
            ) {
                // Find the active item
                const activeItem =
                    this._navigationContentEl.nativeElement.querySelector(
                        '.zuzi-vertical-navigation-item-active'
                    );

                // If the active item exists, scroll it into view
                if (activeItem) {
                    activeItem.scrollIntoView();
                }
            }
            // Otherwise
            else {
                // Go through all the scrollbar directives
                this._zuziScrollbarDirectives.forEach(
                    (zuziScrollbarDirective) => {
                        // Skip if not enabled
                        if (!zuziScrollbarDirective.isEnabled()) {
                            return;
                        }

                        // Scroll to the active element
                        zuziScrollbarDirective.scrollToElement(
                            '.zuzi-vertical-navigation-item-active',
                            -120,
                            true
                        );
                    }
                );
            }
        });
    }

    ngOnDestroy(): void {
        this._mutationObserver.disconnect();
        this.close();
        this.closeAside();
        this._ZuziNavigationService.deregisterComponent(this.name);
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    refresh(): void {
        this._changeDetectorRef.markForCheck();
        this.onRefreshed.next(true);
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

        this.closeAside();
        this._toggleOpened(false);
    }

    toggle(): void {
        if (this.opened) {
            this.close();
        } else {
            this.open();
        }
    }

    openAside(item: ZuziNavItem): void {
        if (item.disabled || !item.id) {
            return;
        }
        this.activeAsideItemId = item.id;
        this._showAsideOverlay();
        this._changeDetectorRef.markForCheck();
    }

    closeAside(): void {
        this.activeAsideItemId = null;
        this._hideAsideOverlay();
        this._changeDetectorRef.markForCheck();
    }

    toggleAside(item: ZuziNavItem): void {
        if (this.activeAsideItemId === item.id) {
            this.closeAside();
        } else {
            this.openAside(item);
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
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
        if (this._asideOverlay) {
            return;
        }

        // Create the overlay element
        this._overlay = this._renderer2.createElement('div');

        // Add a class to the overlay element
        this._overlay.classList.add('zuzi-vertical-navigation-overlay');

        // Add a class depending on the transparentOverlay option
        if (this.transparentOverlay) {
            this._overlay.classList.add(
                'zuzi-vertical-navigation-overlay-transparent'
            );
        }

        // Append the overlay to the parent of the navigation
        this._renderer2.appendChild(
            this._elementRef.nativeElement.parentElement,
            this._overlay
        );

        // Enable block scroll strategy
        this._scrollStrategy.enable();

        // Create the enter animation and attach it to the player
        this._player = this._animationBuilder
            .build([
                animate(
                    '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({ opacity: 1 })
                ),
            ])
            .create(this._overlay);

        // Play the animation
        this._player.play();

        // Add an event listener to the overlay
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

            // Disable block scroll strategy
            this._scrollStrategy.disable();
        });
    }

    private _showAsideOverlay(): void {
        // Return if there is already an overlay
        if (this._asideOverlay) {
            return;
        }

        // Create the aside overlay element
        this._asideOverlay = this._renderer2.createElement('div');

        // Add a class to the aside overlay element
        this._asideOverlay.classList.add(
            'zuzi-vertical-navigation-aside-overlay'
        );

        // Append the aside overlay to the parent of the navigation
        this._renderer2.appendChild(
            this._elementRef.nativeElement.parentElement,
            this._asideOverlay
        );

        // Create the enter animation and attach it to the player
        this._player = this._animationBuilder
            .build([
                animate(
                    '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({ opacity: 1 })
                ),
            ])
            .create(this._asideOverlay);

        // Play the animation
        this._player.play();

        // Add an event listener to the aside overlay
        this._asideOverlay.addEventListener(
            'click',
            this._handleAsideOverlayClick
        );
    }

    private _hideAsideOverlay(): void {
        if (!this._asideOverlay) {
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
            .create(this._asideOverlay);

        // Play the animation
        this._player.play();

        this._player.onDone(() => {
            if (this._asideOverlay) {
                this._asideOverlay.removeEventListener(
                    'click',
                    this._handleAsideOverlayClick
                );

                this._asideOverlay.parentNode.removeChild(this._asideOverlay);
                this._asideOverlay = null;
            }
        });
    }

    private _toggleOpened(open: boolean): void {
        this.opened = open;
        this._enableAnimations();

        if (this.mode === 'over') {
            if (this.opened) {
                this._showOverlay();
            } else {
                this._hideOverlay();
            }
        }
        this.openedChanged.next(open);
    }
}
