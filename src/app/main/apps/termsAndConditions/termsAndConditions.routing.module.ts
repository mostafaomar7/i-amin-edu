import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NewTermsAndConditionsComponent } from "./new-termsAndConditions/new-termsAndConditions.component";

// routing
const routes: Routes = [
  {
    path: "view/:id",
    component: NewTermsAndConditionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsAndConditionsRoutingModule {}
