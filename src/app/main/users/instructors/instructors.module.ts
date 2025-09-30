import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
import { InstructorsListService } from './instructors-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { InstructorsRoutingModule } from './instructors.routing.module';
import { NewInstructorsComponent } from './new-instructor/new-instructors.component';
import { TranslateModule } from '@ngx-translate/core';
import { SubjectListService } from 'app/main/apps/subjects/subject-list.service';
import { PortalListService } from 'app/main/apps/portals/portal-list.service';
import { PermissionListService } from '../permissions/permission-list.service';
import { InstructorsListComponent } from './instructors-list/instructors-list.component';
import { BrokerService } from '../admin-brokers/broker.service';

@NgModule({
  declarations: [InstructorsListComponent, NewInstructorsComponent ],
  exports: [InstructorsListComponent],
  imports: [
    CommonModule,
    InstructorsRoutingModule,
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
    ReactiveFormsModule
  ],
  providers: [InstructorsListService, PortalListService, SubjectListService, PermissionListService , BrokerService]
})
export class InstructorsModule { }
