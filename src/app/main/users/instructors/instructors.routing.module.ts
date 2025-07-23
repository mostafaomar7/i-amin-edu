import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewInstructorsComponent } from './new-instructor/new-instructors.component';
import { InstructorsListComponent } from './instructors-list/instructors-list.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: InstructorsListComponent,
        data: { animation: 'InstructorsListComponent' }
    },
    {
        path: 'list/new',
        component: NewInstructorsComponent,
    },
    {
        path: 'list/new/:id',
        component: NewInstructorsComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class InstructorsRoutingModule { }