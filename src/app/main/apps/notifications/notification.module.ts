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
import { NotificationListComponent } from "./notification-list/notification-list.component";
import { NotificationListService } from "./notification-list.service";
import { FileUploadModule } from "ng2-file-upload";
import { NotificationRoutingModule } from "./notification.routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { NewNotificationComponent } from "./new-notification/new-notification.component";
import { PermissionListService } from "app/main/users/permissions/permission-list.service";

@NgModule({
  declarations: [NotificationListComponent, NewNotificationComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
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
  providers: [NotificationListService, PermissionListService],
})
export class NotificationModule {}
