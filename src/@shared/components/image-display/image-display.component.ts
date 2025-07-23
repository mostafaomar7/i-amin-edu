import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-image-display',
    templateUrl: './image-display.component.html',
    styleUrls: ['./image-display.component.scss']
})
export class ImageDisplayComponent implements OnInit {
    @Input() width: string = '200px';
    @Input() height: string = '200px';
    @Input() src: string = '';
    @Input() classes: string = '';
    @Input() defaultSrc: string = 'assets/default-image.png';

    constructor() {
    }

    handleError(event: Event) {
        (event.target as HTMLImageElement).src = this.defaultSrc;
    }

    ngOnInit(): void {
    }

}
