import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EmbeddedViewRef,
    Input,
    OnChanges,
    Renderer2,
    SecurityContext,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ZuziHighlightService } from '@zuzi/components/highlight/highlight.service';

@Component({
    selector: 'textarea[zuzi-highlight]',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'zuziHighlight',
})
export class ZuziHighlightComponent implements OnChanges, AfterViewInit {
    @Input() code: string;
    @Input() lang: string;
    @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

    highlightedCode: string;
    private _viewRef: EmbeddedViewRef<any>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _domSanitizer: DomSanitizer,
        private _elementRef: ElementRef,
        private _renderer2: Renderer2,
        private _zuziHighlightService: ZuziHighlightService,
        private _viewContainerRef: ViewContainerRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        // Code & Lang
        if ('code' in changes || 'lang' in changes) {
            // Return if the viewContainerRef is not available
            if (!this._viewContainerRef.length) {
                return;
            }

            // Highlight and insert the code
            this._highlightAndInsert();
        }
    }

    ngAfterViewInit(): void {
        if (!this.lang) {
            return;
        }

        if (!this.code) {
            this.code = this._elementRef.nativeElement.value;
        }

        this._highlightAndInsert();
    }

    private _highlightAndInsert(): void {
        // Return if the template reference is not available
        if (!this.templateRef) {
            return;
        }

        // Return if the code or language is not defined
        if (!this.code || !this.lang) {
            return;
        }

        // Destroy the component if there is already one
        if (this._viewRef) {
            this._viewRef.destroy();
            this._viewRef = null;
        }

        // Highlight and sanitize the code just in case
        this.highlightedCode = this._domSanitizer.sanitize(
            SecurityContext.HTML,
            this._zuziHighlightService.highlight(this.code, this.lang)
        );

        // Return if the highlighted code is null
        if (this.highlightedCode === null) {
            return;
        }

        // Render and insert the template
        this._viewRef = this._viewContainerRef.createEmbeddedView(
            this.templateRef,
            {
                highlightedCode: this.highlightedCode,
                lang: this.lang,
            }
        );

        // Detect the changes
        this._viewRef.detectChanges();
    }
}
