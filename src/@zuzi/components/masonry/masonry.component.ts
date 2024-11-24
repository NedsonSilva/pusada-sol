import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { zuziAnimations } from '@zuzi/animations';
import { ZuziMediaWatcherService } from '@zuzi/services/media-watcher';

@Component({
    selector: 'zuzi-masonry',
    templateUrl: './masonry.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: zuziAnimations,
    exportAs: 'zuziMasonry',
})
export class ZuziMasonryComponent implements OnChanges, AfterViewInit {
    @Input() columnsTemplate: TemplateRef<any>;
    @Input() columns: number;
    @Input() items: any[] = [];
    distributedColumns: any[] = [];

    constructor(private _zuziMediaWatcherService: ZuziMediaWatcherService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('columns' in changes) {
            this._distributeItems();
        }
        if ('items' in changes) {
            this._distributeItems();
        }
    }

    ngAfterViewInit(): void {
        this._distributeItems();
    }

    private _distributeItems(): void {
        // Return an empty array if there are no items
        if (this.items.length === 0) {
            this.distributedColumns = [];
            return;
        }

        // Prepare the distributed columns array
        this.distributedColumns = Array.from(Array(this.columns), (item) => ({
            items: [],
        }));

        // Distribute the items to columns
        for (let i = 0; i < this.items.length; i++) {
            this.distributedColumns[i % this.columns].items.push(this.items[i]);
        }
    }
}
