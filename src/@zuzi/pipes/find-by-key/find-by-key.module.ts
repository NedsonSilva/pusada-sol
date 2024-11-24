import { NgModule } from '@angular/core';
import { ZuziFindByKeyPipe } from '@zuzi/pipes/find-by-key/find-by-key.pipe';

@NgModule({
    declarations: [ZuziFindByKeyPipe],
    exports: [ZuziFindByKeyPipe],
})
export class ZuziFindByKeyPipeModule {}
