import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { Ng2FlatpickrModule } from "ng2-flatpickr";

import { CoreCommonModule } from "@core/common.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreSidebarModule } from "@core/components";
import { FileUploadModule } from "ng2-file-upload";
import { TranslateModule } from "@ngx-translate/core";
import { CourseStudentListService } from "./courseStudent-list.service";
import { CourseStudentListComponent } from "./courseStudent-list/courseStudent-list.component";
import { NewCourseStudentComponent } from "./new-courseStudent/new-courseStudent.component";
import { CourseStudentRoutingModule } from "./courseStudent.routing.module";

@NgModule({
  declarations: [CourseStudentListComponent, NewCourseStudentComponent],
  exports: [CourseStudentListComponent],
  imports: [
    CommonModule,
    CourseStudentRoutingModule,
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
  ],
  providers: [CourseStudentListService],
})
export class CourseStudentModule {}
