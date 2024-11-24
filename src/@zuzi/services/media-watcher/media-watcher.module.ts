import { NgModule } from '@angular/core';
import { ZuziMediaWatcherService } from '@zuzi/services/media-watcher/media-watcher.service';

@NgModule({
    providers: [ZuziMediaWatcherService],
})
export class ZuziMediaWatcherModule {
  
    constructor(private _zuziMediaWatcherService: ZuziMediaWatcherService) {}
}
