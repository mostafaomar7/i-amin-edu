import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseListService } from './course-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { CourseRoutingModule } from './course.routing.module';
import { NewCourseComponent } from './new-course/new-course.component';
import { TranslateModule } from '@ngx-translate/core';
import { SubjectListService } from '../subjects/subject-list.service';
import { PortalListService } from '../portals/portal-list.service';
import { coursePreviewComponent } from './course-view/course-preview.component';
import { CourseOverviewComponent } from './course-view/course-overview/course-overview.component';
import { StageListService } from '../stages/stage-list.service';
import { InstructorsListService } from 'app/main/users/instructors/instructors-list.service';
import { CourseClassModule } from '../courseClass/courseClass.module';
import { PermissionListService } from 'app/main/users/permissions/permission-list.service';
import { CourseStudentModule } from '../courseStudent/courseStudent.module';

@NgModule({
  declarations: [CourseListComponent, NewCourseComponent, coursePreviewComponent, CourseOverviewComponent],
  exports: [CourseListComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
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
    CourseClassModule,
    CourseStudentModule
  ],
  providers: [CourseListService, SubjectListService, PortalListService, StageListService, InstructorsListService, PermissionListService]
})
export class CourseModule { }
