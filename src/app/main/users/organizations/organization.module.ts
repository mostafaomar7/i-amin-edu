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
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationListService } from './organization-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { OrganizationRoutingModule } from './organization.routing.module';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationPreviewComponent } from './organization-view/organization-preview.component';
import { OrganizationOverviewComponent } from './organization-view/organization-overview/organization-overview.component';
import { InstructorsModule } from '../instructors/instructors.module';
import { CourseModule } from 'app/main/apps/courses/course.module';
import { PayoutRequestsModule } from 'app/main/apps/payout-requests/new-payout-requests.module';
import { PermissionListService } from '../permissions/permission-list.service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';

@NgModule({
  declarations: [OrganizationListComponent, NewOrganizationComponent, OrganizationPreviewComponent, OrganizationOverviewComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
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
    InstructorsModule,
    CourseModule,
    PayoutRequestsModule
  ],
  exports: [OrganizationOverviewComponent],
  providers: [OrganizationListService, PermissionListService, DashboardService]
})
export class OrganizationModule { }
