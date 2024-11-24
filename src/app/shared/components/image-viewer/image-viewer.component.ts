import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    input,
    model,
    OnChanges,
    OnInit,
    Output,
    signal,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import { CustomImageEvent, ImageViewerConfig } from './image-viewer.types';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule } from '@angular/material/button';

const DEFAULT_CONFIG: ImageViewerConfig = {
    btnClass: 'default',
    zoomFactor: 0.1,
    containerBackgroundColor: '#e4dede',
    primaryColor: '',
    wheelZoom: false,
    allowKeyboardNavigation: true,
    btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true,
    },
    btnIcons: {
        zoomIn: 'fa fa-plus',
        zoomOut: 'fa fa-minus',
        rotateClockwise: 'fa fa-refresh',
        rotateCounterClockwise: 'fa fa-undo',
        next: 'fa fa-chevron-right',
        prev: 'fa fa-chevron-left',
        fullscreen: 'fa fa-arrows-alt',
    },
};

@Component({
    selector: 'app-image-viewer',
    standalone: true,
    imports: [DragDropModule, CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit, OnChanges {
    @ViewChild(CdkDrag, { static: true }) cdkDrag!: CdkDrag;

    @Input()
    src: string[] = [];

    @Input()
    screenHeightOccupied = 0; // In Px

    readonly imageName = input<string>();

    @Input()
    footerTexts = [
        'Imagem',
        'de',
        'Ver imagem anterior ou seguinte',
        'usando < > no teclado',
    ];

    @Output()
    customImageEvent: EventEmitter<CustomImageEvent> = new EventEmitter();

    readonly index = model<number>(0);
    readonly config = model<ImageViewerConfig>(DEFAULT_CONFIG);

    styleHeight = '98vh';

    style = {
        transform: '',
        msTransform: '',
        oTransform: '',
        webkitTransform: '',
    };

    readonly loading = signal<boolean>(true);
    isDragOn = false;

    private _scale = 1;
    private _rotation = 0;
    private _hovered = false;

    ngOnInit(): void { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['screenHeightOccupied']) {
            this.styleHeight =
                'calc(98vh - ' + this.screenHeightOccupied + 'px)';
        } else if (changes['index']) {
            this.reset();
        }
    }

    @HostListener('window:keyup.ArrowRight', ['$event'])
    nextImage(event: MouseEvent) {
        if (this.canNavigate(event) && this.index() < this.src.length - 1) {
            this.loading.set(true);
            this.index.update((i) => i + 1);
            this.fireCustomEvent('next', this.index());
            this.reset();
        }
    }

    @HostListener('window:keyup.ArrowLeft', ['$event'])
    prevImage(event: MouseEvent) {
        if (this.canNavigate(event) && this.index() > 0) {
            this.loading.set(true);
            this.index.update((i) => i - 1);
            this.fireCustomEvent('prev', this.index());
            this.reset();
        }
    }

    zoomIn() {
        this._scale *= 1 + this.unwrap(this.config().zoomFactor);
        this.fireCustomEvent('zoomIn', this._scale);
        this.updateStyle();
    }

    zoomOut() {
        if (this._scale > this.unwrap(this.config().zoomFactor)) {
            this._scale /= 1 + this.unwrap(this.config().zoomFactor);
        }
        this.fireCustomEvent('zoomOut', this._scale);
        this.updateStyle();
    }

    scrollZoom(evt: WheelEvent) {
        if (this.config().wheelZoom) {
            evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
            return false;
        }

        return true;
    }

    rotateClockwise() {
        this._rotation += 90;
        this.fireCustomEvent('rotateClockwise', this._rotation);
        this.updateStyle();
    }

    rotateCounterClockwise() {
        this._rotation -= 90;
        this.updateStyle();
    }

    onLoad() {
        this.loading.set(false);
    }

    onLoadStart() {
        this.loading.set(true);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    imageNotFound() {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDragStart(evt: any) {
        if (
            evt.source._dragRef._initialTransform &&
            evt.source._dragRef._initialTransform.length > 0
        ) {
            const myTranslate =
                evt.source._dragRef._initialTransform.split(' rotate')[0];
            const myRotate = this.style.transform.split(' rotate')[1];
            evt.source._dragRef._initialTransform = `${myTranslate} rotate${myRotate}`;
        } else {
            evt.source._dragRef._initialTransform = this.style.transform;
        }
    }

    fireCustomEvent(name: string, imageIndex: number) {
        this.customImageEvent.emit(new CustomImageEvent(name, imageIndex));
    }

    reset() {
        this._scale = 1;
        this._rotation = 0;
        this.updateStyle();
        this.cdkDrag.reset();
    }

    @HostListener('mouseover')
    onMouseOver() {
        this._hovered = true;
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this._hovered = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private canNavigate(event: any) {
        if (event.type === 'keyup') {
            return this.config().allowKeyboardNavigation && this._hovered;
        } else if (event.type === 'click') {
            return this._hovered;
        }

        return null;
    }

    private updateStyle() {
        this.style.transform = `rotate(${this._rotation}deg) scale(${this._scale})`;
    }

    private unwrap = (n: number | undefined): number => (n ? n : 0);
}
