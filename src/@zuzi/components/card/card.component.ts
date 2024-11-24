import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, HostBinding, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { zuziAnimations } from '@zuzi/animations';
import { FuseCardFace } from '@zuzi/components/card/card.types';

@Component({
    selector: 'zuzi-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: zuziAnimations,
    exportAs: 'zuziCard',
})
export class ZuziCardComponent implements OnChanges {
    static ngAcceptInputType_expanded: BooleanInput;
    static ngAcceptInputType_flippable: BooleanInput;

    @Input() expanded: boolean = false;
    @Input() face: FuseCardFace = 'front';
    @Input() flippable: boolean = false;

    constructor() {}

    @HostBinding('class') get classList(): any {
        return {
            'zuzi-card-expanded': this.expanded,
            'zuzi-card-face-back': this.flippable && this.face === 'back',
            'zuzi-card-face-front': this.flippable && this.face === 'front',
            'zuzi-card-flippable': this.flippable,
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('expanded' in changes) {
            this.expanded = coerceBooleanProperty(
                changes.expanded.currentValue
            );
        }

        if ('flippable' in changes) {
            this.flippable = coerceBooleanProperty(
                changes.flippable.currentValue
            );
        }
    }
}
