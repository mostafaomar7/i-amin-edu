import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { NewSubjectComponent } from './new-subject/new-subject.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: SubjectListComponent,
        data: { animation: 'SubjectListComponent' }
    },
    {
        path: 'list/new',
        component: NewSubjectComponent,
    },
    {
        path: 'list/new/:id',
        component: NewSubjectComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SubjectRoutingModule { }