import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { NewStudentComponent } from './new-student/new-student.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: StudentListComponent,
        data: { animation: 'StudentListComponent' }
    },
    {
        path: 'list/new',
        component: NewStudentComponent,
    },
    {
        path: 'list/new/:id',
        component: NewStudentComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class StudentRoutingModule { }