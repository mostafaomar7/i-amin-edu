import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';

import {CoreCommonModule} from '@core/common.module';
import {CoreDirectivesModule} from '@core/directives/directives';
import {CorePipesModule} from '@core/pipes/pipes.module';
import {CoreSidebarModule} from '@core/components';
import {FileUploadModule} from 'ng2-file-upload';
import {TranslateModule} from '@ngx-translate/core';
import {CourseClassListService} from './courseClass-list.service';
import {CourseClassListComponent} from './courseClass-list/courseClass-list.component';
import {NewCourseClassComponent} from './new-courseClass/new-courseClass.component';
import {CourseClassRoutingModule} from './courseClass.routing.module';
import {NgxLiteVimeoModule} from '../../../../@shared/@libs/ng-video-player/components';

@NgModule({
    declarations: [CourseClassListComponent, NewCourseClassComponent],
    exports: [CourseClassListComponent],
    imports: [
        CommonModule,
        CourseClassRoutingModule,
        CoreCommonModule,
        FormsModule,
        NgbModule,
        NgSelectModule,
        Ng2FlatpickrModule,
        NgxDatatableModule,
        CorePipesModule,
        CoreDirectivesModule,
        CoreSidebarModule,
        FileUploadModule,
        TranslateModule,
        NgxLiteVimeoModule
    ],
    providers: [CourseClassListService]
})
export class CourseClassModule {
}
