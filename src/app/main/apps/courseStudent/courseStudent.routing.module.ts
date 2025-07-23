import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CourseStudentListComponent } from "./courseStudent-list/courseStudent-list.component";
import { NewCourseStudentComponent } from "./new-courseStudent/new-courseStudent.component";
import { CourseStudentPreviewComponent } from "./courseStudent-view/courseStudent-preview.component";

// routing
const routes: Routes = [
  {
    path: "list",
    component: CourseStudentListComponent,
    data: { animation: "CourseStudentListComponent" },
  },
  {
    path: "courseStudent-list/view",
    component: CourseStudentPreviewComponent,
  },
  {
    path: "list/new",
    component: NewCourseStudentComponent,
  },
  {
    path: "list/new/:id",
    component: NewCourseStudentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseStudentRoutingModule {}
