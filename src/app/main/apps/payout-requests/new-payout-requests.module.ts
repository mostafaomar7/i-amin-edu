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
import { PayoutRequestsListService } from './new-payout-requests-list.service';
import { NewPayoutRequestsComponent } from './new-payout-requests/new-payout-requests.component';
import { PayoutRequestsListComponent } from './payout-requests-list/payout-requests-list.component';
import { PayoutRequestsRoutingModule } from './new-payout-requests.routing.module';

@NgModule({
  declarations: [PayoutRequestsListComponent, NewPayoutRequestsComponent],
  exports: [PayoutRequestsListComponent],
  imports: [
    CommonModule,
    PayoutRequestsRoutingModule,
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
  providers: [PayoutRequestsListService]
})
export class PayoutRequestsModule { }
