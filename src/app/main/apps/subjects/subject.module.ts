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
import { SubjectListComponent } from './subject-list/subject-list.component';
import { SubjectListService } from './subject-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { SubjectRoutingModule } from './subject.routing.module';
import { NewSubjectComponent } from './new-subject/new-subject.component';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionListService } from 'app/main/users/permissions/permission-list.service';

@NgModule({
  declarations: [SubjectListComponent, NewSubjectComponent],
  imports: [
    CommonModule,
    SubjectRoutingModule,
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
  providers: [SubjectListService, PermissionListService]
})
export class SubjectModule { }
