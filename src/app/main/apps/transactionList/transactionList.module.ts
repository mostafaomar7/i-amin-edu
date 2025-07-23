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
import { TransactionListListService } from "./transactionList-list.service";
import { TransactionListListComponent } from "./transactionList-list/transactionList-list.component";
import { NewTransactionListComponent } from "./new-transactionList/new-transactionList.component";
import { TransactionListRoutingModule } from "./transactionList.routing.module";

@NgModule({
  declarations: [TransactionListListComponent, NewTransactionListComponent],
  exports: [TransactionListListComponent],
  imports: [
    CommonModule,
    TransactionListRoutingModule,
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
  providers: [TransactionListListService],
})
export class TransactionListModule {}
