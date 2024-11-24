import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SplitButtonComponent } from '../split-button.component';

@Component({
    selector: 'split-button-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitButtonItemComponent<T> implements OnInit {
    @Input() label: any;
    @Input() value: T;
    @Input() disabled: boolean;

    @Output() valueChange = new EventEmitter<T>();

    constructor(
        private _splitButtonComponent: SplitButtonComponent<T>,
    ) {}

    ngOnInit(): void {}

    handleClick() {
        this.valueChange.emit(this.value)
        this._splitButtonComponent.setSelected(this.value);
    }
}
