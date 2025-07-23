import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageDisplayComponent} from './image-display/image-display.component';


@NgModule({
    declarations: [
        ImageDisplayComponent
    ],
    exports: [
        ImageDisplayComponent
    ],
    imports: [
        CommonModule
    ]
})
export class ImageDisplayModule {
}
