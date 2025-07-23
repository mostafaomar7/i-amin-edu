import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SupportListComponent } from "./support-list/support-list.component";
import { NewSupportComponent } from "./new-support/new-support.component";

// routing
const routes: Routes = [
  {
    path: "list",
    component: SupportListComponent,
    data: { animation: "SupportListComponent" },
  },
  {
    path: "list/new",
    component: NewSupportComponent,
  },
  {
    path: "list/new/:id",
    component: NewSupportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
