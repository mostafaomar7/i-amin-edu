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
import { StageListComponent } from './stage-list/stage-list.component';
import { StageListService } from './stage-list.service';
import { FileUploadModule } from 'ng2-file-upload';
import { StageRoutingModule } from './stage.routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NewStageComponent } from './new-stage/new-gate.component';
import { PermissionListService } from 'app/main/users/permissions/permission-list.service';

@NgModule({
  declarations: [StageListComponent, NewStageComponent],
  imports: [
    CommonModule,
    StageRoutingModule,
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
  providers: [StageListService, PermissionListService]
})
export class StageModule { }
