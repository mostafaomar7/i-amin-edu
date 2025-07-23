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
import { FileUploadModule } from 'ng2-file-upload';
import { TranslateModule } from '@ngx-translate/core';
import { PortalListService } from './portal-list.service';
import { PortalListComponent } from './portal-list/portal-list.component';
import { NewPortalComponent } from './new-portal/new-portal.component';
import { PortalRoutingModule } from './portal.routing.module';
import { PermissionListService } from 'app/main/users/permissions/permission-list.service';

@NgModule({
  declarations: [PortalListComponent, NewPortalComponent],
  imports: [
    CommonModule,
    PortalRoutingModule,
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
  providers: [PortalListService, PermissionListService]
})
export class PortalModule { }
