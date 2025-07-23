import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotificationListComponent } from "./notification-list/notification-list.component";
import { NewNotificationComponent } from "./new-notification/new-notification.component";

// routing
const routes: Routes = [
  {
    path: "list",
    component: NotificationListComponent,
    data: { animation: "NotificationListComponent" },
  },
  {
    path: "list/new",
    component: NewNotificationComponent,
  },
  {
    path: "list/new/:id",
    component: NewNotificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRoutingModule {}
