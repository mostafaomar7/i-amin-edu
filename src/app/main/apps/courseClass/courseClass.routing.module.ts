import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseClassListComponent } from './courseClass-list/courseClass-list.component';
import { NewCourseClassComponent } from './new-courseClass/new-courseClass.component';
import { CourseClassPreviewComponent } from './courseClass-view/courseClass-preview.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: CourseClassListComponent,
        data: { animation: 'CourseClassListComponent' }
    },
    {
        path: 'courseClass-list/view',
        component: CourseClassPreviewComponent,
    },
    {
        path: 'list/new',
        component: NewCourseClassComponent,
    },
    {
        path: 'list/new/:id',
        component: NewCourseClassComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CourseClassRoutingModule { }