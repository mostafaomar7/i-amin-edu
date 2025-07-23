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
import { StudentListComponent } from './student-list/student-list.component';
import { StudentListService } from './student-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { StudentRoutingModule } from './student.routing.module';
import { NewStudentComponent } from './new-student/new-student.component';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionListService } from '../permissions/permission-list.service';

@NgModule({
  declarations: [StudentListComponent, NewStudentComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
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
    TranslateModule
  ],
  providers: [StudentListService, PermissionListService]
})
export class StudentModule { }
