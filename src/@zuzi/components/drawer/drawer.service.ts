import { Injectable } from '@angular/core';
import { ZuziDrawerComponent } from '@zuzi/components/drawer/drawer.component';

@Injectable({
    providedIn: 'root',
})
export class ZuziDrawerService {
    private _componentRegistry: Map<string, ZuziDrawerComponent> = new Map<
        string,
        ZuziDrawerComponent
    >();

    constructor() {}

    registerComponent(name: string, component: ZuziDrawerComponent): void {
        this._componentRegistry.set(name, component);
    }

    deregisterComponent(name: string): void {
        this._componentRegistry.delete(name);
    }

    getComponent(name: string): ZuziDrawerComponent | undefined {
        return this._componentRegistry.get(name);
    }
}
