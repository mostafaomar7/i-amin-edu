import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { NewCourseComponent } from './new-course/new-course.component';
import { coursePreviewComponent } from './course-view/course-preview.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: CourseListComponent,
        data: { animation: 'CourseListComponent' }
    },
    {
        path: 'list/view',
        component: coursePreviewComponent
    },
    {
        path: 'list/new',
        component: NewCourseComponent,
    },
    {
        path: 'list/new/:id',
        component: NewCourseComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CourseRoutingModule { }