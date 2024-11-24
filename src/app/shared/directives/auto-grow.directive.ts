import { Directive, ElementRef, HostListener, Input, Renderer2 } from "@angular/core";

@Directive({
    selector: '[autoGrow]',
    standalone: true
})
export class AutoGrowDirective {
    @Input() adjustParent = true;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    @HostListener('input', ['$event.target'])
    onInput(element: HTMLInputElement | HTMLTextAreaElement): void {
        this.handleAdjust(element);
    }

    ngAfterViewInit() {
        this.handleAdjust(this.el.nativeElement);
    }

    handleAdjust(element: HTMLInputElement | HTMLTextAreaElement) {
        if (element instanceof HTMLInputElement) {
            this.adjustInputWidth(element);
        }
        else if (element instanceof HTMLTextAreaElement) {
            this.adjustTextAreaHeight(element);
        }
        else {
            console.warn('AutoGrowDirective', 'Element is not supported')
        }
    }

    adjustInputWidth(input: HTMLInputElement): void {
        this.renderer.setStyle(input, 'width', 'auto');
        this.renderer.setStyle(input, 'width', input.scrollWidth + 2 + 'px');

        if (this.adjustParent) {
            this.adjustParentElementWidth(input.parentElement, input.scrollWidth);
        }
    }

    adjustTextAreaHeight(textArea: HTMLTextAreaElement): void {
        this.renderer.setStyle(textArea, 'height', 'auto');
        this.renderer.setStyle(textArea, 'height', textArea.scrollHeight + 'px');
    }

    adjustParentElementWidth(element: HTMLElement, width) {
        const currentWidth = element.clientWidth;
        if (currentWidth > width) return;
        element.style.width = width + 'px';
    }
}
