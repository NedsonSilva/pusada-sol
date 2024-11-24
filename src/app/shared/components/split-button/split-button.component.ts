import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'split-button',
    templateUrl: './split-button.component.html',
    styleUrls: ['./split-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitButtonComponent<T> implements OnInit {
    @Input() label: string;
    @Input() styleClass: NgClass['ngClass'];
    @Input() selected: T = null;
    @Input() showIconMenu: boolean = true;
    @Input() disabled: boolean;

    @Output() selectedChange = new EventEmitter<T>();
    @Output() onClick = new EventEmitter<T>();

    loading: boolean;
    menuOpened: boolean;

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {}

    toggleMenu(value: boolean) {
        this.menuOpened = value;
        this.changeDetectorRef.markForCheck();
    }

    setSelected(value: T) {
        this.selected = value;
        this.selectedChange.emit(value);
        this.changeDetectorRef.markForCheck();
    }
}
