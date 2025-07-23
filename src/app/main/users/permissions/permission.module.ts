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
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionListService } from './permission-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { PermissionRoutingModule } from './permission.routing.module';
import { NewPermissionComponent } from './new-permission/new-permission.component';
import { TranslateModule } from '@ngx-translate/core';
import { SubjectListService } from 'app/main/apps/subjects/subject-list.service';
import { PortalListService } from 'app/main/apps/portals/portal-list.service';

@NgModule({
  declarations: [PermissionListComponent, NewPermissionComponent],
  imports: [
    CommonModule,
    PermissionRoutingModule,
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
  providers: [PermissionListService, PortalListService, SubjectListService]
})
export class PermissionModule { }
